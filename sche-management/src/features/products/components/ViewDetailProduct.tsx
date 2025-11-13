"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useProducts } from "../hooks/useProducts";
import { ProductDetailForm } from "./ProductDetailForm";

interface Props {
  productId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function ViewDetailProduct({ productId, open, onClose }: Props) {
  const { detail, loadingDetail, loadDetail, resetProductDetail, editProduct } =
    useProducts();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open && productId) {
      resetProductDetail();
      loadDetail(productId);
      setIsEditing(false);
    }
  }, [open, productId, resetProductDetail, loadDetail]);

  const handleSubmit = async (values: any) => {
    if (!productId) return;
    setIsSaving(true);
    const success = await editProduct(productId, values);
    setIsSaving(false);

    if (success) {
      toast.success("Cập nhật sản phẩm thành công!", {
        description: `Sản phẩm ${values.title} đã được cập nhật.`,
      });
      loadDetail(productId);
      setIsEditing(false);
    } else {
      toast.error("Cập nhật thất bại", { description: "Vui lòng thử lại." });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle>
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
          <ProductDetailForm
            initialValues={{
              title: detail.title,
              description: detail.description,
              type: detail.type,
              unitCost: detail.unitCost,
              totalStock: detail.totalStock,
              isActive: detail.isActive ? "true" : "false", 
              imageUrl: detail.imageUrl ?? "",
              createdAt: new Date(detail.createdAt).toLocaleString("vi-VN"),
            }}
            onSubmit={handleSubmit}
            saving={isSaving}
            isEditing={isEditing}
          />
        )}

        <DialogFooter className="mt-6 flex justify-end gap-2">
          {!isEditing && detail && (
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
          {isEditing && (
            <Button variant="secondary" onClick={() => setIsEditing(false)}>
              Hủy
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
