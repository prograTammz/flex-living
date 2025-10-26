import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

export default function SourceChart({
  sourceData,
  COLORS,
}: {
  sourceData: any[];
  COLORS: string[];
}) {
  return (
    <Card className="p-6 bg-white lg:col-span-1">
      <h3 className="font-bold text-lg mb-4">Source Breakdown</h3>
      {sourceData.length > 0 ? (
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={sourceData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {sourceData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 text-center py-8">
          No review data available
        </p>
      )}
    </Card>
  );
}
