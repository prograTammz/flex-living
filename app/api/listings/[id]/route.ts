import { NextResponse, type NextRequest } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { Review } from "@/app/types/review.type";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } | Promise<{ id: string }> }
) {
  // await params in case Next passes a Promise
  const paramsObj = await context.params;
  const idFromParams = paramsObj?.id;
  const url = new URL(request.url);
  const idFromPath = url.pathname.split("/").filter(Boolean).pop();
  const id = idFromParams ?? idFromPath;

  // If id is still missing, return a clear 400 error.
  if (!id) {
    return NextResponse.json(
      { error: "Missing id parameter in route or URL" },
      { status: 400 }
    );
  }

  try {
    const { data: listing, error } = await supabase
      .from("Listing")
      .select(
        `*,
        reviews:Review(
          id,
          rating,
          message,
          isPublic,
          reviewerName
        )`
      )
      .eq("id", id)
      .single();

    // Return Supabase errors as 500 (or adjust mapping if you want specific 404 mapping)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // If no listing was returned, respond 404
    if (!listing) {
      return NextResponse.json({ error: "Listing not found" }, { status: 404 });
    }

    // Ensure reviews is always an array to avoid runtime errors
    const allReviewsRaw = listing.reviews ?? [];
    const allReviews: Review[] = Array.isArray(allReviewsRaw)
      ? allReviewsRaw
      : [];

    const publicReviews = allReviews.filter((r) => Boolean(r?.isPublic));
    const countAll = allReviews.length;

    // Use the actual 'rating' field and coerce to number to avoid NaN issues
    const avgRating =
      countAll > 0
        ? allReviews.reduce((s, r) => s + Number(r?.rating ?? 0), 0) / countAll
        : 0;

    const approvedCount = publicReviews.length;
    const approvalRate = countAll ? approvedCount / countAll : 0;

    return NextResponse.json({
      ...listing,
      reviewsCount: countAll,
      avgRating,
      approvedReviews: approvedCount,
      approvalRate,
      reviews: publicReviews,
    });
  } catch (err) {
    console.log(err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
