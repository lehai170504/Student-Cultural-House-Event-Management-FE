"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export function FeedbackReport() {
  const data = [
    { event: "React Workshop", rating: 4.5 },
    { event: "NextJS Seminar", rating: 3.8 },
    { event: "UI/UX Talk", rating: 4.9 },
  ];

  return (
    <Card className="shadow-md border rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-orange-600">
          Đánh giá
        </CardTitle>
        <p className="text-sm text-gray-500">
          Trung bình đánh giá của các sự kiện gần đây
        </p>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={data} barSize={50}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-gray-200" />
            <XAxis dataKey="event" tick={{ fontSize: 12 }} />
            <YAxis domain={[0, 5]} />
            <Tooltip
              cursor={{ fill: "rgba(249,115,22,0.1)" }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const value = Number(payload[0].value); // ép kiểu an toàn
                  return (
                    <div className="rounded-lg border bg-white p-2 shadow-md">
                      <p className="text-sm font-medium">
                        {payload[0].payload.event}
                      </p>
                      <p className="text-orange-600 font-semibold">
                        ⭐ {value.toFixed(1)} / 5
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />

            <Bar
              dataKey="rating"
              fill="url(#colorRating)"
              radius={[8, 8, 0, 0]} // bo tròn đầu cột
            />
            <defs>
              <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#facc15" stopOpacity={0.7} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
