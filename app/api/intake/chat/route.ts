import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { anthropic, CHAT_MODEL } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";
import {
  INTAKE_SYSTEM_PROMPT,
  INTAKE_RESPONSE_SCHEMA,
  MAX_TURNS,
  ResearchBase,
  IntakeTranscriptTurn,
  mergeResearchBase,
  isDetailedEnough,
  determineRouting,
  parseIntakeJson,
} from "@/lib/intake";

const CALENDLY_URLS: Record<string, string | undefined> = {
  kyle: process.env.CALENDLY_KYLE_URL,
  stephanie: process.env.CALENDLY_STEPHANIE_URL,
};

export async function POST(request: NextRequest) {
  const { sessionId, message } = (await request.json()) as {
    sessionId?: string;
    message: string;
  };

  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const existing = sessionId
    ? await prisma.intakeLead.findUnique({ where: { sessionId } })
    : null;

  const lead =
    existing ??
    (await prisma.intakeLead.create({
      data: { sessionId: crypto.randomUUID() },
    }));

  const priorMessages = parseIntakeJson<Anthropic.MessageParam[]>(lead.messages, []);
  const transcript = parseIntakeJson<IntakeTranscriptTurn[]>(lead.transcript, []);
  let researchBase = parseIntakeJson<ResearchBase>(lead.researchBase, {});
  let stage = lead.stage;
  let turnCount = lead.turnCount + 1;

  const contentBlocks: Anthropic.TextBlockParam[] = [];
  if (lead.pendingNudge) {
    contentBlocks.push({ type: "text", text: `<context>${lead.pendingNudge}</context>` });
  }
  contentBlocks.push({ type: "text", text: message });

  const apiMessages: Anthropic.MessageParam[] = [
    ...priorMessages,
    { role: "user", content: contentBlocks },
  ];

  let rawText: string;
  try {
    const response = await anthropic.messages.create({
      model: CHAT_MODEL,
      max_tokens: 3000,
      system: [
        { type: "text", text: INTAKE_SYSTEM_PROMPT, cache_control: { type: "ephemeral" } },
      ],
      output_config: {
        effort: "low",
        format: { type: "json_schema", schema: INTAKE_RESPONSE_SCHEMA },
      },
      messages: apiMessages,
    });
    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") throw new Error("no text block in response");
    rawText = textBlock.text;
  } catch {
    // Roll back: don't persist this turn, so a retry starts from clean history.
    return Response.json({ error: "assistant is temporarily unavailable" }, { status: 502 });
  }

  const data = JSON.parse(rawText) as {
    reply: string;
    research_base: ResearchBase;
    asked_closing_question: boolean;
    ready_for_handoff: boolean;
  };

  // Store the raw JSON turn back into history — Claude then sees its own
  // prior extraction verbatim on the next call, reinforcing consistency.
  apiMessages.push({ role: "assistant", content: rawText });

  transcript.push({ role: "user", text: message });
  transcript.push({ role: "assistant", text: data.reply });

  researchBase = mergeResearchBase(researchBase, data.research_base ?? {});

  if (data.asked_closing_question) {
    stage = "closing_asked";
  }

  let ready = Boolean(data.ready_for_handoff);
  if (turnCount >= MAX_TURNS) ready = true;

  let pendingNudge: string | null = null;
  if (!ready && stage !== "closing_asked" && isDetailedEnough(researchBase)) {
    pendingNudge =
      "The founder has already given you enough to work with. In your next reply, ask the " +
      'closing question: "Is there anything else our team should know to prepare for our ' +
      'meeting?" Do not ask another exploratory question.';
  }

  const done = ready;
  const routing = done ? determineRouting(researchBase) : null;
  const calendlyUrl = done ? CALENDLY_URLS[routing ?? ""] || null : null;

  await prisma.intakeLead.update({
    where: { id: lead.id },
    data: {
      messages: JSON.stringify(apiMessages),
      transcript: JSON.stringify(transcript),
      researchBase: JSON.stringify(researchBase),
      turnCount,
      stage,
      pendingNudge,
      done,
      routing,
    },
  });

  return Response.json({
    sessionId: lead.sessionId,
    reply: data.reply,
    turn: turnCount,
    done,
    routing,
    calendlyUrl,
  });
}
