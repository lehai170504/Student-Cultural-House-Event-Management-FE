// src/features/partner/components/CreateEventCategoryModal.tsx
"use client";

import { FC } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotateCw, LayoutList } from "lucide-react";
import { toast } from "sonner";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useEventCategories } from "../hooks/useEventCategories";
import { Label } from "@/components/ui/label";
import { CreateEventCategory } from "../types/eventCategories";

interface CreateCategoryModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// ===================================================
// Yup Validation Schema
// ===================================================
const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .required("Tên danh mục là bắt buộc")
    .max(100, "Tên danh mục không quá 100 ký tự"),
  description: Yup.string()
    .trim()
    .max(255, "Mô tả không quá 255 ký tự")
    .nullable(),
});

// ===================================================
// Component chính
// ===================================================
export default function CreateEventCategoryModal({
  open,
  onClose,
  onSuccess,
}: CreateCategoryModalProps) {
  const { createCategory, saving } = useEventCategories();

  const initialValues: CreateEventCategory = {
    name: "",
    description: "",
  };

  const handleSubmit = async (values: CreateEventCategory) => {
    try {
      // Gọi API tạo mới
      await createCategory(values).unwrap();

      toast.success("Tạo danh mục sự kiện thành công!");
      onSuccess(); // Đóng modal và reload list
    } catch (error) {
      console.error(error);
      toast.error("Tạo danh mục thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <LayoutList className="h-5 w-5" />
            Tạo Danh Mục Sự Kiện Mới
          </DialogTitle>
        </DialogHeader>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid, dirty }) => (
            <Form className="space-y-4">
              {/* Tên danh mục */}
              <div>
                <Label htmlFor="name">
                  Tên danh mục <span className="text-red-500">*</span>
                </Label>
                <Field
                  id="name"
                  name="name"
                  as={Input}
                  placeholder="Ví dụ: Công nghệ, Văn hóa..."
                />
                <ErrorMessage
                  name="name"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              {/* Mô tả */}
              <div>
                <Label htmlFor="description">Mô tả (Tùy chọn)</Label>
                <Field
                  id="description"
                  name="description"
                  as={Input}
                  placeholder="Mô tả ngắn về danh mục"
                />
                <ErrorMessage
                  name="description"
                  component="p"
                  className="text-red-500 text-sm mt-1"
                />
              </div>

              <DialogFooter className="pt-4 flex justify-end gap-2">
                <Button
                  variant="secondary"
                  onClick={onClose}
                  type="button"
                  disabled={saving}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || saving || !isValid || !dirty}
                  className="bg-green-600 hover:bg-green-700 transition-colors"
                >
                  {saving || isSubmitting ? (
                    <RotateCw className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Tạo danh mục"
                  )}
                </Button>
              </DialogFooter>
            </Form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
