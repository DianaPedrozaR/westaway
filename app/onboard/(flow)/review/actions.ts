"use server";

import { prisma } from "@/lib/prisma";
import { getActiveCase } from "@/lib/onboarding";
import { redirect } from "next/navigation";

export async function completeReview(formData: FormData) {
  const activeCase = await getActiveCase();
  if (!activeCase) return;

  const current = activeCase.collectedParameters
    ? JSON.parse(activeCase.collectedParameters)
    : {};

  const updated: Record<string, string> = { ...current };
  for (const [key, value] of formData.entries()) {
    updated[key] = String(value);
  }

  await prisma.onboardingCase.update({
    where: { id: activeCase.id },
    data: {
      collectedParameters: JSON.stringify(updated),
      currentStep: "SHEETS",
    },
  });

  redirect("/onboard/sheets");
}
