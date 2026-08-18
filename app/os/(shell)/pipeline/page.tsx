export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { KanbanBoard } from "@/components/KanbanBoard";
import { CLOSED_STAGES, POSITIVE_STAGES } from "@/lib/deals";
import { SparkleIcon } from "@/components/icons";

export default async function PipelinePage() {
  const deals = await prisma.deal.findMany({ orderBy: { createdAt: "asc" } });

  const active = deals.filter((d) => !CLOSED_STAGES.includes(d.stage)).length;
  const won = deals.filter((d) => POSITIVE_STAGES.includes(d.stage)).length;
  const generalCounsel = deals.filter((d) => d.engagementType === "GENERAL_COUNSEL").length;
  const needsDraft = deals.find((d) => d.stage === "FOLLOW_UP" && d.offerDrafted === "PENDING");

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-4xl">Deals Pipeline</h1>
          <p className="text-wa-meta mt-1.5">Every active and closed engagement, in one view.</p>
        </div>
        <div className="flex gap-6">
          <Stat label="Total" value={deals.length} />
          <Stat label="Active" value={active} />
          <Stat label="Won" value={won} tone="text-wa-green" />
          <Stat label="General Counsel" value={generalCounsel} tone="text-wa-blue" />
        </div>
      </div>

      <div className="rounded-2xl bg-gradient-to-r from-wa-navy to-[#243a99] px-6 py-5 flex items-center gap-4 text-white shadow-sm">
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center flex-shrink-0">
          <SparkleIcon size={18} />
        </div>
        <p className="text-[15px] leading-relaxed">
          {needsDraft ? (
            <>
              <span className="font-semibold">{needsDraft.company}</span> is in Follow Up and
              ready for an AI-drafted offer &mdash; click{" "}
              <span className="font-semibold">Request AI Draft</span> on its card to generate one
              grounded in the deal&rsquo;s own context.
            </>
          ) : (
            <>All Follow Up deals already have a drafted offer. Click any card for the full brief.</>
          )}
        </p>
      </div>

      <KanbanBoard deals={deals} />
    </div>
  );
}

function Stat({ label, value, tone }: { label: string; value: number; tone?: string }) {
  return (
    <div className="text-right">
      <div className={`text-2xl font-semibold ${tone ?? "text-wa-navy"}`}>{value}</div>
      <div className="text-xs text-wa-meta uppercase tracking-wide">{label}</div>
    </div>
  );
}
