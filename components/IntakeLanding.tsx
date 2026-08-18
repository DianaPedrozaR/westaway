"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/Logo";
import { AppSwitcher } from "@/components/AppSwitcher";
import { IntakeChat } from "@/components/IntakeChat";
import { IntakeContactForm, type ProspectInfo } from "@/components/IntakeContactForm";

const NAV_LINKS = ["General Counsel", "Flat Fees", "Resources"];
const BADGES = ["Quality Work", "Fixed Fees", "Founder-Friendly"];

// Swap in the real hero photo once available — this file just needs to exist
// at public/intake-hero-bg.jpg. Until then the dark gradient alone renders,
// which reads as a plain navy hero rather than a broken image.
const HERO_BG_URL = "/intake-hero-bg.jpg";

export function IntakeLanding() {
  const [open, setOpen] = useState(false);
  const [prospect, setProspect] = useState<ProspectInfo | null>(null);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  function closeModal() {
    setOpen(false);
    setProspect(null);
  }

  return (
    <div className="min-h-screen bg-white">
      <AppSwitcher current="prospect" />

      <div
        className="relative bg-wa-navy bg-cover bg-center"
        style={{ backgroundImage: `url(${HERO_BG_URL})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/65 to-black/85" />

        <header className="relative z-10 border-b border-white/10">
          <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
            <Logo light className="text-lg" />
            <div className="hidden md:flex items-center gap-8 text-xs font-semibold tracking-widest uppercase text-white/80">
              {NAV_LINKS.map((label) => (
                <span key={label} className="hover:text-white cursor-default">
                  {label}
                </span>
              ))}
            </div>
            <button
              onClick={() => setOpen(true)}
              className="bg-wa-blue text-white text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-xl hover:bg-white hover:text-wa-navy transition-colors"
            >
              Book Free Consult
            </button>
          </nav>
        </header>

        <main className="relative z-10 max-w-6xl mx-auto px-6 py-24 md:py-32">
          <h1 className="text-4xl md:text-6xl font-bold leading-tight max-w-3xl text-white">
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
              className="bg-wa-blue text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:bg-white hover:text-wa-navy transition-colors"
            >
              Book Free Consult
            </button>
            <button className="border-[1.5px] border-white/70 text-white font-bold uppercase tracking-widest text-sm px-8 py-4 rounded-xl hover:border-white">
              Free Guide
            </button>
          </div>
        </main>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-16 flex flex-wrap gap-3">
        {BADGES.map((label) => (
          <span
            key={label}
            className="rounded-full bg-wa-tint border border-wa-hair px-4 py-2 text-xs font-semibold uppercase tracking-wide text-wa-navy"
          >
            {label}
          </span>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeModal();
          }}
        >
          <div className="bg-white w-full max-w-md h-[80vh] rounded-3xl flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-start justify-between px-6 py-5 border-b border-wa-hair flex-shrink-0">
              <div>
                <p className="font-bold text-wa-navy">Let&rsquo;s get your call ready</p>
                <p className="text-xs text-wa-meta mt-1">
                  A quick chat before you book &mdash; a few questions, then you&rsquo;re set.
                </p>
              </div>
              <button
                onClick={closeModal}
                aria-label="Close"
                className="text-2xl leading-none px-2 text-wa-dis hover:text-wa-navy"
              >
                &times;
              </button>
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
              {prospect ? (
                <IntakeChat prospect={prospect} />
              ) : (
                <IntakeContactForm onSubmit={setProspect} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
