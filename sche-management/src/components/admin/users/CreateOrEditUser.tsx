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

import type { AuthResponse } from "@/features/auth/types/auth";

interface CreateOrEditUserProps {
  open: boolean;
  onClose: () => void;
  user?: AuthResponse;
}

interface FormData {
  fullName: string;
  email: string;
}

export default function CreateOrEditUser({
  open,
  onClose,
  user,
}: CreateOrEditUserProps) {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.data.fullName || "",
        email: user.data.email || "",
      });
    } else {
      setFormData({ fullName: "", email: "" });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            <Label htmlFor="fullName">Họ tên</Label>
            <Input
              id="fullName"
              name="fullName"
              value={formData.fullName}
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
