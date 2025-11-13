"use client";

import { FC, useRef } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CreateProductData, ProductType } from "../types/product";

interface FormSubmitValues {
  productData: CreateProductData;
  imageFile: File | null;
}

interface Props {
  initialValues: CreateProductData;
  onSubmit: (values: FormSubmitValues) => Promise<void>;
  saving: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Tên sản phẩm là bắt buộc"),
  description: Yup.string().nullable(),
  unitCost: Yup.number()
    .min(1, "Giá phải lớn hơn 0")
    .required("Giá sản phẩm là bắt buộc"),
  totalStock: Yup.number()
    .min(0, "Tồn kho không được âm")
    .required("Tồn kho là bắt buộc"),
  type: Yup.mixed<ProductType>().oneOf(["VOUCHER", "MERCH", "SERVICE", "GIFT"]),
});

export const ProductForm: FC<Props> = ({ initialValues, onSubmit, saving }) => {
  const fileRef = useRef<File | null>(null);

  const handleFormikSubmit = async (
    values: CreateProductData,
    actions: FormikHelpers<CreateProductData>
  ) => {
    const submitData: FormSubmitValues = {
      productData: values,
      imageFile: fileRef.current,
    };

    await onSubmit(submitData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files
      ? event.currentTarget.files[0]
      : null;
    fileRef.current = file;
  };

  const formikInitialValues: CreateProductData = {
    ...initialValues,
  };

  return (
    <Formik
      initialValues={formikInitialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormikSubmit}
    >
      {() => (
        <Form className="space-y-4">
          {/* Tiêu đề */}
          <div>
            <Label htmlFor="title">Tên sản phẩm</Label>
            <Field
              id="title"
              name="title"
              as={Input}
              placeholder="Nhập tên sản phẩm"
            />
            <ErrorMessage
              name="title"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Mô tả */}
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Field
              id="description"
              name="description"
              as={Input}
              placeholder="Nhập mô tả sản phẩm"
            />
            <ErrorMessage
              name="description"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Loại sản phẩm */}
          <div>
            <Label htmlFor="type">Loại sản phẩm</Label>
            <Field
              id="type"
              name="type"
              as="select"
              className="w-full border rounded-md px-3 py-2 text-sm"
            >
              <option value="VOUCHER">Voucher</option>
              <option value="MERCH">Merch</option>
              <option value="SERVICE">Service</option>
              <option value="GIFT">Gift</option>
            </Field>
            <ErrorMessage
              name="type"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          <div className="flex gap-4">
            {/* Giá */}
            <div className="flex-1">
              <Label htmlFor="unitCost">Giá (Coins)</Label>
              <Field
                id="unitCost"
                name="unitCost"
                type="number"
                min={1}
                as={Input}
                placeholder="Giá"
              />
              <ErrorMessage
                name="unitCost"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>

            {/* Tồn kho */}
            <div className="flex-1">
              <Label htmlFor="totalStock">Tồn kho</Label>
              <Field
                id="totalStock"
                name="totalStock"
                type="number"
                min={0}
                as={Input}
                placeholder="Số lượng"
              />
              <ErrorMessage
                name="totalStock"
                component="p"
                className="text-red-500 text-sm"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="imageFile">Ảnh sản phẩm</Label>
            <Input
              id="imageFile"
              name="imageFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={saving}
            >
              {saving ? "Đang tạo..." : "Tạo mới"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
