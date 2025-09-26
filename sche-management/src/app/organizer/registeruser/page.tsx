"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Table,
  TableBody,
  TableHeader,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ViewEventRegistrationDetail from "./components/ViewEventRegistrationDetail";

interface Registration {
  id: number;
  studentName: string;
  studentEmail: string;
  eventName: string;
  status: "registered" | "checked-in" | "cancelled";
}

const registrations: Registration[] = [
  {
    id: 1,
    studentName: "Nguyễn Văn A",
    studentEmail: "a@student.edu.vn",
    eventName: "Lễ hội Văn hóa Xuân",
    status: "registered",
  },
  {
    id: 2,
    studentName: "Trần Thị B",
    studentEmail: "b@student.edu.vn",
    eventName: "Workshop Khởi nghiệp",
    status: "checked-in",
  },
  {
    id: 3,
    studentName: "Lê Văn C",
    studentEmail: "c@student.edu.vn",
    eventName: "Hội chợ Ẩm thực",
    status: "cancelled",
  },
];

export default function RegisterUser() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [viewRegistration, setViewRegistration] = useState<
    Registration | undefined
  >(undefined);

  const filteredRegistrations =
    statusFilter === "all"
      ? registrations
      : registrations.filter((r) => r.status === statusFilter);

  const statusLabels: Record<
    Registration["status"],
    { bg: string; text: string; label: string }
  > = {
    registered: {
      bg: "bg-blue-100",
      text: "text-blue-600",
      label: "Đã đăng ký",
    },
    "checked-in": {
      bg: "bg-green-100",
      text: "text-green-600",
      label: "Đã điểm danh",
    },
    cancelled: {
      bg: "bg-red-100",
      text: "text-red-600",
      label: "Đã hủy",
    },
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          {/* Header + Filter */}
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý đăng ký sự kiện
              </h1>
              <p className="text-lg text-gray-600">
                Danh sách sinh viên đăng ký và điểm danh
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
                    <SelectItem value="registered">Đã đăng ký</SelectItem>
                    <SelectItem value="checked-in">Đã điểm danh</SelectItem>
                    <SelectItem value="cancelled">Đã hủy</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="px-6 py-3">Họ tên</TableHead>
                  <TableHead className="px-6 py-3">Email</TableHead>
                  <TableHead className="px-6 py-3">Sự kiện</TableHead>
                  <TableHead className="px-6 py-3">Trạng thái</TableHead>
                  <TableHead className="px-6 py-3">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRegistrations.map((reg) => (
                  <TableRow key={reg.id}>
                    <TableCell className="px-6 py-4">
                      {reg.studentName}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {reg.studentEmail}
                    </TableCell>
                    <TableCell className="px-6 py-4">{reg.eventName}</TableCell>
                    <TableCell className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          statusLabels[reg.status].bg
                        } ${statusLabels[reg.status].text}`}
                      >
                        {statusLabels[reg.status].label}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setViewRegistration(reg)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Popup chi tiết */}
      <ViewEventRegistrationDetail
        open={!!viewRegistration}
        onClose={() => setViewRegistration(undefined)}
        registration={viewRegistration}
      />
    </main>
  );
}
