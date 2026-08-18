export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { SendIcon } from "@/components/icons";
import { Pill } from "@/components/Pill";
import { Button } from "@/components/Button";
import { sendOfferEmail } from "./actions";

export default async function EmailTriagePage() {
  const deals = await prisma.deal.findMany({
    where: { offerSent: { not: "NA" } },
    orderBy: [{ offerSent: "asc" }, { company: "asc" }],
  });

  const onReview = deals.filter((d) => d.offerSent === "ON_REVIEW");
  const sent = deals.filter((d) => d.offerSent === "SENT");

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      <div>
        <h1 className="text-4xl">Email Triage</h1>
        <p className="text-wa-meta mt-1.5">
          Offer emails drafted by AI, queued here for human review before sending.
        </p>
      </div>

      <div className="flex gap-2 bg-white rounded-full p-1 border border-wa-hair w-fit shadow-sm">
        <div className="px-5 py-2 rounded-full bg-wa-navy text-white text-sm font-medium">
          All &middot; {deals.length}
        </div>
        <div className="px-5 py-2 rounded-full text-wa-meta text-sm font-medium">
          On Review &middot; {onReview.length}
        </div>
        <div className="px-5 py-2 rounded-full text-wa-meta text-sm font-medium">
          Sent &middot; {sent.length}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-wa-hair shadow-sm overflow-hidden">
        {deals.length === 0 && <div className="px-6 py-6 text-wa-dis">No offer emails yet.</div>}
        {[...onReview, ...sent].map((deal) => (
          <div
            key={deal.id}
            className={`flex items-center gap-5 px-6 py-4 border-b border-wa-hair last:border-b-0 ${
              deal.offerSent === "ON_REVIEW" ? "bg-wa-blue-light/50" : ""
            }`}
          >
            <div className="w-11 h-11 rounded-full bg-wa-tint text-wa-navy font-semibold flex items-center justify-center flex-shrink-0">
              {deal.contact
                .split(" ")
                .map((w) => w[0])
                .slice(0, 2)
                .join("")}
            </div>
            <div className="flex-grow">
              <div className="flex gap-2 items-center">
                <span className="text-[15px] text-wa-navy font-medium">{deal.contact}</span>
                <Pill tone="muted">{deal.company}</Pill>
              </div>
              <div className="text-[15px] text-wa-body mt-0.5">
                Offer email &mdash; {deal.productMatch}
                {deal.productPrice ? `, ${deal.productPrice}` : ""}
              </div>
            </div>
            {deal.offerSent === "ON_REVIEW" ? (
              <>
                <Pill tone="outline">On Review</Pill>
                <form
                  action={async () => {
                    "use server";
                    await sendOfferEmail(deal.id);
                  }}
                >
                  <Button type="submit" size="sm">
                    <SendIcon size={14} />
                    Review &amp; Send
                  </Button>
                </form>
              </>
            ) : (
              <Pill tone="success">Sent</Pill>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
