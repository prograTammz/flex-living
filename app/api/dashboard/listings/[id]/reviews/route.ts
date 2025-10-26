import { supabaseAdmin } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

const SORTABLE = new Set(["rating", "submittedAt", "guestName"]);

export async function GET(
  req: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  // await params in case Next passes a Promise
  const paramsObj = await context.params;
  const listingId = paramsObj?.id;
  // Fetch all Listing, newest first
  const url = new URL(req.url);
  const channelId = url.searchParams.get("channel");
  const minRating = url.searchParams.get("minRating");
  const sortBy = SORTABLE.has(url.searchParams.get("sortBy") ?? "")
    ? (url.searchParams.get("sortBy") as
        | "rating"
        | "submittedAt"
        | "reviewerName")
    : "submittedAt";
  const sortOrder =
    url.searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  let query = supabaseAdmin
    .from("Review")
    .select(
      `
      id,
      listingId,
      reviewerName,
      rating,
      message,
      isPublic,
      channel,
      reviewCategory,
      submittedAt
    `
    )
    .eq("listingId", listingId);

  if (channelId) query = query.eq("channel", Number(channelId));
  if (minRating) query = query.gte("rating", Number(minRating));

  const { data, error } = await query.order(sortBy, {
    ascending: sortOrder === "asc",
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ items: data ?? [] });
}
