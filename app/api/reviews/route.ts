// app/api/reviews/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const channelId = url.searchParams.get("channelId");
  const minRating = url.searchParams.get("minRating");
  const sortBy = url.searchParams.get("sortBy") ?? "submittedAt";
  const sortOrder =
    url.searchParams.get("sortOrder") === "asc" ? "asc" : "desc";

  let query = supabaseAdmin.from("Review").select("*");

  if (channelId) query = query.eq("channel", Number(channelId));
  if (minRating) query = query.gte("rating", Number(minRating));

  query = query.order(sortBy, { ascending: sortOrder === "asc" });

  const { data, error } = await query;
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ items: data ?? [] });
}
