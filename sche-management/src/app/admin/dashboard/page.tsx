"use client";

import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"; // chỉnh import đúng project
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Area,
} from "recharts";
import { Users, TicketCheck, CalendarDays, Clock } from "lucide-react";

export default function Dashboard() {
  // Fake realtime data
  const [checkinData, setCheckinData] = useState([
    { time: "09:00", value: 20 },
    { time: "10:00", value: 35 },
    { time: "11:00", value: 50 },
    { time: "12:00", value: 75 },
  ]);

  const [todayEvents] = useState(3);
  const [totalAttendees] = useState(250);
  const [checkedIn] = useState(120);
  const [notCheckedIn] = useState(130);

  useEffect(() => {
    // Giả lập realtime cập nhật mỗi 3s
    const interval = setInterval(() => {
      setCheckinData((prev) => {
        const now = new Date();
        const label = `${now.getHours()}:${String(now.getMinutes()).padStart(
          2,
          "0"
        )}`;
        return [
          ...prev.slice(-9),
          { time: label, value: Math.floor(Math.random() * 200) },
        ];
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Event Dashboard</h1>
      <p className="text-gray-500">
        Theo dõi hoạt động và check-in sự kiện theo thời gian thực
      </p>

      {/* Tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow p-5 flex flex-col">
          <div className="flex items-center gap-3 text-orange-500">
            <CalendarDays className="w-6 h-6" />
            <h2 className="text-sm font-medium text-gray-600">
              Sự kiện hôm nay
            </h2>
          </div>
          <p className="text-3xl font-bold mt-2">{todayEvents}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex flex-col">
          <div className="flex items-center gap-3 text-blue-500">
            <Users className="w-6 h-6" />
            <h2 className="text-sm font-medium text-gray-600">
              Tổng người tham gia
            </h2>
          </div>
          <p className="text-3xl font-bold mt-2">{totalAttendees}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex flex-col">
          <div className="flex items-center gap-3 text-green-500">
            <TicketCheck className="w-6 h-6" />
            <h2 className="text-sm font-medium text-gray-600">Đã check-in</h2>
          </div>
          <p className="text-3xl font-bold mt-2">{checkedIn}</p>
        </div>

        <div className="bg-white rounded-xl shadow p-5 flex flex-col">
          <div className="flex items-center gap-3 text-red-500">
            <Clock className="w-6 h-6" />
            <h2 className="text-sm font-medium text-gray-600">Chưa check-in</h2>
          </div>
          <p className="text-3xl font-bold mt-2">{notCheckedIn}</p>
        </div>
      </div>

      {/* Biểu đồ realtime */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">
          Thống kê check-in realtime
        </h2>
        <ChartContainer
          config={{
            checkin: { label: "Check-in", color: "#3b82f6" }, // blue-500
          }}
          className="h-80 w-full"
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={checkinData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-checkin)"
                strokeWidth={3}
                dot={false}
              />
              {/* Gradient fill dưới line */}
              <defs>
                <linearGradient id="colorCheckin" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area
                type="monotone"
                dataKey="value"
                stroke="none"
                fill="url(#colorCheckin)"
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </div>
  );
}
