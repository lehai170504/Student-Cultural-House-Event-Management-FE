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

interface ViewDetailEventCategoryProps {
  categoryId: number | null; 
  open: boolean;
  onClose: () => void;
}

export default function ViewDetailEventCategory({
  categoryId,
  open,
  onClose,
}: ViewDetailEventCategoryProps) {
  const { detail, loadingDetail, updateCategory, resetCategoryDetail, loadDetail } =
    useEventCategories();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Load chi tiết khi categoryId thay đổi
  useEffect(() => {
    if (open && categoryId) {
      resetCategoryDetail(); // xóa detail cũ
      setIsEditing(false);
      loadDetail(categoryId);
    }
  }, [categoryId, open, resetCategoryDetail, loadDetail]);

  
  useEffect(() => {
    if (detail && detail.id === categoryId) {
      setName(detail.name);
      setDescription(detail.description);
    }
  }, [detail, categoryId]);

  const handleSave = async () => {
    if (!detail) return;

    if (!name.trim()) {
      showToast({ title: "Tên danh mục không được để trống", icon: "warning" });
      return;
    }

    try {
      await updateCategory(detail.id, { name, description });
      showToast({ title: "Cập nhật danh mục thành công", icon: "success" });
      setIsEditing(false);
    } catch {
      showToast({ title: "Lỗi khi cập nhật danh mục", icon: "error" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Chi tiết danh mục
          </DialogTitle>
        </DialogHeader>

        {loadingDetail || !detail ? (
          <p className="text-center py-10">Đang tải chi tiết...</p>
        ) : (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tên danh mục
              </label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
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
                disabled={!isEditing}
                placeholder="Nhập mô tả (tùy chọn)"
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
              <Button
                className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"
                onClick={handleSave}
                disabled={loadingDetail}
              >
                Lưu
              </Button>
            </>
          ) : (
            <Button
              className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"
              onClick={() => setIsEditing(true)}
            >
              Chỉnh sửa
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
