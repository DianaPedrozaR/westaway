import Image from "next/image";
import { LockIcon } from "@/components/icons";
import { LinkButton } from "@/components/Button";

export default function OsLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-wa-navy to-[#0d1640] flex items-center justify-center relative p-8">
      <div className="absolute top-0 left-0 right-0 px-14 py-10">
        <Image
          src="/westaway-logo.png"
          alt="Westaway"
          width={220}
          height={54}
          className="h-10 w-auto invert brightness-0"
        />
      </div>

      <div className="flex w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="w-2/5 bg-gradient-to-br from-wa-navy to-[#243a99] p-16 flex flex-col justify-between">
          <div>
            <div className="text-[#8FA1E0] text-xs uppercase tracking-wide font-medium">
              Westaway OS
            </div>
            <h1 className="text-white text-4xl mt-4">
              Run the firm at the press of a button.
            </h1>
          </div>
          <p className="text-[#B9C4EC] text-lg border-t border-white/15 pt-6">
            18 years of flat-fee counsel for early-stage startups &mdash; now
            built to run on AI.
          </p>
        </div>

        <div className="w-3/5 p-16 flex flex-col justify-center gap-8">
          <div>
            <h2 className="text-3xl">Sign in</h2>
            <p className="text-wa-meta mt-2">
              Internal access for the Westaway team.
            </p>
          </div>

          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-wide text-wa-meta font-medium">
                Email
              </label>
              <div className="rounded-xl border-[1.5px] border-wa-hair px-4 py-3 text-lg text-wa-navy">
                kyle@westaway.law
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

          <LinkButton href="/os/dashboard" size="lg" className="w-full">
            <LockIcon size={18} />
            Sign in
          </LinkButton>

          <div className="flex justify-between text-sm">
            <span className="text-wa-meta">Kyle &middot; Stephanie &middot; Sonia</span>
            <span className="text-wa-blue">Forgot password?</span>
          </div>
        </div>
      </div>
    </div>
  );
}
