"use client";

import { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ProductType } from "../types/product";

interface Props {
  initialValues: {
    title: string;
    description: string;
    type: ProductType;
    unitCost: number;
    totalStock: number;
    isActive: "true" | "false";
    imageUrl: string;
    createdAt: string;
  };
  onSubmit: (
    values: Omit<
      {
        title: string;
        description: string;
        type: ProductType;
        unitCost: number;
        totalStock: number;
        isActive: boolean;
        imageUrl: string;
      },
      "createdAt"
    >
  ) => Promise<void>;
  saving: boolean;
  isEditing: boolean;
}

const validationSchema = Yup.object({
  title: Yup.string().required("Tên sản phẩm là bắt buộc"),
  description: Yup.string(),
  type: Yup.mixed<ProductType>().oneOf(["VOUCHER", "MERCH", "SERVICE", "GIFT"]),
  unitCost: Yup.number().min(1, "Giá phải lớn hơn 0").required(),
  totalStock: Yup.number().min(0, "Tồn kho không được âm").required(),
  imageUrl: Yup.string().url("URL không hợp lệ").nullable(),
  isActive: Yup.string().oneOf(["true", "false"]).required(),
});

export const ProductDetailForm: FC<Props> = ({
  initialValues,
  onSubmit,
  saving,
  isEditing,
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={async (values) => {
        const { createdAt, ...payload } = values;
        await onSubmit({ ...payload, isActive: values.isActive === "true" });
      }}
    >
      {({ values }) => (
        <Form className="space-y-4 mt-4">
          {/* Hình ảnh */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Hình ảnh sản phẩm
            </label>
            {values.imageUrl ? (
              <img
                src={values.imageUrl}
                alt={values.title}
                className="w-48 h-48 rounded-lg object-cover mb-2"
              />
            ) : (
              <p className="text-gray-400 italic">(Không có hình ảnh)</p>
            )}
            {isEditing && (
              <div className="flex flex-col gap-1">
                <Field
                  name="imageUrl"
                  type="text"
                  placeholder="Nhập URL hình ảnh..."
                  className="w-full border rounded-md p-2 text-sm"
                />
                <ErrorMessage
                  name="imageUrl"
                  component="p"
                  className="text-red-500 text-xs"
                />
              </div>
            )}
          </div>

          {/* Tên sản phẩm */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tên sản phẩm
            </label>
            <Field
              name="title"
              as={Input}
              placeholder="Tên sản phẩm"
              readOnly={!isEditing}
              className={isEditing ? "" : "bg-gray-100 cursor-not-allowed"}
            />
            <ErrorMessage
              name="title"
              component="p"
              className="text-red-500 text-xs"
            />
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Mô tả
            </label>
            <Field
              name="description"
              as={Input}
              placeholder="Mô tả"
              readOnly={!isEditing}
              className={isEditing ? "" : "bg-gray-100 cursor-not-allowed"}
            />
            <ErrorMessage
              name="description"
              component="p"
              className="text-red-500 text-xs"
            />
          </div>

          {/* Loại và Giá */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Loại sản phẩm
              </label>
              <Field
                name="type"
                as="select"
                disabled={!isEditing}
                className={`w-full border rounded-md p-2 ${
                  isEditing ? "" : "bg-gray-100 cursor-not-allowed"
                }`}
              >
                <option value="VOUCHER">Voucher</option>
                <option value="MERCH">Merch</option>
                <option value="SERVICE">Service</option>
                <option value="GIFT">Gift</option>
              </Field>
              <ErrorMessage
                name="type"
                component="p"
                className="text-red-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Giá (Coins)
              </label>
              <Field
                name="unitCost"
                type="number"
                as={Input}
                readOnly={!isEditing}
                min={1}
                className={
                  isEditing
                    ? "text-right"
                    : "bg-gray-100 cursor-not-allowed text-right"
                }
              />
              <ErrorMessage
                name="unitCost"
                component="p"
                className="text-red-500 text-xs"
              />
            </div>
          </div>

          {/* Tồn kho và trạng thái */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Tồn kho
              </label>
              <Field
                name="totalStock"
                type="number"
                as={Input}
                readOnly={!isEditing}
                min={1}
                className={
                  isEditing
                    ? "text-right"
                    : "bg-gray-100 cursor-not-allowed text-right"
                }
              />
              <ErrorMessage
                name="totalStock"
                component="p"
                className="text-red-500 text-xs"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Trạng thái
              </label>
              <Field
                name="isActive"
                as="select"
                disabled={!isEditing}
                className={`w-full border rounded-md p-2 ${
                  isEditing
                    ? ""
                    : "bg-gray-100 cursor-not-allowed text-gray-600"
                }`}
              >
                <option value="true">Đang bán</option>
                <option value="false">Ngừng bán</option>
              </Field>
            </div>
          </div>

          {/* Ngày tạo */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Ngày tạo
            </label>
            <Input
              value={values.createdAt}
              readOnly
              className="bg-gray-100 cursor-not-allowed"
            />
          </div>

          {/* Nút submit */}
          {isEditing && (
            <div className="flex justify-end gap-2 mt-4">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                disabled={saving}
              >
                {saving ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
};
