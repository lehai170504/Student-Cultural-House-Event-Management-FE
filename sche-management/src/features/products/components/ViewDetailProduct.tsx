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
import Image from "next/image";
// @ts-ignore
import { toast } from "sonner";
import { useProducts } from "../hooks/useProducts";
import { ProductType } from "../types/product";

interface ViewDetailProductProps {
  productId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function ViewDetailProduct({
  productId,
  open,
  onClose,
}: ViewDetailProductProps) {
  const { detail, loadingDetail, loadDetail, resetProductDetail, editProduct } =
    useProducts();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "",
    unitCost: 0,
    totalStock: 0,
    isActive: false,
    imageUrl: "",
    createdAt: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // 🔹 Khi modal mở => fetch chi tiết sản phẩm
  useEffect(() => {
    if (open && productId) {
      resetProductDetail();
      loadDetail(productId);
      setIsEditing(false);
    }
  }, [open, productId, resetProductDetail, loadDetail]);

  // 🔹 Khi detail thay đổi => cập nhật local state
  useEffect(() => {
    if (detail && detail.id === productId) {
      setFormData({
        title: detail.title,
        description: detail.description,
        type: detail.type,
        unitCost: detail.unitCost,
        totalStock: detail.totalStock,
        isActive: detail.isActive,
        imageUrl: detail.imageUrl ?? "",
        createdAt: new Date(detail.createdAt).toLocaleString("vi-VN"),
      });
    }
  }, [detail, productId]);

  // 🔹 Hàm cập nhật sản phẩm
  const handleSave = async () => {
    if (!productId) return;
    setIsSaving(true);

    const payload = {
      title: formData.title,
      description: formData.description,
      type: formData.type as ProductType,
      unitCost: formData.unitCost,
      totalStock: formData.totalStock,
      isActive: formData.isActive,
      imageUrl: formData.imageUrl,
    };

    const success = await editProduct(productId, payload);
    setIsSaving(false);

    if (success) {
      toast.success("Cập nhật sản phẩm thành công!", {
        description: `Sản phẩm ${formData.title} đã được cập nhật.`,
      });
      loadDetail(productId);
      setIsEditing(false);
    } else {
      toast.error("Cập nhật thất bại", {
        description: "Vui lòng thử lại.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            {isEditing ? "Chỉnh sửa sản phẩm" : "Chi tiết sản phẩm"}
          </DialogTitle>
        </DialogHeader>

        {loadingDetail ? (
          <p className="text-center py-10">Đang tải chi tiết...</p>
        ) : !detail ? (
          <p className="text-center py-10 text-red-500">
            Không tìm thấy sản phẩm
          </p>
        ) : (
          <div className="space-y-4 mt-4">
            <label className="block text-gray-700 font-medium mb-1">
              Hình ảnh sản phẩm
            </label>
            <div className="flex flex-col items-center gap-3">
              {formData.imageUrl ? (
                <Image
                  src={formData.imageUrl}
                  alt={formData.title}
                  width={200}
                  height={200}
                  className="rounded-lg shadow-sm object-cover"
                  unoptimized
                />
              ) : (
                <p className="text-center text-gray-400 italic">
                  (Không có hình ảnh)
                </p>
              )}

              {isEditing && (
                <div className="flex flex-col items-center gap-2 w-full">
                  <input
                    type="text"
                    value={formData.imageUrl || ""}
                    placeholder="Nhập URL hình ảnh..."
                    onChange={(e) =>
                      setFormData({ ...formData, imageUrl: e.target.value })
                    }
                    className="w-full text-sm text-gray-700 border border-gray-300 rounded-md p-2"
                  />
                  <p className="text-xs text-gray-500">
                    Nhập đường dẫn URL của ảnh (ví dụ:
                    https://example.com/image.jpg)
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tên sản phẩm
              </label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  isEditing &&
                  setFormData({ ...formData, title: e.target.value })
                }
                readOnly={!isEditing}
                className={isEditing ? "" : "bg-gray-100 cursor-not-allowed"}
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mô tả
              </label>
              <Input
                value={formData.description}
                onChange={(e) =>
                  isEditing &&
                  setFormData({ ...formData, description: e.target.value })
                }
                readOnly={!isEditing}
                className={isEditing ? "" : "bg-gray-100 cursor-not-allowed"}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Loại sản phẩm
                </label>
                <Input
                  value={formData.type}
                  onChange={(e) =>
                    isEditing &&
                    setFormData({ ...formData, type: e.target.value })
                  }
                  readOnly={!isEditing}
                  className={isEditing ? "" : "bg-gray-100 cursor-not-allowed"}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Giá (Coins)
                </label>
                <Input
                  type="number"
                  value={formData.unitCost}
                  onChange={(e) =>
                    isEditing &&
                    setFormData({
                      ...formData,
                      unitCost: Number(e.target.value),
                    })
                  }
                  readOnly={!isEditing}
                  className={`${
                    isEditing
                      ? "text-right"
                      : "bg-gray-100 cursor-not-allowed text-right"
                  }`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Tồn kho
                </label>
                <Input
                  type="number"
                  value={formData.totalStock}
                  onChange={(e) =>
                    isEditing &&
                    setFormData({
                      ...formData,
                      totalStock: Number(e.target.value),
                    })
                  }
                  readOnly={!isEditing}
                  className={`${
                    isEditing
                      ? "text-right"
                      : "bg-gray-100 cursor-not-allowed text-right"
                  }`}
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Trạng thái
                </label>
                <select
                  disabled={!isEditing}
                  value={formData.isActive ? "true" : "false"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value === "true",
                    })
                  }
                  className={`w-full border rounded-md p-2 ${
                    isEditing
                      ? ""
                      : "bg-gray-100 cursor-not-allowed text-gray-600"
                  }`}
                >
                  <option value="true">Đang bán</option>
                  <option value="false">Ngừng bán</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Ngày tạo
              </label>
              <Input
                value={formData.createdAt}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        )}

        <DialogFooter className="mt-6 flex justify-end gap-2">
          {isEditing ? (
            <>
              <Button
                variant="secondary"
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
              >
                Hủy
              </Button>
              <Button
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={handleSave}
                disabled={isSaving}
              >
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="secondary"
                onClick={onClose}
                className="min-w-[100px]"
              >
                Đóng
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => setIsEditing(true)}
              >
                Chỉnh sửa
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
