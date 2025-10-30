"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Trash2 } from "lucide-react";
import type { User } from "@/features/auth/types/auth";

interface UserTableProps {
  users: User[];
  onView?: (user: User) => void;
  onDelete?: (user: User) => void;
}

export default function UserTable({ users, onView, onDelete }: UserTableProps) {
  const [search, setSearch] = useState("");

  const filteredUsers = Array.isArray(users)
    ? users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

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
    <div>
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Tìm kiếm người dùng..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-[200px]"
        />
      </div>

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
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6">
                  Không có người dùng nào
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="px-6 py-4">{user.username}</TableCell>
                  <TableCell className="px-6 py-4">{user.name}</TableCell>
                  <TableCell className="px-6 py-4">{user.email}</TableCell>
                  <TableCell className="px-6 py-4">{user.phone_number}</TableCell>
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
                    {onView && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => onView(user)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => onDelete(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
