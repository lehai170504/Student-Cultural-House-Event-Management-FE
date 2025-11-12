"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useUniversityUsers } from "../hooks/useStudents";

export default function StudentTable() {
  const {
    list: students,
    loadingList,
    loadAll,
    changeStudentStatus,
  } = useUniversityUsers();

  const [search, setSearch] = useState("");

  const filteredStudents = Array.isArray(students)
    ? students.filter((s) =>
        s.fullName?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  const toggleStatus = async (
    id: string,
    currentStatus: "ACTIVE" | "INACTIVE"
  ) => {
    const newStatus = currentStatus === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    const studentName =
      filteredStudents.find((s) => s.id === id)?.fullName || "Sinh viên";

    const success = await changeStudentStatus(id, newStatus);

    if (success) {
      loadAll();
      const statusText =
        newStatus === "ACTIVE" ? "Đã kích hoạt" : "Đã tạm dừng";
      toast.success(`${studentName} ${statusText}`, {
        description: `Trạng thái của sinh viên đã được cập nhật thành ${newStatus}.`,
      });
    } else {
      toast.error(`Cập nhật trạng thái thất bại`, {
        description: `Không thể thay đổi trạng thái của sinh viên ${studentName}. Vui lòng thử lại.`,
      });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          {/* Header + Search */}
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý sinh viên
              </h1>
              <p className="text-lg text-gray-600">Danh sách sinh viên</p>
            </div>

            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              <Input
                placeholder="Tìm kiếm sinh viên..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[200px]"
              />
              {/* Nút Tạo mới đã được loại bỏ theo yêu cầu */}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="px-6 py-3">#</TableHead>
                  <TableHead className="px-6 py-3">Tên sinh viên</TableHead>
                  <TableHead className="px-6 py-3">Trường</TableHead>
                  <TableHead className="px-6 py-3">Email</TableHead>
                  <TableHead className="px-6 py-3">Số điện thoại</TableHead>
                  <TableHead className="px-6 py-3">Ngày tạo</TableHead>
                  <TableHead className="px-6 py-3">Trạng thái</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingList ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : filteredStudents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-6">
                      Không có sinh viên nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredStudents.map((student, index) => (
                    <TableRow key={student.id}>
                      <TableCell className="px-6 py-4">{index + 1}</TableCell>
                      <TableCell className="px-6 py-4">
                        {student.fullName}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {student.universityName}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {student.email}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {student.phoneNumber}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {new Date(student.createdAt).toLocaleDateString()}
                      </TableCell>

                      <TableCell className="px-6 py-4">
                        <Button
                          size="sm"
                          variant={
                            student.status === "ACTIVE" ? "default" : "outline"
                          }
                          className={
                            student.status === "ACTIVE"
                              ? "bg-green-600 hover:bg-green-700 text-white w-[120px]"
                              : "border-red-500 text-red-600 hover:bg-red-50 w-[120px]"
                          }
                          onClick={() =>
                            toggleStatus(student.id, student.status)
                          }
                        >
                          <span className="flex items-center justify-center gap-1">
                            {student.status === "ACTIVE" ? (
                              <>
                                <CheckCircle className="h-4 w-4" /> Hoạt động
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4" /> Tạm dừng
                              </>
                            )}
                          </span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>
    </main>
  );
}
