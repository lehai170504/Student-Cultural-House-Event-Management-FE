"use client";

import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Check, X, Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";

interface EventItem {
  id: number;
  name: string;
  organizer: string;
  date: string; // dd/mm/yyyy
  status: "pending" | "approved" | "rejected";
}

const events: EventItem[] = [
  {
    id: 1,
    name: "Ngày hội việc làm 2025",
    organizer: "Khoa CNTT",
    date: "12/11/2025",
    status: "pending",
  },
  {
    id: 2,
    name: "Lễ hội văn hóa sinh viên",
    organizer: "Phòng Công tác SV",
    date: "05/10/2025",
    status: "approved",
  },
  {
    id: 3,
    name: "Cuộc thi ý tưởng khởi nghiệp",
    organizer: "CLB Khởi nghiệp",
    date: "20/12/2025",
    status: "approved",
  },
  {
    id: 4,
    name: "Talkshow khởi nghiệp",
    organizer: "CLB Doanh nhân trẻ",
    date: "01/08/2025",
    status: "approved",
  },
];

function parseDate(str: string) {
  const [day, month, year] = str.split("/").map(Number);
  return new Date(year, month - 1, day);
}

// Xác định tình trạng (upcoming, ongoing, past)
function getEventPhase(dateStr: string) {
  const today = new Date();
  const eventDate = parseDate(dateStr);
  const start = new Date(eventDate);
  const end = new Date(eventDate);
  end.setDate(end.getDate() + 1); // giả sử sự kiện kéo dài 1 ngày

  if (today < start) return "upcoming";
  if (today >= start && today < end) return "ongoing";
  return "past";
}

export default function EventsManagement() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [phaseFilter, setPhaseFilter] = useState("all");

  const statusColors = {
    pending: {
      bg: "bg-yellow-100",
      text: "text-yellow-600",
      label: "Chờ duyệt",
    },
    approved: {
      bg: "bg-green-100",
      text: "text-green-600",
      label: "Đã duyệt",
    },
    rejected: {
      bg: "bg-red-100",
      text: "text-red-600",
      label: "Bị từ chối",
    },
  };

  const phaseColors = {
    upcoming: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      label: "Sắp diễn ra",
    },
    ongoing: {
      bg: "bg-purple-100",
      text: "text-purple-600",
      label: "Đang diễn ra",
    },
    past: { bg: "bg-gray-200", text: "text-gray-700", label: "Đã kết thúc" },
  };

  const filteredEvents = events.filter((e) => {
    const matchStatus = statusFilter === "all" || e.status === statusFilter;
    const matchPhase =
      phaseFilter === "all" ||
      (e.status === "approved" && getEventPhase(e.date) === phaseFilter);

    return matchStatus && matchPhase;
  });

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          {/* Header + Bộ lọc */}
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý sự kiện
              </h1>
              <p className="text-lg text-gray-600">
                Admin duyệt và quản lý tình trạng sự kiện
              </p>
            </div>

            <div className="flex md:justify-end justify-center items-center gap-6">
              {/* Filter theo trạng thái */}
              <div className="flex items-center gap-3">
                <Label htmlFor="status" className="text-gray-700 font-medium">
                  Trạng thái:
                </Label>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val)}
                >
                  <SelectTrigger id="status" className="w-[160px]">
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="pending">Chờ duyệt</SelectItem>
                    <SelectItem value="approved">Đã duyệt</SelectItem>
                    <SelectItem value="rejected">Bị từ chối</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Filter theo tình trạng */}
              <div className="flex items-center gap-3">
                <Label htmlFor="phase" className="text-gray-700 font-medium">
                  Tình trạng:
                </Label>
                <Select
                  value={phaseFilter}
                  onValueChange={(val) => setPhaseFilter(val)}
                >
                  <SelectTrigger id="phase" className="w-[160px]">
                    <SelectValue placeholder="Chọn tình trạng" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                    <SelectItem value="ongoing">Đang diễn ra</SelectItem>
                    <SelectItem value="past">Đã kết thúc</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Bảng sự kiện */}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="text-white">
                  <TableHead className="px-6 py-3">Tên sự kiện</TableHead>
                  <TableHead className="px-6 py-3">Ban tổ chức</TableHead>
                  <TableHead className="px-6 py-3">Ngày diễn ra</TableHead>
                  <TableHead className="px-6 py-3">Trạng thái</TableHead>
                  <TableHead className="px-6 py-3">Tình trạng</TableHead>
                  <TableHead className="px-6 py-3">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => {
                  const phase =
                    event.status === "approved"
                      ? getEventPhase(event.date)
                      : null;
                  return (
                    <TableRow key={event.id}>
                      <TableCell className="px-6 py-4">{event.name}</TableCell>
                      <TableCell className="px-6 py-4">
                        {event.organizer}
                      </TableCell>
                      <TableCell className="px-6 py-4">{event.date}</TableCell>
                      <TableCell className="px-6 py-4">
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            statusColors[event.status].bg
                          } ${statusColors[event.status].text}`}
                        >
                          {statusColors[event.status].label}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {phase && (
                          <span
                            className={`px-3 py-1 rounded-full text-sm ${phaseColors[phase].bg} ${phaseColors[phase].text}`}
                          >
                            {phaseColors[phase].label}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="px-6 py-4 flex gap-2">
                        <Button variant="secondary" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        {event.status === "pending" && (
                          <Button
                            variant="default"
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                        )}
                        <Button variant="destructive" size="sm">
                          <X className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </main>
  );
}
