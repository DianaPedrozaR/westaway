"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { STAGE_ACCENT, STAGE_LABELS, STAGE_ORDER } from "@/lib/deals";
import { Pill } from "@/components/Pill";
import { SparkleIcon } from "@/components/icons";
import { DealModal } from "@/components/DealModal";

type Deal = {
  id: string;
  company: string;
  contact: string;
  stage: string;
  lead: string;
  source: string;
  engagementType: string;
  offerDrafted: string;
  offerSent: string;
  offerEmail: string | null;
  productMatch: string | null;
  productPrice: string | null;
};

const LEAD_COLORS: Record<string, string> = {
  Kyle: "bg-wa-navy",
  Stephanie: "bg-wa-blue",
};

export function KanbanBoard({ deals }: { deals: Deal[] }) {
  const [openDealId, setOpenDealId] = useState<string | null>(null);

  const grouped = STAGE_ORDER.map((stage) => ({
    stage,
    deals: deals.filter((d) => d.stage === stage),
  }));

  return (
    <>
      <div className="flex gap-4 items-start overflow-x-auto pb-6 -mx-1 px-1">
        {grouped.map(({ stage, deals: stageDeals }) => (
          <div key={stage} className="w-64 min-w-64 flex flex-col gap-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${STAGE_ACCENT[stage as keyof typeof STAGE_ACCENT]}`} />
                <span className="text-[13px] font-semibold text-wa-navy uppercase tracking-wide">
                  {STAGE_LABELS[stage as keyof typeof STAGE_LABELS]}
                </span>
              </div>
              <span className="bg-white border border-wa-hair text-wa-meta text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                {stageDeals.length}
              </span>
            </div>
            {stageDeals.length === 0 ? (
              <div className="border-2 border-dashed border-wa-hair rounded-2xl px-3 py-6 text-center text-wa-dis text-sm bg-white/40">
                No new leads yet.
              </div>
            ) : (
              stageDeals.map((deal) => (
                <DealCard key={deal.id} deal={deal} onOpen={() => setOpenDealId(deal.id)} />
              ))
            )}
          </div>
        ))}
      </div>

      <DealModal dealId={openDealId} onClose={() => setOpenDealId(null)} />
    </>
  );
}

function DealCard({ deal, onOpen }: { deal: Deal; onOpen: () => void }) {
  const router = useRouter();
  const [drafting, setDrafting] = useState(false);
  const [localEmail, setLocalEmail] = useState<string | null>(deal.offerEmail);
  const [error, setError] = useState<string | null>(null);
  const closed = deal.stage === "UNQUALIFIED" || deal.stage === "LOST";
  const drafted = deal.offerDrafted === "DONE" || localEmail !== null;

  async function requestDraft(e: React.MouseEvent) {
    e.stopPropagation();
    setDrafting(true);
    setError(null);
    try {
      const res = await fetch(`/api/deals/${deal.id}/draft-offer`, { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error ?? "Draft request failed");
      }
      const body = await res.json();
      setLocalEmail(body.offerEmail);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setDrafting(false);
    }
  }

  const initial = deal.lead[0] ?? "?";

  return (
    <div
      onClick={onOpen}
      className={`group bg-white border border-wa-hair rounded-2xl p-4 flex flex-col gap-3 cursor-pointer shadow-sm hover:shadow-lg hover:border-wa-blue/30 hover:-translate-y-0.5 ${
        closed ? "opacity-70" : ""
      }`}
    >
      <div className="flex justify-between items-start gap-2">
        <span className="text-[16px] text-wa-navy font-medium group-hover:text-wa-blue">
          {deal.company}
        </span>
        <div
          className={`w-7 h-7 rounded-full ${LEAD_COLORS[deal.lead] ?? "bg-wa-meta"} text-white text-[11px] font-semibold flex items-center justify-center flex-shrink-0`}
          title={deal.lead}
        >
          {initial}
        </div>
      </div>
      <div className="text-[13px] text-wa-meta">
        {deal.contact} &middot; {deal.source}
      </div>
      <Pill tone={deal.engagementType === "GENERAL_COUNSEL" ? "outline" : "muted"} className="w-fit">
        {deal.engagementType === "GENERAL_COUNSEL" ? "General Counsel" : "Per-Project"}
      </Pill>
      <div className="flex gap-1.5 flex-wrap">
        <Pill tone={closed ? "closed" : drafted ? "success" : "outline"}>
          Drafted: {drafted ? "Done" : "Pending"}
        </Pill>
        <Pill tone={closed ? "closed" : deal.offerSent === "SENT" ? "success" : deal.offerSent === "ON_REVIEW" ? "outline" : "muted"}>
          Sent: {deal.offerSent === "NA" ? "N/A" : deal.offerSent === "SENT" ? "Sent" : "On Review"}
        </Pill>
      </div>

      {deal.stage === "FOLLOW_UP" && !drafted && (
        <button
          onClick={requestDraft}
          disabled={drafting}
          className="rounded-xl bg-wa-blue text-white text-xs font-semibold py-2.5 flex items-center justify-center gap-1.5 disabled:opacity-60 hover:bg-wa-navy shadow-sm"
        >
          <SparkleIcon size={13} />
          {drafting ? "Drafting offer email…" : "Request AI Draft"}
        </button>
      )}

      {error && <div className="text-xs text-wa-red">{error}</div>}

      {deal.stage === "FOLLOW_UP" && drafted && localEmail && (
        <div className="rounded-xl bg-wa-blue-light px-3 py-2.5 text-xs leading-relaxed border border-wa-blue/10 whitespace-pre-line max-h-40 overflow-y-auto">
          {localEmail}
        </div>
      )}
    </div>
  );
}
