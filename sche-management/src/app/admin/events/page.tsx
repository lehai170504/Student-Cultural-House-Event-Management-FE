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
  TableFooter,
  TableCell,
  TableCaption,
  TableHead,
  TableRow,
} from "@/components/ui/table";

interface EventItem {
  id: number;
  name: string;
  organizer: string;
  date: string;
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
    status: "rejected",
  },
];

export default function EventsManagement() {
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredEvents =
    statusFilter === "all"
      ? events
      : events.filter((e) => e.status === statusFilter);

  const statusColors: Record<
    EventItem["status"],
    { bg: string; text: string; label: string }
  > = {
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
                Admin duyệt các sự kiện được tạo bởi Ban tổ chức
              </p>
            </div>

            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              <div className="flex items-center gap-3">
                <Label htmlFor="status" className="text-gray-700 font-medium">
                  Lọc theo trạng thái:
                </Label>
                <Select
                  value={statusFilter}
                  onValueChange={(val) => setStatusFilter(val)}
                >
                  <SelectTrigger id="status" className="w-[180px]">
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
            </div>
          </div>

          {/* Bảng sự kiện */}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className=" text-white">
                  <TableHead className="px-6 py-3">Tên sự kiện</TableHead>
                  <TableHead className="px-6 py-3">Ban tổ chức</TableHead>
                  <TableHead className="px-6 py-3">Ngày diễn ra</TableHead>
                  <TableHead className="px-6 py-3">Trạng thái</TableHead>
                  <TableHead className="px-6 py-3">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell className="px-6 py-4">{event.name}</TableCell>
                    <TableCell className="px-6 py-4">
                      {event.organizer}
                    </TableCell>
                    <TableCell className="px-6 py-4">{event.date}</TableCell>
                    <TableCell className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${statusColors[event.status].bg} ${statusColors[event.status].text}`}
                      >
                        {statusColors[event.status].label}
                      </span>
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
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </main>
  );
}
