import os
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles

from app.conversation import (
    ConversationError,
    create_session,
    find_logged_session,
    get_session,
    run_turn,
)
from app.models import ChatRequest, ChatResponse, ResearchBase, SessionSummary

app = FastAPI(title="Westaway Intake Concierge")

CALENDLY_URLS = {
    "kyle": os.environ.get("CALENDLY_KYLE_URL", ""),
    "stephanie": os.environ.get("CALENDLY_STEPHANIE_URL", ""),
}


# API routes are registered before the static mount below so the catch-all
# static handler can't shadow them.


@app.post("/chat", response_model=ChatResponse)
def chat(req: ChatRequest) -> ChatResponse:
    session = get_session(req.session_id) if req.session_id else None
    if session is None:
        # No session_id, or an unknown/expired one (e.g. after a redeploy) —
        # start fresh rather than error.
        session = create_session()

    try:
        result = run_turn(session, req.message)
    except ConversationError as exc:
        raise HTTPException(
            status_code=502, detail="assistant is temporarily unavailable"
        ) from exc

    calendly_url = CALENDLY_URLS.get(result["routing"] or "") if result["done"] else None

    return ChatResponse(
        session_id=session.session_id,
        reply=result["reply"],
        turn=session.turn_count,
        done=result["done"],
        routing=result["routing"],
        calendly_url=calendly_url or None,
    )


@app.get("/session-summary/{session_id}", response_model=SessionSummary)
def session_summary(session_id: str) -> SessionSummary:
    session = get_session(session_id)
    if session is not None:
        return SessionSummary(
            session_id=session.session_id,
            done=session.done,
            routing=session.routing,
            research_base=ResearchBase(**session.research_base),
            transcript=session.transcript,
            created_at=session.created_at,
        )

    # In-memory session gone (process restarted) — fall back to the JSONL log.
    logged = find_logged_session(session_id)
    if logged is not None:
        return SessionSummary(
            session_id=logged["session_id"],
            done=True,
            routing=logged.get("routing"),
            research_base=ResearchBase(**(logged.get("research_base") or {})),
            transcript=logged.get("transcript") or [],
            created_at=logged.get("created_at", ""),
        )

    raise HTTPException(status_code=404, detail="session not found")


@app.get("/health")
def health() -> dict:
    # Deliberately no Anthropic call here — a slow/erroring upstream API
    # shouldn't make Railway conclude this process is unhealthy and restart
    # it, which would drop every in-memory session.
    return {"status": "ok"}


STATIC_DIR = Path(__file__).resolve().parent / "static"
app.mount("/", StaticFiles(directory=str(STATIC_DIR), html=True), name="static")
