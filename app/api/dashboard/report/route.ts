// app/api/dashboard/report/route.ts
import { supabase } from "@/lib/supabase/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET() {
  try {
    // 1. Fetch all listings with their reviews
    const { data: listings, error } = await supabase.from("Listing").select(`
        id,
        title,
        guests,
        beds,
        bathrooms,
        reviews:Review(
          rating,
          isPublic
        )
      `);

    if (error) throw error;

    // 2. Global aggregates
    const allReviews = (listings ?? []).flatMap((l) => l.reviews ?? []);
    const total = allReviews.length;
    const avgRating5 = total
      ? allReviews.reduce((s, r) => s + (r.rating ?? 0), 0) / total
      : 0;
    const approved = allReviews.filter((r) => r.isPublic).length;
    const approvalRate = total ? approved / total : 0;

    const metrics = {
      totalReviews: total,
      avgRating5,
      approvedReviews: approved,
      approvalRate,
    };

    // 3. Per-listing performance
    const perListing = (listings ?? []).map((l) => {
      const reviews = l.reviews ?? [];
      const countAll = reviews.length;
      const avg = countAll
        ? reviews.reduce((s, r) => s + (r.rating ?? 0), 0) / countAll
        : 0;
      const approvedCount = reviews.filter((r) => r.isPublic).length;
      const rate = countAll ? approvedCount / countAll : 0;

      return {
        id: l.id,
        title: l.title,
        beds: l.beds,
        bathrooms: l.bathrooms,
        guests: l.guests,
        reviewsCount: countAll,
        avgRating: avg,
        approvedReviews: approvedCount,
        approvalRate: rate,
      };
    });

    return NextResponse.json({
      metrics,
      listings: perListing,
    });
  } catch (err: any) {
    const msg = err.message || "Unauthorized";
    const status = msg === "Forbidden" ? 403 : 401;
    return NextResponse.json({ error: msg }, { status });
  }
}
