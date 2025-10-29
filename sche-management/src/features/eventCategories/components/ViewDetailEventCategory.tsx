"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEventCategories } from "../hooks/useEventCategories";

interface ViewDetailEventCategoryProps {
  categoryId: number;
  onClose: () => void;
}

export default function ViewDetailEventCategory({
  categoryId,
  onClose,
}: ViewDetailEventCategoryProps) {
  const { detail, loadingDetail, updateCategory, resetCategoryDetail } =
    useEventCategories();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Load chi tiết khi categoryId thay đổi
  useEffect(() => {
    if (categoryId) {
      resetCategoryDetail(); // xóa detail cũ
      setIsEditing(false);
    }
  }, [categoryId, resetCategoryDetail]);

  // Cập nhật form khi detail load xong
  useEffect(() => {
    if (detail && detail.id === categoryId) {
      setName(detail.name);
      setDescription(detail.description);
    }
  }, [detail, categoryId]);

  const handleSave = async () => {
    if (!detail) return;
    await updateCategory(detail.id, { name, description });
    setIsEditing(false);
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Chi tiết danh mục
          </DialogTitle>
        </DialogHeader>

        {loadingDetail || !detail ? (
          <p className="text-center py-10">Đang tải chi tiết...</p>
        ) : (
          <div className="space-y-4 mt-2">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tên danh mục
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mô tả
              </label>
              <Input
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={!isEditing}
              />
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Hủy
              </Button>
              <Button variant="default" onClick={handleSave}>
                Lưu
              </Button>
            </>
          ) : (
            <Button variant="default" onClick={() => setIsEditing(true)}>
              Chỉnh sửa
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
