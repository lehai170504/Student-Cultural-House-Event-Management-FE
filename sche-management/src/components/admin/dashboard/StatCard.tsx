// StatCard.tsx
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  change: string;
  positive: boolean;
  valueFormat?: (value: number) => string;
  isLoading?: boolean;
}

export default function StatCard({
  title,
  value,
  icon,
  change,
  positive,
  valueFormat = (v: number) => v.toLocaleString(),
  isLoading = false,
}: StatCardProps) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col">
      <div className="flex items-center justify-between">
        {icon}
        <div
          className={`flex items-center gap-1 text-xs font-semibold ${
            positive
              ? "text-green-600 bg-green-100 p-1 rounded-full"
              : "text-red-600 bg-red-100 p-1 rounded-full"
          }`}
        >
          {positive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          <span>{change}</span>
        </div>
      </div>
      <h2 className="text-sm font-medium text-gray-600 mt-3">{title}</h2>
      <p className="text-3xl font-bold mt-1">
        {isLoading ? (
          <span className="text-xl text-gray-400">...</span>
        ) : (
          valueFormat(value)
        )}
      </p>
    </div>
  );
}
