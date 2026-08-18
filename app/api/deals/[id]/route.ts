import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const deal = await prisma.deal.findUnique({ where: { id } });
  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }
  return NextResponse.json(deal);
}
