"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function sendOfferEmail(dealId: string) {
  await prisma.deal.update({
    where: { id: dealId },
    data: { offerSent: "SENT" },
  });
  revalidatePath("/os/email-triage");
  revalidatePath("/os/pipeline");
  revalidatePath("/os/dashboard");
}
