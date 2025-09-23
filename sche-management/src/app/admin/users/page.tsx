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
import { Pencil, Trash2, Plus } from "lucide-react";

export default function UserManagement() {
  const [roleFilter, setRoleFilter] = useState("all");

  return (
    <main className="min-h-screen bg-gray-50">
      {/* --- Gộp Hero + Table thành 1 section --- */}
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          {/* Header + Bộ lọc + Thêm tài khoản */}
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            {/* Cột trái */}
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý tài khoản người dùng
              </h1>
              <p className="text-lg text-gray-600">
                Bao gồm Sinh viên, Ban tổ chức và Gian hàng
              </p>
            </div>

            {/* Cột phải */}
            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              {/* Bộ lọc */}
              <div className="flex items-center gap-3">
                <Label htmlFor="role" className="text-gray-700 font-medium">
                  Lọc theo vai trò:
                </Label>
                <Select
                  value={roleFilter}
                  onValueChange={(val) => setRoleFilter(val)}
                >
                  <SelectTrigger id="role" className="w-[180px]">
                    <SelectValue placeholder="Chọn vai trò" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả</SelectItem>
                    <SelectItem value="student">Sinh viên</SelectItem>
                    <SelectItem value="org">Ban tổ chức</SelectItem>
                    <SelectItem value="booth">Gian hàng</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Nút thêm */}
              <Button
                variant="default"
                className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Thêm tài khoản
              </Button>
            </div>
          </div>

          {/* Bảng */}
          <div className="overflow-x-auto rounded-xl border">
            <table className="min-w-full text-left text-gray-700">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-3">Họ tên</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Vai trò</th>
                  <th className="px-6 py-3">Trạng thái</th>
                  <th className="px-6 py-3">Hành động</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">Nguyễn Văn A</td>
                  <td className="px-6 py-4">a@student.edu.vn</td>
                  <td className="px-6 py-4">Sinh viên</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm">
                      Hoạt động
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
                <tr className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4">Trần Thị B</td>
                  <td className="px-6 py-4">b@org.vn</td>
                  <td className="px-6 py-4">Ban tổ chức</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm">
                      Khóa
                    </span>
                  </td>
                  <td className="px-6 py-4 flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="flex items-center gap-1"
                    >
                      <Trash2 className="h-4 w-4" />
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
