// RedeemAnalytics.tsx
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface AnalyticsProps {
  redeemData: { time: string; value: number }[];
  pieData: { name: string; value: number; color: string }[];
  totalProducts: number;
}

export default function RedeemAnalytics({
  redeemData,
  pieData,
}: AnalyticsProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Biểu đồ Line - Thống kê Lượt Đổi thưởng */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Thống kê lượt đổi thưởng (Quý/Tháng)
        </h2>
        <ChartContainer
          config={{ redeem: { label: "Lượt đổi", color: "#3b82f6" } }}
          className="h-80 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={redeemData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-redeem)"
                strokeWidth={3}
                dot={false}
              />
              <defs>
                <linearGradient id="colorRedeem" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="none"
                fill="url(#colorRedeem)"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>

      {/* Biểu đồ tròn - Phân bổ theo loại sản phẩm */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Phân bổ sản phẩm theo loại
        </h2>
        <ChartContainer
          className="h-80 w-full"
          config={{ pie: { label: "Pie", color: "#3b82f6" } }}
        >
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                labelLine={false}
                label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend
                content={<ChartLegendContent />}
                wrapperStyle={{ paddingTop: "1rem" }}
                layout="horizontal"
                align="center"
                verticalAlign="bottom"
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
