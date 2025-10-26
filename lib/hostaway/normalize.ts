import { Review, ReviewCategory } from "@/app/types/review.type";
import { HostawayReview } from "./types";

export function normalizeReview(review: HostawayReview): Review {
  const reviewCategories: ReviewCategory[] = review.reviewCategory.map(
    (category) => ({
      category: category.category,
      rating: category.rating / 2,
    })
  );
  return {
    sourceId: review.id.toString(),
    listingId: review.listingMapId,
    type: "guest-to-host",
    rating: (review.rating ?? 0) / 2,
    channel: review.channelId,
    status: review.status as "published",
    isPublic: false,
    reviewCategory: reviewCategories,
    submittedAt: review.submittedAt,
    message: review.publicReview,
    reviewerName: review.guestName,
    source: "hostaway",
    createdAt: new Date().toISOString(),
  };
}
