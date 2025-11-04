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
import { useProducts } from "../hooks/useProducts";

interface ViewDetailProductProps {
  productId: number | null;
  open: boolean;
  onClose: () => void;
}

export default function ViewDetailProduct({
  productId,
  open,
  onClose,
}: ViewDetailProductProps) {
  const { detail, loadingDetail, loadDetail, resetProductDetail } =
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

  // 🔹 Khi modal mở => fetch chi tiết sản phẩm
  useEffect(() => {
    if (open && productId) {
      resetProductDetail();
      loadDetail(productId);
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
    } else {
      setFormData({
        title: "",
        description: "",
        type: "",
        unitCost: 0,
        totalStock: 0,
        isActive: false,
        imageUrl: "",
        createdAt: "",
      });
    }
  }, [detail, productId]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Chi tiết sản phẩm
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
            {/* Hình ảnh sản phẩm */}
            {formData.imageUrl ? (
              <div className="flex justify-center">
                <Image
                  src={formData.imageUrl}
                  alt={formData.title}
                  width={200}
                  height={200}
                  className="rounded-lg shadow-sm object-cover"
                  unoptimized
                />
              </div>
            ) : (
              <p className="text-center text-gray-400 italic">
                (Không có hình ảnh)
              </p>
            )}

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tên sản phẩm
              </label>
              <Input
                value={formData.title}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Mô tả
              </label>
              <Input
                value={formData.description}
                readOnly
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Loại sản phẩm
                </label>
                <Input
                  value={formData.type}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Giá (Coins)
                </label>
                <Input
                  value={formData.unitCost.toLocaleString()}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed text-right"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Tồn kho
                </label>
                <Input
                  value={formData.totalStock}
                  readOnly
                  className="bg-gray-100 cursor-not-allowed text-right"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-medium mb-1">
                  Trạng thái
                </label>
                <Input
                  value={formData.isActive ? "Đang bán" : "Ngừng bán"}
                  readOnly
                  className={`bg-gray-100 cursor-not-allowed font-semibold ${
                    formData.isActive ? "text-green-600" : "text-gray-500"
                  }`}
                />
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

        <DialogFooter className="mt-6 flex justify-end">
          <Button variant="secondary" onClick={onClose}>
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
