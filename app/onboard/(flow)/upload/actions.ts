"use server";

import { prisma } from "@/lib/prisma";
import { getActiveCase, parseJsonArray } from "@/lib/onboarding";
import { revalidatePath } from "next/cache";

type UploadDoc = { name: string; uploaded: boolean; optional?: boolean };

export async function markUploaded(docName: string) {
  const activeCase = await getActiveCase();
  if (!activeCase) return;

  const docs = parseJsonArray<UploadDoc>(activeCase.uploadedDocs);
  const updated = docs.map((d) => (d.name === docName ? { ...d, uploaded: true } : d));

  const pendingItems = parseJsonArray<{ name: string; status: string }>(activeCase.pendingItems);
  const updatedPending = pendingItems.map((p) =>
    p.name === docName ? { ...p, status: "Completed" } : p,
  );

  await prisma.onboardingCase.update({
    where: { id: activeCase.id },
    data: {
      uploadedDocs: JSON.stringify(updated),
      pendingItems: JSON.stringify(updatedPending),
    },
  });

  revalidatePath("/onboard/upload");
  revalidatePath("/onboard/pending");
}
