import Link from "next/link";
import { Pill } from "@/components/Pill";
import { Logo } from "@/components/Logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-wa-tint px-6 py-16">
      <div className="flex items-baseline gap-2">
        <Logo className="text-4xl" />
        <span className="text-4xl font-bold text-wa-blue">OS</span>
      </div>
      <p className="text-wa-meta text-center max-w-md">
        One operating system for the full client lifecycle — from first
        conversation to signed engagement.
      </p>

      <div className="text-xs uppercase tracking-widest text-wa-meta font-semibold mt-10">
        Continue as
      </div>
      <div className="grid gap-6 sm:grid-cols-3 w-full max-w-4xl">
        <Link
          href="/intake"
          className="group rounded-2xl bg-white border border-wa-hair p-8 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-wa-blue/40 transition-all"
        >
          <Pill tone="success" className="mb-4">
            Preview
          </Pill>
          <h2 className="text-xl text-wa-navy mb-2 group-hover:text-wa-blue transition-colors">
            Prospect
          </h2>
          <p className="text-wa-meta text-base">
            Where a first conversation starts — before they&rsquo;re even a
            client.
          </p>
        </Link>
        <Link
          href="/os/dashboard"
          className="group rounded-2xl bg-white border border-wa-hair p-8 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-wa-blue/40 transition-all"
        >
          <Pill tone="outline" className="mb-4">
            Internal
          </Pill>
          <h2 className="text-xl text-wa-navy mb-2 group-hover:text-wa-blue transition-colors">
            Team
          </h2>
          <p className="text-wa-meta text-base">
            Where your team runs deal flow, meetings, and cases.
          </p>
        </Link>
        <Link
          href="/onboard"
          className="group rounded-2xl bg-white border border-wa-hair p-8 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-wa-blue/40 transition-all"
        >
          <Pill tone="muted" className="mb-4">
            Client-facing
          </Pill>
          <h2 className="text-xl text-wa-navy mb-2 group-hover:text-wa-blue transition-colors">
            Client
          </h2>
          <p className="text-wa-meta text-base">
            Where a client experiences their engagement, from onboarding
            onward.
          </p>
        </Link>
      </div>
    </div>
  );
}
