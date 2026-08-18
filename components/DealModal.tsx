"use client";

import { useEffect, useState } from "react";
import { Pill } from "./Pill";
import { FlagIcon, SparkleIcon } from "./icons";
import { STAGE_LABELS, STAGE_TONE } from "@/lib/deals";

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
  roundStage: string | null;
  employees: number | null;
  hq: string | null;
  founder: string | null;
  founderYear: number | null;
  dealBriefSummary: string | null;
  keyRisks: string | null;
  suggestedQuestions: string | null;
};

function Kv({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-3 border-b border-wa-hair last:border-b-0 text-sm">
      <span className="text-wa-meta">{label}</span>
      <span className="text-wa-navy font-medium">{value}</span>
    </div>
  );
}

export function DealModal({ dealId, onClose }: { dealId: string | null; onClose: () => void }) {
  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dealId) {
      setDeal(null);
      return;
    }
    setLoading(true);
    fetch(`/api/deals/${dealId}`)
      .then((r) => r.json())
      .then((data) => setDeal(data))
      .finally(() => setLoading(false));
  }, [dealId]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  if (!dealId) return null;

  return (
    <div
      className="fixed inset-0 bg-wa-navy/40 backdrop-blur-sm flex items-center justify-center z-50 p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[88vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {loading || !deal ? (
          <div className="p-16 text-center text-wa-meta">Loading deal…</div>
        ) : (
          <>
            <div className="px-8 py-7 bg-gradient-to-br from-wa-navy to-[#26398f] text-white flex justify-between items-start">
              <div>
                <div className="text-[#AFC0F5] text-xs uppercase tracking-wide font-medium">
                  {deal.roundStage ?? "Deal Pre-Brief"}
                </div>
                <h2 className="text-2xl mt-1 text-white">{deal.company}</h2>
                <div className="text-[#C9D3F5] text-sm mt-1">
                  {deal.contact} &middot; Lead: {deal.lead}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Pill tone={STAGE_TONE[deal.stage as keyof typeof STAGE_TONE]}>
                  {STAGE_LABELS[deal.stage as keyof typeof STAGE_LABELS]}
                </Pill>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white"
                >
                  ✕
                </button>
              </div>
            </div>

            <div className="overflow-y-auto px-8 py-7 flex flex-col gap-5">
              {deal.dealBriefSummary && (
                <div className="rounded-2xl bg-gradient-to-br from-wa-blue-light to-white border border-wa-blue/10 px-6 py-5 flex gap-4">
                  <div className="w-9 h-9 rounded-xl bg-wa-blue text-white flex items-center justify-center flex-shrink-0">
                    <SparkleIcon size={16} />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wide text-wa-blue font-semibold mb-1">
                      AI Summary
                    </div>
                    <p className="text-[15px] leading-relaxed text-wa-navy">
                      {deal.dealBriefSummary}
                    </p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-2xl border border-wa-hair p-5">
                  <div className="text-xs uppercase tracking-wide text-wa-meta font-medium mb-1">
                    Round Details
                  </div>
                  {deal.roundStage && <Kv label="Stage" value={deal.roundStage} />}
                  {deal.employees !== null && <Kv label="Employees" value={deal.employees} />}
                  {deal.hq && <Kv label="HQ" value={deal.hq} />}
                  {deal.founder && (
                    <Kv
                      label="Founder"
                      value={`${deal.founder}${deal.founderYear ? `, ${deal.founderYear}` : ""}`}
                    />
                  )}
                </div>
                <div className="rounded-2xl border border-wa-hair p-5">
                  <div className="text-xs uppercase tracking-wide text-wa-meta font-medium mb-1">
                    Deal Properties
                  </div>
                  <Kv label="Source" value={deal.source} />
                  <Kv
                    label="Type"
                    value={deal.engagementType === "GENERAL_COUNSEL" ? "General Counsel" : "Per-Project"}
                  />
                  <Kv label="Offer Drafted" value={deal.offerDrafted === "DONE" ? "Done" : "Pending"} />
                  <Kv
                    label="Offer Sent"
                    value={
                      deal.offerSent === "NA" ? "N/A" : deal.offerSent === "SENT" ? "Sent" : "On Review"
                    }
                  />
                </div>
              </div>

              {deal.productMatch && (
                <div className="rounded-2xl border border-wa-hair p-5">
                  <div className="text-xs uppercase tracking-wide text-wa-meta font-medium mb-3">
                    Possible Product Match
                  </div>
                  <div className="text-lg text-wa-navy font-medium">{deal.productMatch}</div>
                  {deal.productPrice && (
                    <div className="text-wa-meta text-sm mt-1">{deal.productPrice}</div>
                  )}
                </div>
              )}

              {deal.keyRisks && (
                <div className="rounded-2xl bg-wa-red-light border border-wa-red/15 p-5">
                  <div className="text-xs uppercase tracking-wide text-wa-red font-semibold mb-2 flex items-center gap-1.5">
                    <FlagIcon size={13} />
                    Key Risks
                  </div>
                  <p className="text-[15px] leading-relaxed text-wa-navy">{deal.keyRisks}</p>
                </div>
              )}

              {deal.suggestedQuestions && (
                <div className="rounded-2xl bg-wa-tint p-5">
                  <div className="text-xs uppercase tracking-wide text-wa-meta font-semibold mb-2 flex items-center gap-1.5">
                    <SparkleIcon size={13} />
                    AI-Suggested Questions
                  </div>
                  <p className="text-[15px] leading-relaxed text-wa-navy">
                    {deal.suggestedQuestions}
                  </p>
                </div>
              )}

              {deal.offerEmail && (
                <div className="rounded-2xl border border-wa-hair p-5">
                  <div className="text-xs uppercase tracking-wide text-wa-meta font-medium mb-2">
                    Drafted Offer Email
                  </div>
                  <p className="text-[15px] leading-relaxed whitespace-pre-line text-wa-body">
                    {deal.offerEmail}
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
