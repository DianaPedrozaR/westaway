import Image from "next/image";
import { LinkButton } from "@/components/Button";

export default function OnboardLoginPage() {
  return (
    <div className="min-h-screen bg-wa-tint flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-wa-hair p-16 flex flex-col items-center gap-8 text-center">
        <Image
          src="/westaway-logo.png"
          alt="Westaway"
          width={240}
          height={90}
          className="h-11 w-auto"
        />
        <div>
          <h1 className="text-3xl">Welcome back.</h1>
          <p className="text-wa-meta mt-2.5">
            Sign in to continue your Employment Agreement onboarding.
          </p>
        </div>

        <div className="flex flex-col gap-5 w-full text-left">
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-wa-meta font-medium">
              Email
            </label>
            <div className="rounded-xl border-[1.5px] border-wa-hair px-4 py-3 text-lg text-wa-navy">
              jordan.rivera@nimbusrobotics.com
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs uppercase tracking-wide text-wa-meta font-medium">
              Password
            </label>
            <div className="rounded-xl border-[1.5px] border-wa-hair px-4 py-3 text-lg text-wa-dis">
              &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
            </div>
          </div>
        </div>

        <LinkButton href="/onboard" size="lg" className="w-full">
          Sign in
        </LinkButton>

        <p className="text-sm text-wa-meta">
          Questions about your onboarding? <span className="text-wa-blue">Contact Westaway</span>
        </p>
      </div>
    </div>
  );
}
