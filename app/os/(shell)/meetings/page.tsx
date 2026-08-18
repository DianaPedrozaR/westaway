import { prisma } from "@/lib/prisma";
import { STAGE_LABELS } from "@/lib/deals";
import Link from "next/link";
import { SparkleIcon } from "@/components/icons";
import { notFound } from "next/navigation";

const FOLLOW_UP_ACTIONS: Record<string, string[]> = {
  "BioVigilance AI": [
    "Draft a dual-path structure for W-2 employees vs. 1099 medical consultants.",
    "Send the structured proposal to BioVigilance's compliance team for review.",
    "Confirm worker-classification review timeline with Sophia.",
  ],
  "Obsidian Ledger": [
    "Finalize the MSA draft with the 12-month trailing-fee liability cap.",
    "Add a data-security super-cap fallback clause to the proposal.",
    "Send the email proposal for Kyle's sign-off.",
  ],
  "NovaGrid Energy": [
    "Send the onboarding link for the multi-state ICA intake.",
    "Confirm contractor states (CO, CA, NY) for compliance templates.",
    "Kick off the onboarding chatbot session.",
  ],
  "Apex Hyperware": [
    "Await Stripe payment confirmation.",
    "Prepare vault/Dropbox integration for legacy document indexing.",
    "Confirm GC retainer scope: employment, commercial, board governance.",
  ],
  "Mirror Mirage Cosmetics": [
    "Send the onboarding link for the trademark intake chatbot.",
    "Run a USPTO TESS clearance search.",
    "Collect brand logos and product classifications.",
  ],
  "Foundry Core Real Estate": [
    "Confirm tenant notice period data points.",
    "Run a municipal zoning compliance check.",
    "Move the lease draft to final compliance review.",
  ],
  "Helix Synthesis": [
    "Vault fully configured — no further onboarding action.",
    "Available on request: generate NDA variations for new advisors.",
  ],
  "Aeon Robotics": [
    "Send litigation referral firms.",
    "Mark the deal Unqualified — outside flat-fee scope.",
  ],
  "Ironclad Foundry": [
    "Archive the Series Seed engagement.",
    "Flag for GC retainer follow-up once funding closes.",
  ],
};

export default async function MeetingIntelligencePage({
  searchParams,
}: {
  searchParams: Promise<{ deal?: string }>;
}) {
  const deals = await prisma.deal.findMany({
    where: { transcriptExcerpt: { not: null } },
    orderBy: { createdAt: "asc" },
  });

  const { deal: dealId } = await searchParams;
  const selected =
    (dealId ? deals.find((d) => d.id === dealId) : null) ??
    deals.find((d) => d.company === "BioVigilance AI") ??
    deals[0];

  if (!selected) notFound();

  return (
    <div className="flex flex-col gap-6 h-full">
      <div>
        <h1 className="text-4xl">Meeting Intelligence</h1>
        <p className="text-wa-meta mt-1.5">
          AI-generated summaries and follow-up actions, stored in each customer&rsquo;s context vault.
        </p>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-5 flex-grow min-h-0">
        <div className="bg-white rounded-2xl border border-wa-hair shadow-sm overflow-y-auto">
          {deals.map((deal) => (
            <Link
              key={deal.id}
              href={`/os/meetings?deal=${deal.id}`}
              className={`block px-5 py-4 border-b border-wa-hair last:border-b-0 first:rounded-t-2xl last:rounded-b-2xl ${
                deal.id === selected.id ? "bg-wa-blue-light" : "hover:bg-wa-tint"
              }`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="text-[15px] text-wa-navy font-medium">{deal.company}</div>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-wa-tint text-wa-navy font-medium whitespace-nowrap">
                  {STAGE_LABELS[deal.stage]}
                </span>
              </div>
              <div className="text-sm text-wa-meta mt-1">
                {deal.contact} &middot; {deal.productMatch}
              </div>
            </Link>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-wa-hair shadow-sm p-8 overflow-y-auto">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl">
                {selected.company} &mdash; {selected.productMatch}
              </h2>
              <div className="text-wa-meta text-sm mt-1.5">
                {selected.contact}, Contact &middot; Lead: {selected.lead}
              </div>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-wa-tint text-wa-navy font-medium">
              {STAGE_LABELS[selected.stage]}
            </span>
          </div>

          <div className="mt-7">
            <div className="text-xs uppercase tracking-wide text-wa-blue font-semibold mb-2.5 flex items-center gap-2">
              <SparkleIcon size={14} />
              AI-Generated Summary
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-wa-blue-light to-white border border-wa-blue/10 px-6 py-5 text-[15px] leading-relaxed text-wa-navy">
              {selected.dealBriefSummary}
            </div>
          </div>

          <div className="mt-7">
            <div className="text-xs uppercase tracking-wide text-wa-meta font-medium mb-2.5">
              Follow-Up Actions
            </div>
            <div className="flex flex-col gap-2.5">
              {(FOLLOW_UP_ACTIONS[selected.company] ?? []).map((action) => (
                <div key={action} className="flex gap-3 items-start bg-wa-tint rounded-xl px-4 py-3">
                  <div className="w-4 h-4 rounded-md border-2 border-wa-blue flex-shrink-0 mt-0.5" />
                  <span className="text-[15px] text-wa-navy">{action}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-7">
            <div className="text-xs uppercase tracking-wide text-wa-meta font-medium mb-2.5">
              Attendee Intelligence
            </div>
            <div className="rounded-2xl border border-wa-hair px-6 py-5 flex items-center gap-4">
              <div className="w-11 h-11 rounded-full bg-wa-blue-light text-wa-blue font-semibold flex items-center justify-center flex-shrink-0">
                {selected.contact
                  .split(" ")
                  .map((w) => w[0])
                  .slice(0, 2)
                  .join("")}
              </div>
              <div>
                <div className="text-[15px] text-wa-navy font-medium">{selected.contact}</div>
                <div className="text-wa-meta text-sm">
                  {selected.founder ? "Founder, " : ""}
                  {selected.company}
                  {selected.founderYear ? ` · founded ${selected.founderYear}` : ""}
                  {selected.employees !== null ? ` · ${selected.employees} employees` : ""}
                  {selected.hq ? ` · ${selected.hq}` : ""}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
