import { prisma } from "@/lib/prisma";

export const MAX_TURNS = 4;
const SERIES_A_PLUS = new Set(["Series A", "Series B", "Series C or beyond"]);

export const FUNDING_STAGES = [
  "Just getting started",
  "Bootstrapped",
  "Pre-Seed",
  "Seed",
  "Series A",
  "Series B",
  "Series C or beyond",
];

export const ENGAGEMENT_TYPES = ["questions_only", "project", "ongoing_gc"];

export type ResearchBase = {
  core_matter?: string;
  technical_markers?: string[];
  hard_question?: string;
  entity_name?: string;
  website?: string;
  funding_stage?: string;
  engagement_type?: string;
  source?: string;
  additional_context?: string;
};

export type IntakeTranscriptTurn = { role: "user" | "assistant"; text: string };

export const INTAKE_SYSTEM_PROMPT = `You are the Westaway Concierge — a senior legal strategist for startups, not a
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
just context for how you frame your closing question.`;

export const INTAKE_RESPONSE_SCHEMA = {
  type: "object" as const,
  properties: {
    reply: {
      type: "string",
      description: "The conversational reply to show the founder next.",
    },
    research_base: {
      type: "object",
      properties: {
        core_matter: { type: "string" },
        technical_markers: { type: "array", items: { type: "string" } },
        hard_question: { type: "string" },
        entity_name: { type: "string" },
        website: { type: "string" },
        funding_stage: { type: "string", enum: FUNDING_STAGES },
        engagement_type: { type: "string", enum: ENGAGEMENT_TYPES },
        source: { type: "string" },
        additional_context: { type: "string" },
      },
      additionalProperties: false,
    },
    asked_closing_question: {
      type: "boolean",
      description: "True if `reply` IS the closing question.",
    },
    ready_for_handoff: {
      type: "boolean",
      description: "True once the closing question has been asked and answered.",
    },
  },
  required: ["reply", "research_base", "asked_closing_question", "ready_for_handoff"],
  additionalProperties: false,
};

const STRING_FIELDS: (keyof ResearchBase)[] = [
  "core_matter",
  "hard_question",
  "entity_name",
  "website",
  "funding_stage",
  "engagement_type",
  "source",
  "additional_context",
];

// A later turn that doesn't restate a field must not erase what an earlier
// turn already established.
export function mergeResearchBase(base: ResearchBase, update: ResearchBase): ResearchBase {
  const merged: ResearchBase = { ...base };
  for (const key of STRING_FIELDS) {
    const newVal = update[key];
    if (newVal) merged[key] = newVal as never;
  }

  const existingMarkers = [...(merged.technical_markers ?? [])];
  for (const marker of update.technical_markers ?? []) {
    if (marker && !existingMarkers.includes(marker)) existingMarkers.push(marker);
  }
  merged.technical_markers = existingMarkers;
  return merged;
}

// The skip-ahead bar: founders volunteer the matter and their question
// unprompted far more often than funding stage / engagement type, so those
// two are the trigger — not all four fields.
export function isDetailedEnough(researchBase: ResearchBase): boolean {
  return Boolean(researchBase.core_matter) && Boolean(researchBase.hard_question);
}

// The one hard business rule. Computed deterministically here rather than
// trusted from the model's own guess.
export function determineRouting(researchBase: ResearchBase): "kyle" | "stephanie" {
  if (
    researchBase.engagement_type === "ongoing_gc" &&
    researchBase.funding_stage &&
    SERIES_A_PLUS.has(researchBase.funding_stage)
  ) {
    return "kyle";
  }
  return "stephanie";
}

export function getIntakeLead(sessionId: string) {
  return prisma.intakeLead.findUnique({ where: { sessionId } });
}

export function parseIntakeJson<T>(raw: string | null | undefined, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
