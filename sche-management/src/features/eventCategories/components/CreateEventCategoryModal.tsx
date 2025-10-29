"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEventCategories } from "../hooks/useEventCategories";
import { showToast } from "@/components/ui/Toast";

interface CreateEventCategoryModalProps {
  open: boolean;
  onClose: () => void;
}

export default function CreateEventCategoryModal({
  open,
  onClose,
}: CreateEventCategoryModalProps) {
  const { createCategory, saving } = useEventCategories();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
    }
  }, [open]);

  const handleSave = async () => {
    if (!name.trim()) {
      showToast({ title: "Tên danh mục không được để trống", icon: "warning" });
      return;
    }

    try {
      await createCategory({ name, description });
      showToast({ title: "Tạo danh mục thành công", icon: "success" });
      onClose();
    } catch (err) {
      showToast({ title: "Lỗi khi tạo danh mục", icon: "error" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Tạo mới danh mục sự kiện
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tên danh mục
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên danh mục"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Mô tả
            </label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Nhập mô tả (tùy chọn)"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"
            onClick={handleSave}
            disabled={saving}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
