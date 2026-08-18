export const dynamic = "force-dynamic";

import { prisma } from "@/lib/prisma";
import { getActiveCase } from "@/lib/onboarding";
import { Pill } from "@/components/Pill";

export default async function LegalMattersPage() {
  const activeCase = await getActiveCase();
  const matters = await prisma.legalMatter.findMany({
    where: activeCase ? { companyName: activeCase.companyName } : undefined,
    orderBy: { createdAt: "asc" },
  });

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-4xl">Legal Matters</h1>
        <p className="text-wa-meta mt-2">
          Everything Westaway has completed or is completing for{" "}
          {activeCase?.companyName ?? "your company"}.
        </p>
      </div>

      <div className="rounded-2xl border border-wa-hair bg-white shadow-sm overflow-hidden">
        <table className="w-full text-lg">
          <thead>
            <tr>
              <th className="text-left px-5 py-4 text-xs uppercase tracking-wide text-wa-meta font-medium border-b-[1.5px] border-wa-navy">
                Legal Matter
              </th>
              <th className="text-left px-5 py-4 text-xs uppercase tracking-wide text-wa-meta font-medium border-b-[1.5px] border-wa-navy">
                Status
              </th>
              <th className="text-left px-5 py-4 text-xs uppercase tracking-wide text-wa-meta font-medium border-b-[1.5px] border-wa-navy">
                Date
              </th>
            </tr>
          </thead>
          <tbody>
            {matters.map((matter) => (
              <tr key={matter.id} className="hover:bg-wa-tint/60">
                <td className="px-5 py-4 border-b border-wa-hair text-wa-navy">
                  {matter.matterName}
                </td>
                <td className="px-5 py-4 border-b border-wa-hair">
                  <Pill tone={matter.status === "Completed" ? "success" : "outline"}>
                    {matter.status}
                  </Pill>
                </td>
                <td className="px-5 py-4 border-b border-wa-hair text-wa-navy">
                  {matter.date
                    ? matter.date.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "In progress"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
