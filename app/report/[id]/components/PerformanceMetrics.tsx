import { Card } from "@/components/ui/card";

export default function PerformanceMetrics({
  performance,
  renderStars,
}: {
  performance: any;
  renderStars: (rating: number) => React.ReactNode;
}) {
  return (
    <>
      <Card className="p-6 bg-white">
        <p className="text-sm text-gray-600 mb-2">Average Rating</p>
        <div className="flex items-center gap-3">
          <div className="text-3xl font-bold text-gray-900">
            {(performance.avgRating ?? 0).toFixed(1)}
          </div>
          <div>{renderStars((performance.avgRating ?? 0) * 2)}</div>
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <p className="text-sm text-gray-600 mb-2">Total Reviews</p>
        <div className="text-3xl font-bold text-gray-900">
          {performance.totalReviews}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {performance.publishedReviews} published,{" "}
          {performance.totalReviews - performance.publishedReviews} awaiting
        </p>
      </Card>

      <Card className="p-6 bg-white">
        <p className="text-sm text-gray-600 mb-2">Approval Rate</p>
        <div className="text-3xl font-bold text-green-600">
          {Math.round(performance.approvalRate ?? 0)}%
        </div>
      </Card>

      <Card className="p-6 bg-white">
        <p className="text-sm text-gray-600 mb-2">Published Reviews</p>
        <div className="text-3xl font-bold text-gray-900">
          {performance.publishedReviews}
        </div>
      </Card>
    </>
  );
}
