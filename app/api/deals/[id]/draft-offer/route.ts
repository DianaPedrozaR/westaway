import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { anthropic, CHAT_MODEL } from "@/lib/anthropic";

const SYSTEM_PROMPT = `You are drafting a client offer email on behalf of Westaway, a boutique flat-fee law firm for early-stage startups.

Brand voice: direct, founder-to-founder, outcomes-led. Professional but not stuffy. No legalese padding, no "I hope this email finds you well."

Hard rules:
- Use ONLY the deal context provided below. Do not invent facts about the client, their company, or their situation beyond what's given.
- If a flat-fee price is given, state it exactly as given. If no price is given for the matched product, do NOT invent a number — say pricing will be confirmed on the call/in a follow-up, or omit a dollar figure entirely.
- Reference the specific matter/product match and, where available, something concrete from the call transcript to show this is personalized, not generic.
- End with a clear, single next step (e.g. reviewing the attached flat-fee engagement, replying to confirm, or scheduling a follow-up).
- Output ONLY the email body text — no subject line, no commentary, no markdown formatting.`;

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deal = await prisma.deal.findUnique({ where: { id } });

  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY is not configured on the server." },
      { status: 500 },
    );
  }

  const contextLines = [
    `Company: ${deal.company}`,
    `Contact: ${deal.contact}`,
    `Lead representative: ${deal.lead}`,
    `Matter / product match: ${deal.productMatch ?? "unspecified"}`,
    `Flat-fee price: ${deal.productPrice ?? "not in our menu for this matter — do not invent one"}`,
  ];
  if (deal.dealBriefSummary) contextLines.push(`Situation summary: ${deal.dealBriefSummary}`);
  if (deal.keyRisks) contextLines.push(`Key risks/considerations noted internally: ${deal.keyRisks}`);
  if (deal.transcriptExcerpt) {
    contextLines.push(`Call transcript excerpt:\n${deal.transcriptExcerpt}`);
  }

  const message = await anthropic.messages.create({
    model: CHAT_MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    output_config: { effort: "medium" },
    messages: [
      {
        role: "user",
        content: `Draft the offer email for this deal:\n\n${contextLines.join("\n")}`,
      },
    ],
  });

  const textBlock = message.content.find((b) => b.type === "text");
  const offerEmail = textBlock && textBlock.type === "text" ? textBlock.text : "";

  await prisma.deal.update({
    where: { id },
    data: {
      offerEmail,
      offerDrafted: "DONE",
      offerSent: "ON_REVIEW",
    },
  });

  return NextResponse.json({ offerEmail });
}
