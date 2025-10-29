"use client";

import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Eye } from "lucide-react";
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
import CreateOrEditUser from "@/components/admin/users/CreateOrEditUser";
import ViewUserDetail from "@/components/admin/users/ViewUserDetail";
import { User } from "@/features/auth/types/auth";

const users: User[] = [
  {
    id: 1,
    username: "nguyenvana",
    name: "Nguyễn Văn A",
    email: "a@student.edu.vn",
    phone_number: "0901234567",
    role: "student",
    status: "active",
  },
  {
    id: 2,
    username: "tranthib",
    name: "Trần Thị B",
    email: "b@org.vn",
    phone_number: "0902345678",
    role: "org",
    status: "inactive",
  },
  {
    id: 3,
    username: "levanc",
    name: "Lê Văn C",
    email: "c@booth.vn",
    phone_number: "0903456789",
    role: "booth",
    status: "active",
  },
];

export default function UserManagement() {
  const [roleFilter, setRoleFilter] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [viewUser, setViewUser] = useState<User | undefined>(undefined);

  const filteredUsers =
    roleFilter === "all" ? users : users.filter((u) => u.role === roleFilter);

  const roleLabels: Record<NonNullable<User["role"]>, string> = {
    student: "Sinh viên",
    org: "Ban tổ chức",
    booth: "Gian hàng",
  };

  const statusLabels = {
    active: { bg: "bg-green-100", text: "text-green-600", label: "Hoạt động" },
    inactive: { bg: "bg-red-100", text: "text-red-600", label: "Khóa" },
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          {/* Header + Filter + Add */}
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý tài khoản người dùng
              </h1>
              <p className="text-lg text-gray-600">
                Bao gồm Sinh viên, Ban tổ chức và Gian hàng
              </p>
            </div>

            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
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

              <Button
                className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"
                onClick={() => {
                  setSelectedUser(undefined);
                  setOpenModal(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Thêm tài khoản
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="text-white">
                  <TableHead className="px-6 py-3">Tên đăng nhập</TableHead>
                  <TableHead className="px-6 py-3">Họ tên</TableHead>
                  <TableHead className="px-6 py-3">Email</TableHead>
                  <TableHead className="px-6 py-3">SĐT</TableHead>
                  <TableHead className="px-6 py-3">Vai trò</TableHead>
                  <TableHead className="px-6 py-3">Trạng thái</TableHead>
                  <TableHead className="px-6 py-3">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="px-6 py-4">{user.username}</TableCell>
                    <TableCell className="px-6 py-4">{user.name}</TableCell>
                    <TableCell className="px-6 py-4">{user.email}</TableCell>
                    <TableCell className="px-6 py-4">
                      {user.phone_number}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {user.role && roleLabels[user.role]}
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      {user.status && (
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            statusLabels[user.status].bg
                          } ${statusLabels[user.status].text}`}
                        >
                          {statusLabels[user.status].label}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="px-6 py-4 flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => setViewUser(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>

                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Popup Thêm/Sửa */}
      <CreateOrEditUser
        open={openModal}
        onClose={() => setOpenModal(false)}
        user={selectedUser}
      />

      {/* Popup Xem chi tiết */}
      <ViewUserDetail
        open={!!viewUser}
        onClose={() => setViewUser(undefined)}
        onEdit={(user) => {
          setSelectedUser(user);
          setOpenModal(true);
        }}
        user={viewUser}
      />
    </main>
  );
}
