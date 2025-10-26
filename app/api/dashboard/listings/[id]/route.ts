// app/api/dashboard/listings/[id]/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Channel } from "@/app/types/review.type";

export const runtime = "nodejs";

export async function GET(
  _: Request,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  // await params in case Next passes a Promise
  const paramsObj = await context.params;
  const idFromParams = paramsObj?.id;

  const { data: listing, error } = await supabaseAdmin
    .from("Listing")
    .select(`id,title,reviews:Review(rating,isPublic,channel,reviewCategory)`)
    .eq("id", idFromParams)
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 404 });

  const reviews = listing.reviews ?? [];
  const total = reviews.length;
  const avgRating = total
    ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / total
    : 0;
  const published = reviews.filter((r) => r.isPublic).length;
  const approvalRate = total ? published / total : 0;

  // channel breakdown
  // count occurrences by numeric channel id
  const channelCounts: Record<number, number> = {};
  for (const r of reviews) {
    const ch = r.channel;
    if (typeof ch !== "number") continue;
    channelCounts[ch] = (channelCounts[ch] || 0) + 1;
  }

  // helper to convert enum key (camelCase) to human friendly Title Case
  const humanizeEnumName = (name: string) =>
    name
      .replace(/([A-Z])/g, " $1") // insert space before capitals
      .split(" ")
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : ""))
      .join(" ")
      .trim();

  // map numeric channel ids to Channel enum names (humanized)
  const channelBreakdown: Record<string, number> = {};
  for (const [key, count] of Object.entries(channelCounts)) {
    const num = Number(key);
    const enumName = Channel[num]; // reverse map: numeric -> enum key
    const label = enumName ? humanizeEnumName(enumName) : `Channel ${num}`;
    channelBreakdown[label] = count;
  }

  // category averages + issues
  const categoryStats: Record<string, { total: number; sum: number }> = {};
  for (const r of reviews) {
    for (const c of r.reviewCategory ?? []) {
      if (!categoryStats[c.category])
        categoryStats[c.category] = { total: 0, sum: 0 };
      categoryStats[c.category].total++;
      categoryStats[c.category].sum += c.rating ?? 0;
    }
  }
  const categories = Object.entries(categoryStats).map(
    ([cat, { total, sum }]) => ({
      category: cat,
      avgRating: sum / total,
      mentions: total,
    })
  );
  const issues = categories.filter((c) => c.avgRating <= 2.5);

  return NextResponse.json({
    listing: {
      id: listing.id,
      title: listing.title,
    },
    performance: {
      avgRating,
      totalReviews: total,
      publishedReviews: published,
      approvalRate,
    },
    channelBreakdown,
    categories,
    issues,
  });
}
