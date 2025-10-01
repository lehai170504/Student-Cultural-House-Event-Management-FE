"use client";

import { useEffect, useState } from "react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"; // chỉnh lại import theo project
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
import {
  Users,
  TicketCheck,
  CalendarDays,
  Clock,
  TrendingUp,
  TrendingDown,
} from "lucide-react";

// Mock dữ liệu sự kiện hôm nay
const eventsToday = [
  { id: 1, name: "Hội thảo Công nghệ", total: 120, checkedIn: 80 },
  { id: 2, name: "Workshop Khởi nghiệp", total: 90, checkedIn: 50 },
  { id: 3, name: "Cuộc thi Văn nghệ", total: 150, checkedIn: 100 },
];

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

  // Pie chart data
  const pieData = [
    { name: "Đã check-in", value: checkedIn, color: "#22c55e" }, // green
    { name: "Chưa check-in", value: notCheckedIn, color: "#ef4444" }, // red
  ];

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard sự kiện</h1>
      <p className="text-gray-500">
        Theo dõi hoạt động, check-in và doanh thu sự kiện theo thời gian thực
      </p>

      {/* Cards tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <CardStat
          title="Sự kiện hôm nay"
          value={todayEvents}
          icon={<CalendarDays className="w-6 h-6 text-orange-500" />}
          change="+12%"
          positive
        />
        <CardStat
          title="Tổng người tham gia"
          value={totalAttendees}
          icon={<Users className="w-6 h-6 text-blue-500" />}
          change="+8%"
          positive
        />
        <CardStat
          title="Đã check-in"
          value={checkedIn}
          icon={<TicketCheck className="w-6 h-6 text-green-500" />}
          change="+5%"
          positive
        />
        <CardStat
          title="Chưa check-in"
          value={notCheckedIn}
          icon={<Clock className="w-6 h-6 text-red-500" />}
          change="-3%"
          positive={false}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Biểu đồ line realtime */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Thống kê check-in realtime
          </h2>
          <ChartContainer
            config={{ checkin: { label: "Check-in", color: "#3b82f6" } }}
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
                  stroke="var(--color-checkin)" // lấy từ ChartContainer
                  strokeWidth={3}
                  dot={false}
                />
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

        {/* Biểu đồ tròn */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Tỷ lệ check-in hôm nay
          </h2>
          {/* Đặt PieChart vào ChartContainer để useChart không bị lỗi */}
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
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bảng sự kiện hôm nay */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Sự kiện hôm nay
          </h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Tên sự kiện</th>
                <th className="py-2">Người tham gia</th>
                <th className="py-2">Đã check-in</th>
                <th className="py-2">Tỉ lệ</th>
              </tr>
            </thead>
            <tbody>
              {eventsToday.map((ev) => {
                const ratio = ((ev.checkedIn / ev.total) * 100).toFixed(1);
                return (
                  <tr key={ev.id} className="border-b last:border-0">
                    <td className="py-2 font-medium">{ev.name}</td>
                    <td>{ev.total}</td>
                    <td>{ev.checkedIn}</td>
                    <td>{ratio}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Hoạt động gần đây */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Hoạt động gần đây
          </h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li>
              ✅ Nguyễn Văn A vừa check-in vào{" "}
              <span className="font-medium">Hội thảo Công nghệ</span>
            </li>
            <li>
              🎉 Event <span className="font-medium">Workshop Khởi nghiệp</span>{" "}
              vừa được tạo
            </li>
            <li>
              👤 30 người đã đăng ký tham gia{" "}
              <span className="font-medium">Cuộc thi Văn nghệ</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// Component card thống kê
function CardStat({
  title,
  value,
  icon,
  change,
  positive,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  change: string;
  positive: boolean;
}) {
  return (
    <div className="bg-white rounded-xl shadow p-5 flex flex-col">
      <div className="flex items-center gap-3">{icon}</div>
      <h2 className="text-sm font-medium text-gray-600 mt-2">{title}</h2>
      <p className="text-3xl font-bold mt-1">{value}</p>
      <div
        className={`flex items-center gap-1 text-sm mt-2 ${
          positive ? "text-green-600" : "text-red-600"
        }`}
      >
        {positive ? (
          <TrendingUp className="w-4 h-4" />
        ) : (
          <TrendingDown className="w-4 h-4" />
        )}
        <span>{change}</span>
      </div>
    </div>
  );
}
