"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEventCategories } from "../hooks/useEventCategories";

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
  const { detail, loadingDetail, loadDetail, resetCategoryDetail } =
    useEventCategories();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  // Load chi tiết khi categoryId thay đổi
  useEffect(() => {
    if (open && categoryId) {
      resetCategoryDetail(); // xóa detail cũ
      loadDetail(categoryId);
    }
  }, [categoryId, open, resetCategoryDetail, loadDetail]);

  // Khi detail load xong
  useEffect(() => {
    if (detail && detail.id === categoryId) {
      setName(detail.name);
      setDescription(detail.description);
    } else {
      setName("");
      setDescription("");
    }
  }, [detail, categoryId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Chi tiết danh mục
          </DialogTitle>
        </DialogHeader>

        {loadingDetail ? (
          <p className="text-center py-10">Đang tải chi tiết...</p>
        ) : !detail ? (
          <p className="text-center py-10 text-red-500">
            Không tìm thấy chi tiết danh mục
          </p>
        ) : (
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tên danh mục
              </label>
              <Input
                value={name}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mô tả
              </label>
              <Input
                value={description}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
