import { NextRequest, NextResponse } from "next/server";
import { GATE_COOKIE, GATE_COOKIE_VALUE } from "@/lib/auth";

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname === "/gate" ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico" ||
    pathname.startsWith("/westaway-logo")
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get(GATE_COOKIE)?.value;
  if (cookie === GATE_COOKIE_VALUE) {
    return NextResponse.next();
  }

  const gateUrl = new URL("/gate", request.url);
  gateUrl.searchParams.set("next", pathname + search);
  return NextResponse.redirect(gateUrl);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
