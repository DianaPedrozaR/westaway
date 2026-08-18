export const dynamic = "force-dynamic";

import { getActiveCase, parseJsonArray } from "@/lib/onboarding";
import { Pill } from "@/components/Pill";

type PendingItem = { name: string; status: string };

const STATUS_TONE: Record<string, "success" | "outline" | "muted"> = {
  Completed: "success",
  "In Progress": "outline",
  Pending: "muted",
};

const SECTIONS: [string, string[]][] = [
  [
    "Documents to Upload",
    [
      "Certificate of Incorporation",
      "EIN (IRS) confirmation letter",
      "Bylaws or Operating Agreement",
      "Board authorization to hire",
      "Current cap table",
      "Company handbook / HR policies",
    ],
  ],
  [
    "Documents to Review & Complete",
    [
      "Employment Agreement",
      "Offer Letter",
      "CIIAA",
      "At-Will Acknowledgment",
      "Stock Option Grant",
      "Form I-9",
      "Form W-4 + State Withholding",
    ],
  ],
  ["Sheets", ["Compensation Summary Sheet", "Employee census / roster entry", "Cap table update"]],
];

export default async function PendingPage() {
  const activeCase = await getActiveCase();
  const items = activeCase ? parseJsonArray<PendingItem>(activeCase.pendingItems) : [];
  const statusFor = (name: string) => items.find((i) => i.name === name)?.status ?? "Pending";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl">Pending Items</h1>
        <p className="text-wa-meta mt-2">
          Everything left to finish your Employment Agreement engagement.
        </p>
      </div>

      {SECTIONS.map(([title, names]) => (
        <div key={title} className="flex flex-col gap-3">
          <div className="text-xs uppercase tracking-wide text-wa-meta font-medium">{title}</div>
          <div className="rounded-2xl border border-wa-hair bg-white shadow-sm overflow-hidden">
            {names.map((name) => {
              const status = statusFor(name);
              return (
                <div
                  key={name}
                  className="flex items-center gap-4 px-5 py-4 border-b border-wa-hair last:border-b-0"
                >
                  <div
                    className={`w-[18px] h-[18px] rounded-full flex-shrink-0 ${
                      status === "Completed"
                        ? "bg-wa-green"
                        : status === "In Progress"
                          ? "border-[1.5px] border-wa-blue"
                          : "border-[1.5px] border-wa-hair"
                    }`}
                  />
                  <span className="flex-grow text-lg text-wa-navy">{name}</span>
                  <Pill tone={STATUS_TONE[status]}>{status}</Pill>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
