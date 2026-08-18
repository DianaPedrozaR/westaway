"use client";

import { useEffect, useRef, useState } from "react";
import { MicIcon, SendIcon } from "@/components/icons";
import { FakeCalendly } from "@/components/FakeCalendly";
import type { ProspectInfo } from "@/components/IntakeContactForm";

type ChatTurn = { role: "user" | "assistant"; text: string };

const MAX_TEXTAREA_HEIGHT = 120;

export function IntakeChat({ prospect }: { prospect: ProspectInfo }) {
  const firstName = prospect.name.trim().split(/\s+/)[0] || "there";
  const openingLine = `Hi ${firstName}! I'm here to get our team ready for your call. What's going on — type below, or hold the mic to talk it through.`;

  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatTurn[]>([{ role: "assistant", text: openingLine }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [routing, setRouting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseTextRef = useRef("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [input]);

  useEffect(() => {
    const SpeechRecognitionCtor: SpeechRecognitionConstructor | undefined =
      (window as unknown as { SpeechRecognition?: SpeechRecognitionConstructor }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: SpeechRecognitionConstructor })
        .webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) return;

    const recognition = new SpeechRecognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";
    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      let transcript = "";
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(`${baseTextRef.current} ${transcript}`.trim());
    };
    recognition.onerror = () => setRecording(false);
    recognition.onend = () => setRecording(false);
    recognitionRef.current = recognition;
  }, []);

  function startRecording() {
    if (!recognitionRef.current || sending || done) return;
    baseTextRef.current = input;
    setRecording(true);
    try {
      recognitionRef.current.start();
    } catch {
      // start() throws if already started — safe to ignore
    }
  }

  function stopRecording() {
    if (!recognitionRef.current) return;
    recognitionRef.current.stop();
    setRecording(false);
  }

  async function send() {
    const text = input.trim();
    if (!text || sending || done) return;
    setInput("");
    setError(null);
    setMessages((prev) => [...prev, { role: "user", text }]);
    setSending(true);

    try {
      const res = await fetch("/api/intake/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId,
          message: text,
          // Only meaningful on the very first call, when the server creates
          // the IntakeLead row — ignored afterward.
          prospect: sessionId ? undefined : prospect,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "bad response");

      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
      if (data.done) {
        setDone(true);
        setRouting(data.routing ?? null);
      }
    } catch {
      setError("Sorry, something went wrong on our end — please try that again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto flex flex-col gap-4 pr-1">
        {messages.map((m, i) =>
          m.role === "assistant" ? (
            <div key={i} className="flex gap-3 items-start">
              <Avatar />
              <div className="bg-wa-tint rounded-2xl rounded-tl-sm px-4 py-3.5 text-[17px] leading-relaxed max-w-lg whitespace-pre-line">
                {m.text}
              </div>
            </div>
          ) : (
            <div key={i} className="flex justify-end">
              <div className="bg-wa-blue text-white rounded-2xl rounded-tr-sm px-4 py-3.5 text-[17px] leading-relaxed max-w-lg whitespace-pre-line">
                {m.text}
              </div>
            </div>
          ),
        )}
        {sending && (
          <div className="flex gap-3 items-start">
            <Avatar />
            <div className="bg-wa-tint rounded-2xl rounded-tl-sm px-4 py-3.5 text-[17px] text-wa-meta">
              &hellip;
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {error && <div className="text-wa-red text-sm mt-4">{error}</div>}

      <div className="pt-4 flex-shrink-0">
        {done ? (
          <FakeCalendly rep={routing} email={prospect.email} />
        ) : (
          <div className="flex gap-3 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              rows={1}
              placeholder="Tell us what's going on..."
              disabled={sending}
              className="flex-grow resize-none overflow-y-auto rounded-xl border-[1.5px] border-wa-hair px-4 py-3 text-lg text-wa-navy outline-none focus:border-wa-blue"
              style={{ minHeight: "48px", maxHeight: `${MAX_TEXTAREA_HEIGHT}px` }}
            />
            <button
              type="button"
              title="Hold to speak"
              disabled={sending || !recognitionRef.current}
              onMouseDown={startRecording}
              onMouseUp={stopRecording}
              onMouseLeave={stopRecording}
              onTouchStart={startRecording}
              onTouchEnd={stopRecording}
              className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border-[1.5px] transition-colors disabled:opacity-40 ${
                recording
                  ? "bg-wa-red text-white border-wa-red"
                  : "bg-white text-wa-navy border-wa-hair hover:border-wa-navy"
              }`}
            >
              <MicIcon size={18} />
            </button>
            <button
              type="button"
              title="Send"
              onClick={send}
              disabled={sending || !input.trim()}
              className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-wa-blue text-white hover:bg-wa-navy transition-colors disabled:opacity-40"
            >
              <SendIcon size={18} />
            </button>
          </div>
        )}
      </div>
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

type SpeechRecognitionResultLike = { transcript: string };
type SpeechRecognitionResultListLike = {
  length: number;
  [index: number]: SpeechRecognitionResultLike[];
};
type SpeechRecognitionEventLike = { results: SpeechRecognitionResultListLike };
type SpeechRecognitionLike = {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
};
type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;
