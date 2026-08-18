import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { anthropic, CHAT_MODEL } from "@/lib/anthropic";
import { prisma } from "@/lib/prisma";
import {
  CHAT_SYSTEM_PROMPT,
  EMPLOYMENT_PARAMETER_SCHEMA,
  getActiveCase,
  parseMessages,
} from "@/lib/onboarding";

export async function POST(request: NextRequest) {
  const { message } = (await request.json()) as { message: string };

  const activeCase = await getActiveCase();
  if (!activeCase) {
    return new Response("No active onboarding case.", { status: 404 });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return new Response("ANTHROPIC_API_KEY is not configured on the server.", {
      status: 500,
    });
  }

  const history = parseMessages(activeCase.messages);
  const displayHistory = [...history, { role: "user" as const, content: message }];

  const apiMessages: Anthropic.MessageParam[] = history.map((turn) => ({
    role: turn.role,
    content: turn.content,
  }));
  apiMessages.push({ role: "user", content: message });

  const encoder = new TextEncoder();

  const readable = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        let closingText = "";

        const firstStream = anthropic.messages.stream({
          model: CHAT_MODEL,
          max_tokens: 1024,
          system: CHAT_SYSTEM_PROMPT,
          tools: [EMPLOYMENT_PARAMETER_SCHEMA],
          output_config: { effort: "medium" },
          messages: apiMessages,
        });

        firstStream.on("text", (delta) => {
          closingText += delta;
          controller.enqueue(encoder.encode(delta));
        });

        const finalMessage = await firstStream.finalMessage();

        const toolUse = finalMessage.content.find(
          (block) => block.type === "tool_use" && block.name === "save_employment_parameters",
        );

        if (toolUse && toolUse.type === "tool_use") {
          await prisma.onboardingCase.update({
            where: { id: activeCase.id },
            data: {
              collectedParameters: JSON.stringify(toolUse.input),
              currentStep: "PREFILL",
            },
          });

          const followUpMessages: Anthropic.MessageParam[] = [
            ...apiMessages,
            { role: "assistant", content: finalMessage.content },
            {
              role: "user",
              content: [
                {
                  type: "tool_result",
                  tool_use_id: toolUse.id,
                  content: "Saved. All fields recorded successfully.",
                },
              ],
            },
          ];

          closingText = "";
          const secondStream = anthropic.messages.stream({
            model: CHAT_MODEL,
            max_tokens: 512,
            system: CHAT_SYSTEM_PROMPT,
            tools: [EMPLOYMENT_PARAMETER_SCHEMA],
            output_config: { effort: "medium" },
            messages: followUpMessages,
          });

          secondStream.on("text", (delta) => {
            closingText += delta;
            controller.enqueue(encoder.encode(delta));
          });

          await secondStream.finalMessage();
        }

        displayHistory.push({ role: "assistant", content: closingText });

        await prisma.onboardingCase.update({
          where: { id: activeCase.id },
          data: { messages: JSON.stringify(displayHistory) },
        });

        controller.close();
      } catch (err) {
        controller.error(err);
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
