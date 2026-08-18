import { DealStage } from "@prisma/client";

export const STAGE_ORDER: DealStage[] = [
  "NEW",
  "CALL_SCHEDULED",
  "OPEN_QUESTIONS",
  "FOLLOW_UP",
  "WON",
  "INVOICE_LOE_SENT",
  "PAID",
  "ONBOARDING",
  "ONBOARDED",
  "UNQUALIFIED",
  "LOST",
];

export const STAGE_LABELS: Record<DealStage, string> = {
  NEW: "New",
  CALL_SCHEDULED: "Call Scheduled",
  OPEN_QUESTIONS: "Open Questions",
  FOLLOW_UP: "Follow Up",
  WON: "Won",
  INVOICE_LOE_SENT: "Invoice & LOE Sent",
  PAID: "Paid",
  ONBOARDING: "Onboarding",
  ONBOARDED: "Onboarded",
  UNQUALIFIED: "Unqualified",
  LOST: "Lost",
};

export const CLOSED_STAGES: DealStage[] = ["UNQUALIFIED", "LOST"];
export const POSITIVE_STAGES: DealStage[] = ["WON", "PAID", "ONBOARDED"];

export type StageTone = "muted" | "outline" | "success" | "danger";

export const STAGE_TONE: Record<DealStage, StageTone> = {
  NEW: "muted",
  CALL_SCHEDULED: "muted",
  OPEN_QUESTIONS: "outline",
  FOLLOW_UP: "outline",
  INVOICE_LOE_SENT: "outline",
  ONBOARDING: "outline",
  WON: "success",
  PAID: "success",
  ONBOARDED: "success",
  UNQUALIFIED: "danger",
  LOST: "danger",
};

export const STAGE_ACCENT: Record<DealStage, string> = {
  NEW: "bg-wa-hair",
  CALL_SCHEDULED: "bg-wa-dis",
  OPEN_QUESTIONS: "bg-wa-blue",
  FOLLOW_UP: "bg-wa-blue",
  INVOICE_LOE_SENT: "bg-wa-blue",
  ONBOARDING: "bg-wa-blue",
  WON: "bg-wa-green",
  PAID: "bg-wa-green",
  ONBOARDED: "bg-wa-green",
  UNQUALIFIED: "bg-wa-red",
  LOST: "bg-wa-red",
};
