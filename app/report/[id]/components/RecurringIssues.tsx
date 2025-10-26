import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export default function RecurringIssues({
  issues,
  renderStars,
}: {
  issues: any[];
  renderStars: (rating: number) => React.ReactNode;
}) {
  return (
    <Card className="p-6 bg-white mb-8 border-l-4 border-red-500">
      <div className="flex items-center gap-2 mb-4">
        <AlertCircle className="h-5 w-5 text-red-600" />
        <h3 className="font-bold text-lg text-gray-900">Recurring Issues</h3>
      </div>
      <div className="space-y-4">
        {issues.map((issue: any, idx: number) => (
          <div
            key={idx}
            className="p-4 bg-red-50 rounded-lg border border-red-200"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-gray-900">{issue.issue}</h4>
              <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                {issue.mentions} mentions
              </span>
            </div>
            {issue.averageRating && (
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-600">Avg Rating:</span>
                {renderStars(issue.averageRating)}
                <span className="text-sm font-bold">
                  {issue.averageRating.toFixed(1)}/10
                </span>
              </div>
            )}
            {issue.recentMentions?.length > 0 && (
              <div className="mt-3 pt-3 border-t border-red-200">
                <p className="text-xs text-gray-600 mb-2">Recent mentions:</p>
                <p className="text-sm text-gray-700 italic">
                  "{issue.recentMentions[0]}"
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
