"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface CreateNotificationProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: {
    title: string;
    target: string;
    content: string;
    createdAt: string;
  }) => void;
}

export default function CreateNotification({
  open,
  onClose,
  onCreate,
}: CreateNotificationProps) {
  const [formData, setFormData] = useState({
    title: "",
    target: "",
    content: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    const newNotification = {
      ...formData,
      createdAt: new Date().toISOString(),
    };
    onCreate(newNotification); // Trả về cho NotificationsPage xử lý
    setFormData({ title: "", target: "", content: "" }); // reset form
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Tạo thông báo mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Tiêu đề</Label>
            <Input
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Nhập tiêu đề thông báo"
            />
          </div>

          <div>
            <Label>Người nhận</Label>
            <Input
              name="target"
              value={formData.target}
              onChange={handleChange}
              placeholder="Ví dụ: Tất cả sinh viên"
            />
          </div>

          <div>
            <Label>Nội dung</Label>
            <Textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              placeholder="Nhập nội dung thông báo..."
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600"
            onClick={handleSubmit}
          >
            Tạo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
