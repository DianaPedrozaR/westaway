export const dynamic = "force-dynamic";

import { getActiveCase } from "@/lib/onboarding";
import { DocIcon } from "@/components/icons";
import { LinkButton } from "@/components/Button";

export default async function OnboardHomePage() {
  const activeCase = await getActiveCase();

  return (
    <div className="flex flex-col items-center gap-10 text-center py-16">
      <div className="flex flex-col items-center gap-4 max-w-xl">
        <div className="text-xs uppercase tracking-wide text-wa-blue font-semibold">
          Get started
        </div>
        <h1 className="text-4xl">
          Welcome, {activeCase?.companyName ?? "Nimbus Robotics"}.
        </h1>
        <p className="text-lg text-wa-meta">
          Follow these steps to get started. If you have questions, contact us.
        </p>
        <LinkButton href="/onboard/upload" size="lg" className="mt-2">
          Start Onboarding
        </LinkButton>
      </div>

      <div className="bg-white rounded-2xl border border-wa-hair shadow-sm px-8 py-6 flex items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-wa-blue-light flex items-center justify-center flex-shrink-0">
          <DocIcon className="text-wa-blue" size={22} />
        </div>
        <div className="text-left">
          <div className="text-lg text-wa-navy font-medium">
            {activeCase?.matterType ?? "Employment Agreement"}
          </div>
          <div className="text-wa-meta text-sm">
            Flat fee &middot; $1,200 &middot; {activeCase?.employeeName ?? "New hire"}
          </div>
        </div>
      </div>
    </div>
  );
}
