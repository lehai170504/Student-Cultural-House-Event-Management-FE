"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateOrEditUserProps {
  open: boolean;
  onClose: () => void;
  user?: {
    id?: number;
    name: string;
    email: string;
    role: "student" | "org" | "booth";
    status: "active" | "inactive";
  };
}

export default function CreateOrEditUser({ open, onClose, user }: CreateOrEditUserProps) {
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    role: user?.role || "student",
    status: user?.status || "active",
  });

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
          <DialogTitle>{user ? "Xem / Sửa tài khoản" : "Thêm tài khoản mới"}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Họ tên</Label>
            <Input name="name" value={formData.name} onChange={handleChange} />
          </div>

          <div>
            <Label>Email</Label>
            <Input name="email" value={formData.email} onChange={handleChange} />
          </div>

          <div>
            <Label>Vai trò</Label>
            <Input name="role" value={formData.role} onChange={handleChange} />
          </div>

          <div>
            <Label>Trạng thái</Label>
            <Input name="status" value={formData.status} onChange={handleChange} />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>Hủy</Button>
          <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSubmit}>
            {user ? "Lưu thay đổi" : "Thêm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
