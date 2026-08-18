import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-12 bg-white px-6">
      <Image
        src="/westaway-logo.png"
        alt="Westaway"
        width={220}
        height={56}
        className="h-10 w-auto"
      />
      <div className="grid gap-6 sm:grid-cols-2 w-full max-w-2xl">
        <Link
          href="/os/dashboard"
          className="border border-wa-hair p-8 hover:border-wa-blue transition-colors"
        >
          <div className="text-wa-meta text-xs uppercase tracking-wide mb-2">
            Internal
          </div>
          <h2 className="text-xl mb-2">Westaway OS</h2>
          <p className="text-wa-meta text-base">
            Dashboard, deal pipeline, meeting intelligence, and email triage
            for the Westaway team.
          </p>
        </Link>
        <Link
          href="/onboard"
          className="border border-wa-hair p-8 hover:border-wa-blue transition-colors"
        >
          <div className="text-wa-meta text-xs uppercase tracking-wide mb-2">
            Client-facing
          </div>
          <h2 className="text-xl mb-2">Westaway Onboarding</h2>
          <p className="text-wa-meta text-base">
            The guided onboarding experience for a new engagement.
          </p>
        </Link>
      </div>
    </div>
  );
}
