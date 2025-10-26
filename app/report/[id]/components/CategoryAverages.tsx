import { Card } from "@/components/ui/card";

export default function CategoryAverages({
  categoryAverages,
}: {
  categoryAverages: Record<string, number>;
}) {
  return (
    <Card className="p-6 bg-white lg:col-span-2">
      <h3 className="font-bold text-lg mb-4">Category Averages</h3>
      <div className="space-y-4">
        {Object.entries(categoryAverages || {}).map(([category, avg]) => (
          <div key={category}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium capitalize text-gray-700">
                {category.replace(/_/g, " ")}
              </span>
              <span className="text-sm font-bold text-gray-900">
                {(avg as number).toFixed(1)}/5
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-teal-600 h-2 rounded-full"
                style={{ width: `${((avg as number) / 5) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
