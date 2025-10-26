import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function ReviewCard({
  review,
  toggleVisibility,
  renderStars,
}: {
  review: any;
  toggleVisibility: (id: number, next: boolean) => void;
  renderStars: (rating: number) => React.ReactNode;
}) {
  return (
    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h4 className="font-semibold text-gray-900">
            {review.reviewerName || "Guest"}
          </h4>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-gray-500">
              {new Date(review.submittedAt).toLocaleDateString()}
            </span>
            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
              {String(review.channel) || "Direct"}
            </span>
            <span
              className={`text-xs px-2 py-1 rounded font-medium ${
                review.status === "published"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}
            >
              {review.status}
            </span>
          </div>
        </div>
        <Button
          size="sm"
          variant="ghost"
          className={review.isPublic ? "text-teal-600" : "text-gray-400"}
          onClick={() => toggleVisibility(review.id, !review.isPublic)}
        >
          {review.isPublic ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
      </div>

      {typeof review.rating === "number" && (
        <div className="flex items-center gap-2 mb-2">
          {renderStars(review.rating)}
          <span className="text-sm font-bold">
            {review.rating.toFixed(1)}/5
          </span>
        </div>
      )}

      {review.message && (
        <p className="text-gray-700 text-sm mb-3">{review.message}</p>
      )}

      {Array.isArray(review.categories) && review.categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {review.categories.map((cat: any) => (
            <span
              key={cat.category}
              className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded"
            >
              {cat.category.replace(/_/g, " ")}: {cat.rating.toFixed(1)}/5
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
