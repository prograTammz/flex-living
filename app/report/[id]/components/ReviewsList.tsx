import ReviewCard from "./ReviewCard";

export default function ReviewsList({
  reviews,
  toggleVisibility,
  renderStars,
}: {
  reviews: any[];
  toggleVisibility: (id: number, next: boolean) => void;
  renderStars: (rating: number) => React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      {reviews.length > 0 ? (
        reviews.map((review) => (
          <ReviewCard
            key={review.id}
            review={review}
            toggleVisibility={toggleVisibility}
            renderStars={renderStars}
          />
        ))
      ) : (
        <p className="text-center text-gray-500 py-8">No reviews found</p>
      )}
    </div>
  );
}
