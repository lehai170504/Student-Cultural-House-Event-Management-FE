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

export default function EventsManagement() {
  const [statusFilter, setStatusFilter] = useState("all");

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          {/* Header + Bộ lọc */}
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            {/* Cột trái */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý sự kiện
              </h1>
              <p className="text-lg text-gray-600">
                Admin duyệt các sự kiện được tạo bởi Ban tổ chức
              </p>
            </div>

            {/* Cột phải */}
            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              {/* Bộ lọc */}
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
          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full text-left text-gray-700">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3">Tên sự kiện</th>
                  <th className="px-6 py-3">Ban tổ chức</th>
                  <th className="px-6 py-3">Ngày diễn ra</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">Ngày hội việc làm 2025</td>
                  <td className="px-6 py-4">Khoa CNTT</td>
                  <td className="px-6 py-4">12/11/2025</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-600 rounded-full text-sm">
                      Chờ duyệt
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button variant="secondary" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <Check className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>

                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">Lễ hội văn hóa sinh viên</td>
                  <td className="px-6 py-4">Phòng Công tác SV</td>
                  <td className="px-6 py-4">05/10/2025</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                      Đã duyệt
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button variant="secondary" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="destructive" size="sm">
                      <X className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </main>
  );
}
