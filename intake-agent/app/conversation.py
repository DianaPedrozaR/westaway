"""Conversation engine: session store, system prompt, the Anthropic call, and
the server-side guardrails (turn cap, skip-ahead nudge, field merge, routing)
that we don't trust the model's own judgment for.
"""

import json
import os
import uuid
from pathlib import Path
from typing import Optional

import anthropic

from app.models import ENGAGEMENT_TYPES, FUNDING_STAGES, SessionState

MODEL = os.environ.get("CLAUDE_MODEL", "claude-opus-5")
MAX_TURNS = 4
SERIES_A_PLUS = {"Series A", "Series B", "Series C or beyond"}

_client: Optional[anthropic.Anthropic] = None


def _get_client() -> anthropic.Anthropic:
    global _client
    if _client is None:
        _client = anthropic.Anthropic().with_options(timeout=30.0)
    return _client


SYSTEM_PROMPT = """\
You are the Westaway Concierge — a senior legal strategist for startups, not a
licensed attorney. You are the first conversational touchpoint for a founder
who just clicked "Book Free Consult" on westaway.com. Your job in this chat is
narrow: understand what's going on well enough that Westaway's team walks into
the real call already prepared, not blindsided.

Tone: direct, founder-to-founder, efficient. Westaway pitches itself against
traditional billable-hour law firms — outcomes-led, not stuffy. You know the
jargon (SAFEs, 83(b) elections, 409A valuations, ESOP, Section 1202, cap
tables) and use it naturally when the founder does, without over-explaining.

You are NOT giving legal advice. Do not answer their legal question — your job
is to capture it clearly so the right person can answer it live on the call.

## Conversation budget
You have at most 3-4 total exchanges with the founder before handing off to
booking. If their first message already makes the core matter and their
specific question clear, skip straight to one closing question: "Is there
anything else our team should know to prepare for our meeting?" Only ask ONE
additional clarifying question in between if something important and specific
is genuinely missing — never ask more than one clarifying question before the
closing question. Set asked_closing_question to true on the turn where your
reply IS that closing question. Once the founder has answered it, wrap up
warmly in one or two sentences and set ready_for_handoff to true.

## What you're extracting (research_base)
On every turn, extract or update as much of this as you can from the
conversation so far:
- core_matter: the specific legal matter, e.g. "equity split between
  co-founders", "SAFE conversion", "IP assignment from a contractor".
- technical_markers: specific legal/financial terms they use verbatim, e.g.
  "83(b) election", "409A valuation", "Section 1202", "QSBS".
- hard_question: the specific question they are bringing to the call, in
  their own words. This is the single most important field — isolate it
  precisely.
- entity_name: their company name, if mentioned.
- website: their company website, if mentioned.
- funding_stage: one of "Just getting started", "Bootstrapped", "Pre-Seed",
  "Seed", "Series A", "Series B", "Series C or beyond" — only if stated or
  clearly implied.
- engagement_type: "questions_only" if they just have questions, "project" if
  they need one specific matter handled, "ongoing_gc" if they want ongoing
  monthly General Counsel support.
- source: how they heard about Westaway, only if they happen to mention it —
  never ask about this directly, it isn't worth spending a turn on.
- additional_context: anything else worth flagging (urgency, a co-founder
  dispute, a looming deadline).

Never invent a value for a field you don't have evidence for — leave it out
rather than guess. Once a field is established, keep restating it on later
turns so it isn't lost.

## Routing (context only — a human makes the final call)
Founders wanting ongoing General Counsel support at Series A or later tend to
go to Kyle Westaway (the firm's founder); everyone else — project-based work,
or anyone earlier-stage — tends to go to Stephanie on the business
development team. You don't need to tell the founder who they'll get; this is
just context for how you frame your closing question.
"""

RESPONSE_SCHEMA = {
    "type": "object",
    "properties": {
        "reply": {
            "type": "string",
            "description": "The conversational reply to show the founder next.",
        },
        "research_base": {
            "type": "object",
            "properties": {
                "core_matter": {"type": "string"},
                "technical_markers": {"type": "array", "items": {"type": "string"}},
                "hard_question": {"type": "string"},
                "entity_name": {"type": "string"},
                "website": {"type": "string"},
                "funding_stage": {"type": "string", "enum": FUNDING_STAGES},
                "engagement_type": {"type": "string", "enum": ENGAGEMENT_TYPES},
                "source": {"type": "string"},
                "additional_context": {"type": "string"},
            },
            "additionalProperties": False,
        },
        "asked_closing_question": {
            "type": "boolean",
            "description": "True if `reply` IS the closing question.",
        },
        "ready_for_handoff": {
            "type": "boolean",
            "description": "True once the closing question has been asked and answered.",
        },
    },
    "required": ["reply", "research_base", "asked_closing_question", "ready_for_handoff"],
    "additionalProperties": False,
}

_STRING_FIELDS = [
    "core_matter",
    "hard_question",
    "entity_name",
    "website",
    "funding_stage",
    "engagement_type",
    "source",
    "additional_context",
]


def merge_research_base(base: dict, update: dict) -> dict:
    """Field-by-field merge — a later turn that doesn't restate a field must
    not erase what an earlier turn already established."""
    merged = dict(base)
    for key in _STRING_FIELDS:
        new_val = update.get(key)
        if new_val:
            merged[key] = new_val

    existing_markers = list(merged.get("technical_markers") or [])
    for marker in update.get("technical_markers") or []:
        if marker and marker not in existing_markers:
            existing_markers.append(marker)
    merged["technical_markers"] = existing_markers
    return merged


def is_detailed_enough(research_base: dict) -> bool:
    """The skip-ahead bar: founders volunteer the matter and their question
    unprompted far more often than funding stage / engagement type, so those
    two are the trigger — not all four fields."""
    return bool(research_base.get("core_matter")) and bool(
        research_base.get("hard_question")
    )


def determine_routing(research_base: dict) -> str:
    """The one hard business rule. Computed deterministically here rather
    than trusted from the model's own guess."""
    if (
        research_base.get("engagement_type") == "ongoing_gc"
        and research_base.get("funding_stage") in SERIES_A_PLUS
    ):
        return "kyle"
    return "stephanie"


class ConversationError(Exception):
    """Raised when the Anthropic call fails or returns something we can't
    parse — the API layer turns this into a clean error response instead of
    a raw traceback."""


_SESSIONS: dict[str, SessionState] = {}


def create_session() -> SessionState:
    session = SessionState(session_id=str(uuid.uuid4()))
    _SESSIONS[session.session_id] = session
    return session


def get_session(session_id: str) -> Optional[SessionState]:
    return _SESSIONS.get(session_id)


def run_turn(session: SessionState, user_message: str) -> dict:
    """Send one user message, update session state in place, return
    {reply, done, routing} for the API layer."""
    session.turn_count += 1
    session.transcript.append({"role": "user", "text": user_message})

    content_blocks = []
    if session.pending_nudge:
        content_blocks.append(
            {"type": "text", "text": f"<context>{session.pending_nudge}</context>"}
        )
        session.pending_nudge = None
    content_blocks.append({"type": "text", "text": user_message})
    session.messages.append({"role": "user", "content": content_blocks})

    client = _get_client()
    try:
        response = client.messages.create(
            model=MODEL,
            max_tokens=3000,
            system=[
                {
                    "type": "text",
                    "text": SYSTEM_PROMPT,
                    "cache_control": {"type": "ephemeral"},
                }
            ],
            output_config={
                "format": {"type": "json_schema", "schema": RESPONSE_SCHEMA},
                "effort": "low",
            },
            messages=session.messages,
        )
        raw_text = next(
            block.text for block in response.content if block.type == "text"
        )
        data = json.loads(raw_text)
    except Exception as exc:
        # Roll back the user turn we just appended so a retry (same or next
        # message) starts from clean history instead of a dangling turn.
        session.messages.pop()
        session.transcript.pop()
        session.turn_count -= 1
        raise ConversationError(str(exc)) from exc

    # Store the raw JSON turn back into history — Claude then sees its own
    # prior extraction verbatim on the next call, reinforcing consistency.
    session.messages.append({"role": "assistant", "content": raw_text})

    reply = data.get("reply", "")
    session.transcript.append({"role": "assistant", "text": reply})

    session.research_base = merge_research_base(
        session.research_base, data.get("research_base") or {}
    )

    if data.get("asked_closing_question"):
        session.stage = "closing_asked"

    ready = bool(data.get("ready_for_handoff"))
    if session.turn_count >= MAX_TURNS:
        ready = True

    if not ready and session.stage != "closing_asked":
        if is_detailed_enough(session.research_base):
            session.pending_nudge = (
                "The founder has already given you enough to work with. In "
                'your next reply, ask the closing question: "Is there '
                'anything else our team should know to prepare for our '
                'meeting?" Do not ask another exploratory question.'
            )

    session.done = ready
    if ready:
        session.routing = determine_routing(session.research_base)
        _log_session(session)

    return {"reply": reply, "done": session.done, "routing": session.routing}


_LOG_PATH = Path(__file__).resolve().parent.parent / "data" / "sessions.jsonl"


def _log_session(session: SessionState) -> None:
    """Append-only durability/audit log. Note: Railway's container
    filesystem is ephemeral across redeploys — this survives mid-session but
    not a redeploy unless a Volume is mounted at this path. See README."""
    _LOG_PATH.parent.mkdir(parents=True, exist_ok=True)
    record = {
        "session_id": session.session_id,
        "created_at": session.created_at,
        "routing": session.routing,
        "research_base": session.research_base,
        "transcript": session.transcript,
    }
    with _LOG_PATH.open("a") as f:
        f.write(json.dumps(record) + "\n")


def find_logged_session(session_id: str) -> Optional[dict]:
    """Fallback read path for /session-summary when the process has
    restarted and the in-memory session is gone."""
    if not _LOG_PATH.exists():
        return None
    with _LOG_PATH.open() as f:
        for line in f:
            record = json.loads(line)
            if record["session_id"] == session_id:
                return record
    return None
