import { prisma } from "@/lib/prisma";
import { STAGE_LABELS } from "@/lib/deals";
import { Pill } from "@/components/Pill";
import { FlagIcon, SparkleIcon } from "@/components/icons";
import { notFound } from "next/navigation";

function Kv({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between py-3 border-b border-wa-hair last:border-b-0 text-[15px]">
      <span className="text-wa-meta">{label}</span>
      <span className="text-wa-navy font-medium">{value}</span>
    </div>
  );
}

export default async function PreBriefPage({
  searchParams,
}: {
  searchParams: Promise<{ deal?: string }>;
}) {
  const { deal: dealId } = await searchParams;

  const deal = dealId
    ? await prisma.deal.findUnique({ where: { id: dealId } })
    : await prisma.deal.findFirst({ where: { company: "BioVigilance AI" } });

  if (!deal) notFound();

  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <div>
        <div className="text-wa-meta text-sm">Deals Pipeline / {STAGE_LABELS[deal.stage]}</div>
        <h1 className="text-4xl mt-2">Deal Pre-Brief</h1>
        <p className="text-wa-meta mt-1.5">AI-prepared context for today&rsquo;s qualifying call.</p>
      </div>

      <div className="grid grid-cols-[2fr_1fr] gap-5 items-start">
        <div className="flex flex-col gap-5">
          <div className="bg-gradient-to-br from-wa-navy to-[#26398f] rounded-2xl shadow-sm p-7 text-white">
            <h2 className="text-2xl text-white">{deal.company}</h2>
            {deal.roundStage && <div className="text-[#C9D3F5] text-sm mt-1">{deal.roundStage}</div>}
            {deal.dealBriefSummary && (
              <p className="mt-4 text-[15px] leading-relaxed text-[#E4E9FA]">
                {deal.dealBriefSummary}
              </p>
            )}
          </div>

          {deal.productMatch && (
            <div className="bg-white rounded-2xl border border-wa-hair shadow-sm p-7">
              <div className="text-xs uppercase tracking-wide text-wa-meta font-medium mb-4">
                Possible Product Match &amp; Representative Match
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-lg text-wa-navy font-medium">{deal.productMatch}</div>
                  {deal.productPrice && (
                    <div className="text-wa-meta text-sm mt-1">{deal.productPrice}</div>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-wa-blue-light text-wa-blue font-semibold flex items-center justify-center flex-shrink-0">
                    {deal.lead[0]}
                  </div>
                  <div>
                    <div className="text-lg text-wa-navy font-medium">{deal.lead}</div>
                    <div className="text-wa-meta text-sm">matched by Lead</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {deal.keyRisks && (
            <div className="bg-wa-red-light rounded-2xl border border-wa-red/15 p-7">
              <div className="text-xs uppercase tracking-wide text-wa-red font-semibold mb-4 flex items-center gap-2">
                <FlagIcon />
                Key Risks
              </div>
              <p className="text-[15px] leading-relaxed text-wa-navy">{deal.keyRisks}</p>
            </div>
          )}

          {deal.suggestedQuestions && (
            <div className="bg-wa-tint rounded-2xl p-7">
              <div className="text-xs uppercase tracking-wide text-wa-meta font-semibold mb-4 flex items-center gap-2">
                <SparkleIcon />
                AI-Suggested Questions
              </div>
              <p className="text-[15px] leading-relaxed text-wa-navy">{deal.suggestedQuestions}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-5">
          <div className="bg-white rounded-2xl border border-wa-hair shadow-sm p-6">
            <div className="text-xs uppercase tracking-wide text-wa-meta font-medium mb-2">
              Round Details
            </div>
            {deal.roundStage && <Kv label="Stage" value={deal.roundStage} />}
            <Kv label="Lead" value={deal.lead} />
            {deal.employees !== null && <Kv label="Employees" value={deal.employees} />}
            {deal.hq && <Kv label="HQ" value={deal.hq} />}
            {deal.founder && (
              <Kv label="Founder" value={`${deal.founder}${deal.founderYear ? `, ${deal.founderYear}` : ""}`} />
            )}
          </div>
          <div className="bg-white rounded-2xl border border-wa-hair shadow-sm p-6">
            <div className="text-xs uppercase tracking-wide text-wa-meta font-medium mb-2">
              Deal Properties
            </div>
            <Kv label="Contact" value={deal.contact} />
            <Kv label="Source" value={deal.source} />
            <Kv
              label="Offer Drafted"
              value={<Pill tone={deal.offerDrafted === "DONE" ? "success" : "outline"}>{deal.offerDrafted === "DONE" ? "Done" : "Pending"}</Pill>}
            />
            <Kv label="Offer Sent" value={deal.offerSent === "NA" ? "N/A" : deal.offerSent === "SENT" ? "Sent" : "On Review"} />
          </div>
        </div>
      </div>
    </div>
  );
}
