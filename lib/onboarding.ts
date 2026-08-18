import { prisma } from "@/lib/prisma";

// This prototype supports a single active onboarding engagement at a time,
// matching how the client-facing app is actually used (one client, one flow).
export async function getActiveCase() {
  return prisma.onboardingCase.findFirst({
    orderBy: { updatedAt: "desc" },
    include: { deal: true },
  });
}

export type ChatTurn = { role: "user" | "assistant"; content: string };

export function parseMessages(raw: string): ChatTurn[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function parseJsonArray<T>(raw: string): T[] {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const EMPLOYMENT_PARAMETER_SCHEMA = {
  name: "save_employment_parameters",
  description:
    "Save the fully collected set of Employment Agreement parameters once every field has been confirmed in conversation. Call this exactly once, only when you have all fields.",
  input_schema: {
    type: "object" as const,
    properties: {
      employeeLegalName: { type: "string", description: "Employee's full legal name" },
      jobTitle: { type: "string", description: "Job title" },
      reportingManager: { type: "string", description: "Reporting manager name and title" },
      startDate: { type: "string", description: "Start date, e.g. September 1, 2026" },
      employmentType: {
        type: "string",
        description: "e.g. Full-time, exempt, at-will",
      },
      workLocation: { type: "string", description: "Work location, e.g. Remote (Austin, TX)" },
      baseSalary: { type: "string", description: "Annual base salary, e.g. $165,000" },
      paySchedule: { type: "string", description: "e.g. Semi-monthly" },
      targetBonus: { type: "string", description: "Target bonus, e.g. 10% of base, annual" },
      signOnBonus: { type: "string", description: "Sign-on bonus, e.g. $10,000 one-time, or None" },
      equityGrantType: { type: "string", description: "e.g. Incentive Stock Options (ISO), or None" },
      equityShares: { type: "string", description: "Number of shares/units, or None" },
      equityVesting: { type: "string", description: "Vesting schedule, or None" },
      equityExercisePrice: { type: "string", description: "Exercise price, or None" },
      benefits: { type: "string", description: "Benefits summary" },
      confidentialityScope: {
        type: "string",
        description: "Confidentiality / IP assignment scope, e.g. CIIAA required",
      },
      restrictiveCovenants: {
        type: "string",
        description: "Non-solicit / non-compete terms, or None",
      },
      governingLaw: { type: "string", description: "Governing law / state jurisdiction" },
    },
    required: [
      "employeeLegalName",
      "jobTitle",
      "reportingManager",
      "startDate",
      "employmentType",
      "workLocation",
      "baseSalary",
      "paySchedule",
      "targetBonus",
      "signOnBonus",
      "equityGrantType",
      "equityShares",
      "equityVesting",
      "equityExercisePrice",
      "benefits",
      "confidentialityScope",
      "restrictiveCovenants",
      "governingLaw",
    ],
    additionalProperties: false as const,
  },
};

export const CHAT_SYSTEM_PROMPT = `You are Westaway's onboarding assistant, guiding a client through setting up an Employment Agreement ($1,200 flat fee).

Your job: have a natural, efficient conversation to collect the following parameters, asking only for what hasn't already been mentioned. Ask a few related questions at a time (not all 17 at once) so it feels like a conversation, not a form:
- Employee legal name, job title, reporting manager
- Start date, employment type (e.g. full-time/exempt/at-will), work location
- Compensation: base salary, pay schedule, target bonus, sign-on bonus
- Equity (if any): grant type, share count, vesting, exercise price — or confirm there is none
- Benefits summary
- Confidentiality / IP assignment scope (e.g. CIIAA)
- Restrictive covenants: non-solicit, non-compete (or confirm none)
- Governing law / state jurisdiction

Tone: warm, direct, efficient — like a sharp colleague, not a generic chatbot. Keep messages short.

Once you have gathered every field above and the client has confirmed the details, call the save_employment_parameters tool with the complete, accurate data. Do not call it before you have every field. After calling it, send one short closing message confirming you have everything you need.`;
