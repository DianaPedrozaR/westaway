import Image from "next/image";
import Link from "next/link";
import { Pill } from "@/components/Pill";

const INTAKE_AGENT_URL = "https://intake-agent-production-fb75.up.railway.app";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-14 bg-wa-tint px-6 py-16">
      <Image
        src="/westaway-logo.png"
        alt="Westaway"
        width={260}
        height={64}
        className="h-12 w-auto"
      />
      <div className="grid gap-6 sm:grid-cols-3 w-full max-w-4xl">
        <Link
          href="/os/dashboard"
          className="group rounded-2xl bg-white border border-wa-hair p-8 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-wa-blue/40 transition-all"
        >
          <Pill tone="outline" className="mb-4">
            Internal
          </Pill>
          <h2 className="text-xl text-wa-navy mb-2 group-hover:text-wa-blue transition-colors">
            Westaway OS
          </h2>
          <p className="text-wa-meta text-base">
            Dashboard, deal pipeline, meeting intelligence, and email triage
            for the Westaway team.
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
            Westaway Onboarding
          </h2>
          <p className="text-wa-meta text-base">
            The guided onboarding experience for a new engagement.
          </p>
        </Link>
        <a
          href={INTAKE_AGENT_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group rounded-2xl bg-white border border-wa-hair p-8 shadow-sm hover:shadow-lg hover:-translate-y-0.5 hover:border-wa-blue/40 transition-all"
        >
          <Pill tone="success" className="mb-4">
            Public
          </Pill>
          <h2 className="text-xl text-wa-navy mb-2 group-hover:text-wa-blue transition-colors">
            Intake Concierge &nearr;
          </h2>
          <p className="text-wa-meta text-base">
            The conversational intake widget prospects use in place of the
            static Calendly form.
          </p>
        </a>
      </div>
    </div>
  );
}
