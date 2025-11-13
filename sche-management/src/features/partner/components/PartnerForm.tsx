// src/features/partner/components/PartnerForm.tsx
"use client";

import { FC } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { CreatePartner } from "@/features/partner/types/partner";

// ===================================================
// Yup Validation Schema
// ===================================================
const validationSchema = Yup.object({
  username: Yup.string()
    .trim()
    .required("Tên đăng nhập (Username) là bắt buộc"),
  name: Yup.string().trim().required("Tên đối tác là bắt buộc"),
  organizationType: Yup.string().trim().nullable(),
  contactEmail: Yup.string()
    .trim()
    .email("Email không hợp lệ")
    .required("Email liên hệ là bắt buộc"),
  contactPhone: Yup.string().trim().nullable(),
});

// ===================================================
// Prop Types
// ===================================================
interface Props {
  initialValues: CreatePartner;
  onSubmit: (values: CreatePartner) => Promise<void>;
  saving: boolean;
}

// ===================================================
// Form Component
// ===================================================
export const PartnerForm: FC<Props> = ({ initialValues, onSubmit, saving }) => {
  const handleFormikSubmit = async (
    values: CreatePartner,
    actions: FormikHelpers<CreatePartner>
  ) => {
    await onSubmit(values);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormikSubmit}
      enableReinitialize={true} // Đảm bảo reset khi modal đóng/mở
    >
      {({ isValid, dirty, isSubmitting }) => (
        <Form className="space-y-4 mt-4">
          {/* Username */}
          <div>
            <Label htmlFor="username">
              Username <span className="text-red-500">*</span>
            </Label>
            <Field
              id="username"
              name="username"
              as={Input}
              placeholder="Nhập username"
            />
            <ErrorMessage
              name="username"
              component="p"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Tên đối tác */}
          <div>
            <Label htmlFor="name">
              Tên đối tác <span className="text-red-500">*</span>
            </Label>
            <Field
              id="name"
              name="name"
              as={Input}
              placeholder="Nhập tên đối tác"
            />
            <ErrorMessage
              name="name"
              component="p"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Loại tổ chức */}
          <div>
            <Label htmlFor="organizationType">Loại tổ chức</Label>
            <Field
              id="organizationType"
              name="organizationType"
              as={Input}
              placeholder="Nhập loại tổ chức"
            />
          </div>

          {/* Email */}
          <div>
            <Label htmlFor="contactEmail">
              Email <span className="text-red-500">*</span>
            </Label>
            <Field
              id="contactEmail"
              name="contactEmail"
              type="email"
              as={Input}
              placeholder="Nhập email liên hệ"
            />
            <ErrorMessage
              name="contactEmail"
              component="p"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Số điện thoại */}
          <div>
            <Label htmlFor="contactPhone">Số điện thoại</Label>
            <Field
              id="contactPhone"
              name="contactPhone"
              type="tel"
              as={Input}
              placeholder="Nhập số điện thoại liên hệ"
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              variant="secondary"
              onClick={() => {
                /* Logic Hủy ở Modal Wrapper */
              }}
              type="button"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"
              disabled={isSubmitting || saving || !isValid || !dirty}
            >
              {isSubmitting || saving ? "Đang Lưu..." : "Lưu"}
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  );
};
