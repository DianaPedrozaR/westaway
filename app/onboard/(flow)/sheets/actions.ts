"use server";

import { prisma } from "@/lib/prisma";
import { getActiveCase, parseJsonArray } from "@/lib/onboarding";
import { redirect } from "next/navigation";

export async function finishOnboarding() {
  const activeCase = await getActiveCase();
  if (!activeCase) return;

  const pendingItems = parseJsonArray<{ name: string; status: string }>(activeCase.pendingItems);
  const updatedPending = pendingItems.map((p) =>
    p.name === "Employment Agreement" ? { ...p, status: "Completed" } : p,
  );

  await prisma.onboardingCase.update({
    where: { id: activeCase.id },
    data: { currentStep: "DONE", pendingItems: JSON.stringify(updatedPending) },
  });

  redirect("/onboard/pending");
}
