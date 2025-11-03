"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useProducts } from "../hooks/useProducts";
import type { CreateProduct, ProductType } from "../types/product";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateProductModal({ open, onClose }: Props) {
  const { createNewProduct, saving } = useProducts();

  const [form, setForm] = useState<CreateProduct>({
    title: "",
    description: "",
    unitCost: 0,
    totalStock: 0,
    type: "GIFT",
    imageUrl: "",
  });

  const handleChange = (key: keyof CreateProduct, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title || form.unitCost <= 0 || form.totalStock < 0) return;

    const success = await createNewProduct(form);
    if (success) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 🔹 Tiêu đề */}
          <div>
            <Label htmlFor="title">Tên sản phẩm</Label>
            <Input
              id="title"
              placeholder="Nhập tên sản phẩm"
              value={form.title}
              onChange={(e) => handleChange("title", e.target.value)}
            />
          </div>

          {/* 🔹 Mô tả */}
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Input
              id="description"
              placeholder="Nhập mô tả sản phẩm"
              value={form.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          {/* 🔹 Loại sản phẩm */}
          <div>
            <Label htmlFor="type">Loại sản phẩm</Label>
            <select
              id="type"
              value={form.type}
              onChange={(e) =>
                handleChange("type", e.target.value as ProductType)
              }
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="VOUCHER">Voucher</option>
              <option value="MERCH">Merch</option>
              <option value="SERVICE">Service</option>
              <option value="GIFT">Gift</option>
            </select>
          </div>

          {/* 🔹 Giá */}
          <div>
            <Label htmlFor="unitCost">Giá (Coins)</Label>
            <Input
              id="unitCost"
              type="number"
              placeholder="Nhập giá sản phẩm"
              value={form.unitCost}
              onChange={(e) => handleChange("unitCost", Number(e.target.value))}
            />
          </div>

          {/* 🔹 Tồn kho */}
          <div>
            <Label htmlFor="totalStock">Tồn kho</Label>
            <Input
              id="totalStock"
              type="number"
              placeholder="Nhập số lượng tồn kho"
              value={form.totalStock}
              onChange={(e) =>
                handleChange("totalStock", Number(e.target.value))
              }
            />
          </div>

          {/* 🔹 Ảnh minh họa (nếu có) */}
          <div>
            <Label htmlFor="imageUrl">Ảnh (URL)</Label>
            <Input
              id="imageUrl"
              placeholder="https://..."
              value={form.imageUrl || ""}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
            />
          </div>

          {/* 🔹 Nút hành động */}
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={onClose}>
              Hủy
            </Button>
            <Button
              className="bg-blue-600 text-white hover:bg-blue-700"
              onClick={handleSubmit}
              disabled={saving}
            >
              {saving ? "Đang tạo..." : "Tạo mới"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
