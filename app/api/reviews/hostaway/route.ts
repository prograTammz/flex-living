import { retrieveReviews } from "@/lib/hostaway/retrieve";
import { NextResponse } from "next/server";
export const runtime = "nodejs";

export async function GET() {
  try {
    const reviews = await retrieveReviews();

    return NextResponse.json({
      source: "hostaway",
      count: reviews.length,
      reviews,
    });
  } catch (err: unknown) {
    const errorMessage =
      typeof err === "object" && err !== null && "message" in err
        ? (err as { message?: string }).message
        : "Unexpected error";
    return NextResponse.json(
      { error: errorMessage ?? "Unexpected error" },
      { status: 500 }
    );
  }
}
