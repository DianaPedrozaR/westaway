export const dynamic = "force-dynamic";

import { getActiveCase } from "@/lib/onboarding";
import { DownloadIcon, ImportIcon } from "@/components/icons";
import { finishOnboarding } from "./actions";
import { Button, LinkButton } from "@/components/Button";

type Params = Record<string, string>;

export default async function SheetsPage() {
  const activeCase = await getActiveCase();

  if (!activeCase?.collectedParameters) {
    return (
      <div className="flex flex-col gap-6 items-start">
        <h1 className="text-3xl">Not quite ready yet.</h1>
        <LinkButton href="/onboard/chat" size="lg">
          Back to Chatbot
        </LinkButton>
      </div>
    );
  }

  const p: Params = JSON.parse(activeCase.collectedParameters);

  const rows: [string, string][] = [
    ["Base salary", p.baseSalary],
    ["Pay schedule", p.paySchedule],
    ["Target bonus", p.targetBonus],
    ["Sign-on bonus", p.signOnBonus],
    ["Equity grant", `${p.equityGrantType} — ${p.equityShares}`],
    ["Vesting", p.equityVesting],
    ["Exercise price", p.equityExercisePrice],
    ["Benefits", p.benefits],
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl">Compensation Summary Sheet</h1>
          <p className="text-wa-meta mt-2">
            {activeCase.employeeName} &middot; {activeCase.companyName}
          </p>
        </div>
        <div className="flex gap-2.5">
          <Button size="sm">Fill in browser</Button>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <DownloadIcon />
            Download
          </Button>
          <Button variant="secondary" size="sm" className="gap-1.5">
            <ImportIcon />
            Import
          </Button>
        </div>
      </div>

      <div className="rounded-2xl border border-wa-hair overflow-hidden bg-white shadow-sm">
        <table className="w-full text-[15px]">
          <tbody>
            {rows.map(([label, value], i) => (
              <tr key={label} className={i % 2 === 1 ? "bg-wa-tint" : ""}>
                <td className="px-5 py-3 border-b border-wa-hair text-wa-meta w-1/3">{label}</td>
                <td className="px-5 py-3 border-b border-wa-hair text-wa-navy">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="text-sm text-wa-dis">
        Figures reflect your onboarding conversation. Equity value is illustrative and depends on
        fair market value at grant and vesting.
      </p>

      <form action={finishOnboarding} className="self-end">
        <Button type="submit" size="lg">
          Finish &amp; View Pending Items &rarr;
        </Button>
      </form>
    </div>
  );
}
