import { ingestReviews } from "@/lib/hostaway";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  await ingestReviews();
  return NextResponse.json({ status: "ok" });
}
