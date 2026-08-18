export const dynamic = "force-dynamic";

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CLOSED_STAGES } from "@/lib/deals";
import { StatTile } from "@/components/StatTile";
import { CalendarIcon, EnvelopeIcon, BriefcaseIcon } from "@/components/icons";
import { TodaysMeetings } from "@/components/TodaysMeetings";

export default async function DashboardPage() {
  const deals = await prisma.deal.findMany();

  const activeDeals = deals.filter((d) => !CLOSED_STAGES.includes(d.stage)).length;
  const pendingOfferEmails = deals.filter((d) => d.offerSent === "ON_REVIEW").length;
  const upcomingMeetings = deals.filter((d) => d.stage === "CALL_SCHEDULED");
  const onReviewDeals = deals.filter((d) => d.offerSent === "ON_REVIEW");

  return (
    <div className="flex flex-col gap-8 max-w-6xl">
      <div>
        <h1 className="text-4xl">Good afternoon, Kyle.</h1>
        <p className="text-wa-meta text-lg mt-2">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}{" "}
          &middot; Westaway
        </p>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <StatTile label="Upcoming Meetings (Week)" value={upcomingMeetings.length} icon={<CalendarIcon />} />
        <StatTile label="Pending Offer Emails" value={pendingOfferEmails} icon={<EnvelopeIcon />} />
        <StatTile label="Active Deals" value={activeDeals} icon={<BriefcaseIcon />} />
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-5 items-start">
        <TodaysMeetings deals={upcomingMeetings} />

        <div className="bg-white rounded-2xl border border-wa-hair shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-wa-hair flex items-center gap-2.5">
            <EnvelopeIcon size={18} className="text-wa-blue" />
            <h3 className="text-lg font-semibold text-wa-navy">Pending Offer Emails</h3>
          </div>
          <div className="px-6 py-5 flex flex-col gap-3">
            {onReviewDeals.length === 0 && <div className="text-wa-dis">Nothing on review.</div>}
            {onReviewDeals.map((deal) => (
              <div key={deal.id}>
                <div className="text-lg text-wa-navy">{deal.company}</div>
                <div className="text-sm text-wa-meta">
                  {deal.contact} &middot; {deal.productMatch} &middot; On Review
                </div>
              </div>
            ))}
            <Link href="/os/email-triage" className="text-sm text-wa-blue font-medium">
              Review in Email Triage &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
