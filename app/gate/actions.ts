"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { GATE_COOKIE, GATE_COOKIE_VALUE } from "@/lib/auth";

export async function verifyPasscode(formData: FormData) {
  const passcode = String(formData.get("passcode") ?? "");
  const next = String(formData.get("next") ?? "/");

  if (passcode !== process.env.ACCESS_PASSCODE) {
    redirect(`/gate?next=${encodeURIComponent(next)}&error=1`);
  }

  const store = await cookies();
  store.set(GATE_COOKIE, GATE_COOKIE_VALUE, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });

  redirect(next || "/");
}
