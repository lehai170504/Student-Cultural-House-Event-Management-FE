"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";
import { useProducts } from "../hooks/useProducts";
import { toast } from "sonner";
import type { CreateProductData, CreateProductInput } from "../types/product";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormSubmitValues {
  productData: CreateProductData;
  imageFile: File | null;
}

export default function CreateProductModal({ open, onClose }: Props) {
  const { createNewProduct, saving } = useProducts();

  const initialValues: CreateProductData = {
    title: "",
    description: "",
    unitCost: 0,
    totalStock: 0,
    type: "GIFT",
  };

  const handleSubmit = async (values: FormSubmitValues) => {
    const input: CreateProductInput = {
      productData: values.productData,
      imageFile: values.imageFile,
    };

    const success = await createNewProduct(input);

    if (success) {
      toast.success("Tạo sản phẩm thành công!", {
        description: `Sản phẩm ${values.productData.title} đã được tạo.`,
      });
      onClose();
    } else {
      toast.error("Tạo sản phẩm thất bại", {
        description: "Vui lòng thử lại.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full rounded-xl p-6">
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
