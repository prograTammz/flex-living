import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";
import { Review } from "@/app/types/review.type";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Use params.id if present; otherwise parse the id from the request URL as a fallback.
  const idFromParams = params?.id;
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
    const { data, error } = await supabase
      .from("Listing")
      .select(
        `*,
        reviews:Review(
          id,
          rating,
          isPublic
        )`
      )
      .eq("id", id)
      .single();

    if (error) {
      // Map Supabase error to 404 when record not found, otherwise 500
      // Supabase returns error.message; handle generically
      return NextResponse.json({ error: error.message }, { status: 404 });
    }

    if (data) {
      const reviews: Review[] = (data.reviews || []) as Review[];
      const totalReviews: number = reviews.length;

      const avgRating5: number | null =
        totalReviews > 0
          ? reviews.reduce(
              (sum: number, r: Review) => sum + (r.rating ?? 0) / 2,
              0
            ) / totalReviews
          : null;

      const approvedCount = reviews.filter((r) => r.isPublic).length;
      const approvalRate =
        totalReviews > 0 ? approvedCount / totalReviews : null;

      return NextResponse.json(
        {
          listing: {
            ...data,
            avgRating5,
            totalReviews,
            approvalRate,
          },
        },
        { status: 200 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
