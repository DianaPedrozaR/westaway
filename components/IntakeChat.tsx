"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/Button";
import { MicIcon } from "@/components/icons";

type ChatTurn = { role: "user" | "assistant"; text: string };

const OPENING_LINE =
  "Hi! I'm here to get our team ready for your call. What's going on — type below, or hold the mic to talk it through.";

export function IntakeChat() {
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatTurn[]>([{ role: "assistant", text: OPENING_LINE }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  const [calendlyUrl, setCalendlyUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recording, setRecording] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const baseTextRef = useRef("");

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
        body: JSON.stringify({ sessionId, message: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "bad response");

      setSessionId(data.sessionId);
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
      if (data.done) {
        setDone(true);
        setCalendlyUrl(data.calendlyUrl ?? null);
      }
    } catch {
      setError("Sorry, something went wrong on our end — please try that again.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 max-h-[55vh] overflow-y-auto pr-1">
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

      {error && <div className="text-wa-red text-sm">{error}</div>}

      {done ? (
        calendlyUrl ? (
          <>
            <Script src="https://assets.calendly.com/assets/external/widget.js" strategy="afterInteractive" />
            <div
              className="calendly-inline-widget rounded-2xl overflow-hidden border border-wa-hair"
              data-url={calendlyUrl}
              style={{ minWidth: "280px", height: "560px" }}
            />
          </>
        ) : (
          <div className="rounded-2xl bg-wa-green-light border border-wa-green/20 px-5 py-4 text-wa-navy">
            Thanks — that&rsquo;s everything our team needs. We&rsquo;ll follow up shortly to get
            your call on the books.
          </div>
        )
      ) : (
        <div className="flex gap-3">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            rows={2}
            placeholder="Tell us what's going on..."
            disabled={sending}
            className="flex-grow resize-none rounded-xl border-[1.5px] border-wa-hair px-4 py-3 text-lg text-wa-navy outline-none focus:border-wa-blue"
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
