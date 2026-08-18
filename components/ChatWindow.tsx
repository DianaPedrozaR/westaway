"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { ChatTurn } from "@/lib/onboarding";
import { Button, LinkButton } from "@/components/Button";

export function ChatWindow({
  initialMessages,
  parametersCollected,
}: {
  initialMessages: ChatTurn[];
  parametersCollected: boolean;
}) {
  const router = useRouter();
  const [messages, setMessages] = useState<ChatTurn[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setSending(true);

    try {
      const res = await fetch("/api/onboarding/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      if (!res.ok || !res.body) {
        throw new Error(await res.text());
      }

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: next[next.length - 1].content + chunk,
          };
          return next;
        });
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }

      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Try again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {messages.length === 0 && (
          <div className="flex gap-3 items-start">
            <Avatar />
            <div className="bg-wa-tint rounded-2xl rounded-tl-sm px-4 py-3.5 text-[17px] leading-relaxed max-w-lg">
              Let&rsquo;s fill in the details for the Employment Agreement. What&rsquo;s the
              employee&rsquo;s full legal name, job title, and reporting manager?
            </div>
          </div>
        )}
        {messages.map((m, i) =>
          m.role === "assistant" ? (
            <div key={i} className="flex gap-3 items-start">
              <Avatar />
              <div className="bg-wa-tint rounded-2xl rounded-tl-sm px-4 py-3.5 text-[17px] leading-relaxed max-w-lg whitespace-pre-line">
                {m.content || (sending && i === messages.length - 1 ? "…" : "")}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="bg-wa-blue text-white rounded-2xl rounded-tr-sm px-4 py-3.5 text-[17px] leading-relaxed max-w-lg whitespace-pre-line">
                {m.content}
              </div>
            </div>
          ),
        )}
        <div ref={bottomRef} />
      </div>

      {error && <div className="text-wa-red text-sm">{error}</div>}

      {parametersCollected ? (
        <LinkButton href="/onboard/prefill" size="lg" className="w-full">
          Continue to Pre-filling &rarr;
        </LinkButton>
      ) : (
        <div className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder="Type your answer…"
            disabled={sending}
            className="flex-grow rounded-xl border-[1.5px] border-wa-hair px-4 py-3 text-lg text-wa-navy outline-none focus:border-wa-blue"
          />
          <Button onClick={send} disabled={sending || !input.trim()} size="lg">
            Send
          </Button>
        </div>
      )}
    </div>
  );
}

function Avatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-wa-navy flex items-center justify-center flex-shrink-0">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={1.8}>
        <path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z" />
      </svg>
    </div>
  );
}
