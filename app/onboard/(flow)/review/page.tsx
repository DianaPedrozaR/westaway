export const dynamic = "force-dynamic";

import { getActiveCase } from "@/lib/onboarding";
import { completeReview } from "./actions";
import { Button, LinkButton } from "@/components/Button";
import { Pill } from "@/components/Pill";

type Params = Record<string, string>;

const FIELD_LABELS: [key: keyof Params, label: string][] = [
  ["employeeLegalName", "Employee Name"],
  ["jobTitle", "Job Title"],
  ["startDate", "Start Date"],
  ["baseSalary", "Base Salary"],
  ["targetBonus", "Target Bonus"],
  ["signOnBonus", "Sign-On Bonus"],
  ["equityGrantType", "Equity Grant"],
  ["equityVesting", "Vesting"],
  ["governingLaw", "Governing Law"],
];

function Ext({ children }: { children: React.ReactNode }) {
  return <span className="bg-wa-blue/10 text-wa-navy px-1 rounded">{children}</span>;
}

export default async function ReviewPage() {
  const activeCase = await getActiveCase();

  if (!activeCase?.collectedParameters) {
    return (
      <div className="flex flex-col gap-6 items-start">
        <h1 className="text-3xl">Not quite ready yet.</h1>
        <p className="text-wa-meta text-lg">Complete the chatbot and pre-fill steps first.</p>
        <LinkButton href="/onboard/chat" size="lg">
          Back to Chatbot
        </LinkButton>
      </div>
    );
  }

  const p: Params = JSON.parse(activeCase.collectedParameters);

  return (
    <div className="fixed inset-0 bg-wa-navy/55 backdrop-blur-sm flex items-center justify-center z-10 p-8">
      <div className="w-full max-w-5xl h-[85vh] bg-white rounded-3xl flex shadow-2xl overflow-hidden">
        <div className="w-3/5 border-r border-wa-hair flex flex-col">
          <div className="px-8 py-5 border-b border-wa-hair flex justify-between items-center bg-gradient-to-r from-wa-blue-light/60 to-white">
            <div className="text-xs uppercase tracking-wide text-wa-meta font-medium">
              Document Preview
            </div>
            <Pill tone="success">Pre-filled</Pill>
          </div>
          <div className="px-10 py-7 overflow-y-auto flex-grow text-[15px] leading-relaxed">
            <h3 className="text-xl text-center">EMPLOYMENT AGREEMENT</h3>
            <p className="mt-4">
              This Employment Agreement (the &ldquo;Agreement&rdquo;) is entered into as of{" "}
              <Ext>{p.startDate}</Ext>, by and between {activeCase.companyName} (the
              &ldquo;Company&rdquo;), and {p.employeeLegalName} (the &ldquo;Employee&rdquo;).
            </p>
            <h4 className="text-wa-navy mt-4">1. Position &amp; Duties</h4>
            <p>
              The Company shall employ the Employee as <Ext>{p.jobTitle}</Ext>, reporting to{" "}
              {p.reportingManager}. Employment type: <Ext>{p.employmentType}</Ext>, work
              location: {p.workLocation}.
            </p>
            <h4 className="text-wa-navy mt-4">2. Compensation</h4>
            <p>
              The Company shall pay the Employee an annual base salary of{" "}
              <Ext>{p.baseSalary}</Ext>, payable {p.paySchedule}. The Employee is eligible for a
              target bonus of <Ext>{p.targetBonus}</Ext> and a sign-on bonus of{" "}
              <Ext>{p.signOnBonus}</Ext>.
            </p>
            <h4 className="text-wa-navy mt-4">3. Equity</h4>
            <p>
              Subject to Board approval: <Ext>{p.equityGrantType}</Ext>, {p.equityShares}{" "}
              vesting <Ext>{p.equityVesting}</Ext>, exercise price {p.equityExercisePrice}.
            </p>
            <h4 className="text-wa-navy mt-4">4. Benefits</h4>
            <p>{p.benefits}</p>
            <h4 className="text-wa-navy mt-4">5. Confidential Information</h4>
            <p>
              {p.confidentialityScope}. Restrictive covenants: {p.restrictiveCovenants}.
            </p>
            <h4 className="text-wa-navy mt-4">6. Governing Law</h4>
            <p>
              This Agreement shall be governed by the laws of <Ext>{p.governingLaw}</Ext>.
            </p>
          </div>
        </div>

        <form action={completeReview} className="w-2/5 flex flex-col">
          <div className="px-7 py-5 border-b border-wa-hair">
            <div className="text-xs uppercase tracking-wide text-wa-meta font-medium">
              Editable Fields
            </div>
            <p className="text-sm text-wa-meta mt-1">
              Correct anything the AI got wrong before completing.
            </p>
          </div>
          <div className="px-7 overflow-y-auto flex-grow">
            {FIELD_LABELS.map(([key, label]) => (
              <div key={key} className="flex flex-col gap-1.5 py-3.5 border-b border-wa-hair">
                <label className="text-xs uppercase tracking-wide text-wa-meta font-medium">
                  {label}
                </label>
                <input
                  name={key}
                  defaultValue={p[key] ?? ""}
                  className="rounded-lg border-[1.5px] border-wa-hair px-3 py-2 text-[15px] text-wa-navy outline-none focus:border-wa-blue"
                />
              </div>
            ))}
          </div>
          <div className="px-7 py-5 border-t border-wa-hair">
            <Button type="submit" size="lg" className="w-full">
              Complete
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
