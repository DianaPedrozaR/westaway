from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel

FUNDING_STAGES = [
    "Just getting started",
    "Bootstrapped",
    "Pre-Seed",
    "Seed",
    "Series A",
    "Series B",
    "Series C or beyond",
]

ENGAGEMENT_TYPES = ["questions_only", "project", "ongoing_gc"]


class ResearchBase(BaseModel):
    core_matter: Optional[str] = None
    technical_markers: list[str] = []
    hard_question: Optional[str] = None
    entity_name: Optional[str] = None
    website: Optional[str] = None
    funding_stage: Optional[str] = None
    engagement_type: Optional[str] = None
    source: Optional[str] = None
    additional_context: Optional[str] = None


class ChatRequest(BaseModel):
    session_id: Optional[str] = None
    message: str


class ChatResponse(BaseModel):
    session_id: str
    reply: str
    turn: int
    done: bool
    routing: Optional[str] = None
    calendly_url: Optional[str] = None


class SessionSummary(BaseModel):
    session_id: str
    done: bool
    routing: Optional[str] = None
    research_base: ResearchBase
    transcript: list[dict]
    created_at: str


@dataclass
class SessionState:
    """In-memory conversation state. One process, one dict — see README for
    the single-worker/single-replica constraint this implies."""

    session_id: str
    messages: list[dict] = field(default_factory=list)  # raw Anthropic API history
    transcript: list[dict] = field(default_factory=list)  # human-readable {role, text}
    research_base: dict = field(default_factory=dict)
    turn_count: int = 0
    stage: str = "gathering"  # gathering -> closing_asked -> done
    pending_nudge: Optional[str] = None
    done: bool = False
    routing: Optional[str] = None
    created_at: str = field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )
