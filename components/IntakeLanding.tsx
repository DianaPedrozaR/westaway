"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { IntakeChat } from "@/components/IntakeChat";

const NAV_LINKS = ["General Counsel", "Flat Fees", "Resources"];
const BADGES = ["Quality Work", "Fixed Fees", "Founder-Friendly"];

export function IntakeLanding() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-wa-hair">
        <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
          <Logo className="text-lg" />
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-wa-navy">
            {NAV_LINKS.map((label) => (
              <span key={label} className="hover:text-wa-blue cursor-default">
                {label}
              </span>
            ))}
          </div>
          <button
            onClick={() => setOpen(true)}
            className="bg-wa-blue text-white text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-wa-navy transition-colors"
          >
            Book Free Consult
          </button>
        </nav>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-24 md:py-32">
        <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl text-wa-navy">
          The startup law firm for founders that{" "}
          <span className="relative inline-block">
            change the world.
            <span className="absolute left-0 -bottom-1 w-full h-1.5 bg-wa-blue rounded-full" />
          </span>
        </h1>
        <p className="mt-8 text-wa-blue font-bold uppercase tracking-widest text-xs">
          $100M+ raised &middot; $1B+ closed
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <button
            onClick={() => setOpen(true)}
            className="bg-wa-blue text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-wa-navy transition-colors"
          >
            Book Free Consult
          </button>
          <button className="border-[1.5px] border-wa-navy text-wa-navy font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl">
            Free Guide
          </button>
        </div>
        <div className="mt-16 flex flex-wrap gap-3">
          {BADGES.map((label) => (
            <span
              key={label}
              className="rounded-full bg-wa-tint border border-wa-hair px-4 py-2 text-xs font-semibold uppercase tracking-wide text-wa-navy"
            >
              {label}
            </span>
          ))}
        </div>
      </main>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div className="bg-white w-full max-w-md h-[80vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between px-6 py-5 border-b border-wa-hair">
              <div>
                <p className="font-bold text-wa-navy">Let&rsquo;s get your call ready</p>
                <p className="text-xs text-wa-meta mt-1">
                  A quick chat before you book &mdash; a few questions, then you&rsquo;re set.
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-2xl leading-none px-2 text-wa-dis hover:text-wa-navy"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-6 py-5">
              <IntakeChat />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
