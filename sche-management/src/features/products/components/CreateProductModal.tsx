"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";
import { useProducts } from "../hooks/useProducts";
import type { CreateProduct } from "../types/product";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CreateProductModal({ open, onClose }: Props) {
  const { createNewProduct, saving } = useProducts();

  const initialValues: CreateProduct = {
    title: "",
    description: "",
    unitCost: 0,
    totalStock: 0,
    type: "GIFT",
    imageUrl: "",
  };

  const handleSubmit = async (values: CreateProduct) => {
    const success = await createNewProduct(values);
    if (success) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Thêm sản phẩm mới</DialogTitle>
        </DialogHeader>

        <ProductForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          saving={saving}
        />
      </DialogContent>
    </Dialog>
  );
}
