"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/types/auth";

interface CreateOrEditUserProps {
  open: boolean;
  onClose: () => void;
  user?: User;
}

export default function CreateOrEditUser({
  open,
  onClose,
  user,
}: CreateOrEditUserProps) {
  const [formData, setFormData] = useState<User>({
    username: "",
    name: "",
    email: "",
    phone_number: "",
    role: "student",
    status: "active",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        name: user.name || "",
        email: user.email || "",
        phone_number: user.phone_number || "",
        role: user.role || "student",
        status: user.status || "active",
      });
    } else {
      setFormData({
        username: "",
        name: "",
        email: "",
        phone_number: "",
        role: "student",
        status: "active",
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (field: keyof User, value: string) => {
    setFormData({ ...formData, [field]: value as any });
  };

  const handleSubmit = () => {
    if (user) {
      console.log("Cập nhật user:", formData);
    } else {
      console.log("Thêm user:", formData);
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {user ? "Chỉnh sửa tài khoản" : "Thêm tài khoản mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label htmlFor="username">Tên đăng nhập</Label>
            <Input
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Nhập tên đăng nhập"
            />
          </div>

          <div>
            <Label htmlFor="name">Họ tên</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Nhập họ tên"
            />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Nhập email"
            />
          </div>

          <div>
            <Label htmlFor="phone_number">Số điện thoại</Label>
            <Input
              id="phone_number"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="Nhập số điện thoại"
            />
          </div>

          <div>
            <Label>Vai trò</Label>
            <Select
              value={formData.role}
              onValueChange={(val) => handleSelectChange("role", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn vai trò" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Sinh viên</SelectItem>
                <SelectItem value="org">Ban tổ chức</SelectItem>
                <SelectItem value="booth">Gian hàng</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Trạng thái</Label>
            <Select
              value={formData.status}
              onValueChange={(val) => handleSelectChange("status", val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Hoạt động</SelectItem>
                <SelectItem value="inactive">Khóa</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 text-white"
            onClick={handleSubmit}
          >
            {user ? "Lưu thay đổi" : "Thêm tài khoản"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
