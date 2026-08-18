"use client";

import { useState } from "react";
import { STAGE_LABELS } from "@/lib/deals";
import { Pill } from "@/components/Pill";
import { CalendarIcon, ChevronRightIcon } from "@/components/icons";
import { DealModal } from "@/components/DealModal";

type Deal = { id: string; company: string; contact: string; lead: string; stage: string };

export function TodaysMeetings({ deals }: { deals: Deal[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  return (
    <div className="bg-white rounded-2xl border border-wa-hair shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-wa-hair flex items-center gap-2.5">
        <CalendarIcon size={18} className="text-wa-blue" />
        <h3 className="text-lg font-semibold text-wa-navy">Today&rsquo;s Meetings</h3>
      </div>
      {deals.length === 0 && (
        <div className="px-6 py-6 text-wa-dis">No meetings scheduled for today.</div>
      )}
      {deals.map((deal) => (
        <button
          key={deal.id}
          onClick={() => setOpenId(deal.id)}
          className="w-full flex items-center gap-5 px-6 py-5 border-b border-wa-hair last:border-b-0 hover:bg-wa-tint text-left"
        >
          <div className="w-24 flex-shrink-0">
            <div className="text-base font-medium text-wa-navy">10:00 AM</div>
            <div className="text-xs text-wa-meta">30 min</div>
          </div>
          <div className="flex-grow">
            <div className="text-lg text-wa-navy">Qualifying Call &mdash; {deal.company}</div>
            <div className="text-sm text-wa-meta mt-0.5">
              {deal.contact} &middot; {deal.lead}
            </div>
          </div>
          <Pill tone="muted">{STAGE_LABELS[deal.stage as keyof typeof STAGE_LABELS]}</Pill>
          <ChevronRightIcon className="text-wa-meta" />
        </button>
      ))}
      <div className="px-6 py-4 flex items-center gap-2.5 text-wa-dis border-t border-wa-hair">
        <span className="text-sm">No other meetings scheduled for today.</span>
      </div>
      <DealModal dealId={openId} onClose={() => setOpenId(null)} />
    </div>
  );
}
