"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface Admin {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface EditProfileProps {
  open: boolean;
  onClose: () => void;
  admin: Admin;
  onSave: (data: Admin) => void;
}

export default function EditProfile({
  open,
  onClose,
  admin,
  onSave,
}: EditProfileProps) {
  const [form, setForm] = useState<Admin>(admin);

  useEffect(() => {
    setForm(admin);
  }, [admin]);

  const handleChange = (field: keyof Admin, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave(form);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <Label>Họ tên</Label>
            <Input
              value={form.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </div>

          <div>
            <Label>Email</Label>
            <Input
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </div>

          <div>
            <Label>Vai trò</Label>
            <Input
              value={form.role}
              onChange={(e) => handleChange("role", e.target.value)}
            />
          </div>

          <div>
            <Label>Ảnh đại diện (URL)</Label>
            <Input
              value={form.avatar}
              onChange={(e) => handleChange("avatar", e.target.value)}
            />
          </div>

          <Button onClick={handleSave} className="w-full bg-primary">
            Lưu thay đổi
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
