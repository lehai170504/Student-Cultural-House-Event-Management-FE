// src/features/partner/components/EventForm.tsx
"use client";

import { FC, useMemo, useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage, FormikHelpers } from "formik";
import * as Yup from "yup";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Giả định các imports này
import type { CreateEvent } from "@/features/events/types/events";
import { EventCategory } from "@/features/eventCategories/types/eventCategories";

// ===================================================
// Helper Functions (Lấy từ ViewDetailEvent & EventForm cũ)
// ===================================================

function toISOStringWithTimezone(date: Date): string {
  // Logic chuyển Date Object sang ISO String có Timezone Offset
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");
  const milliseconds = String(date.getMilliseconds()).padStart(3, "0");
  const offsetMinutes = new Date().getTimezoneOffset();
  const offsetSign = offsetMinutes > 0 ? "-" : "+";
  const absOffset = Math.abs(offsetMinutes);
  const offsetHours = String(Math.floor(absOffset / 60)).padStart(2, "0");
  const offsetMins = String(absOffset % 60).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${offsetHours}:${offsetMins}`;
}

const toLocalDatetimeValue = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const timezoneOffset = date.getTimezoneOffset() * 60000;
  const localISO = new Date(date.getTime() - timezoneOffset)
    .toISOString()
    .slice(0, 16);
  return localISO;
};

function formatLocalTime(localDateTime: string): string {
  const parsed = new Date(localDateTime);
  return Number.isNaN(parsed.getTime())
    ? "Chưa chọn"
    : parsed.toLocaleString("vi-VN");
}

// ===================================================
// Yup Validation Schema (Giữ nguyên)
// ===================================================
const validationSchema = Yup.object({
  title: Yup.string().trim().required("Tiêu đề là bắt buộc"),
  location: Yup.string().trim().required("Địa điểm là bắt buộc"),
  categoryId: Yup.string().required("Danh mục là bắt buộc"),
  startTime: Yup.string()
    .required("Thời gian bắt đầu là bắt buộc")
    .test(
      "is-valid-time",
      "Thời gian không hợp lệ",
      (value) => !!value && !Number.isNaN(new Date(value).getTime())
    )
    .test(
      "is-future-start",
      "Thời gian bắt đầu phải sau thời điểm hiện tại",
      (value) => {
        if (!value) return true;
        const start = new Date(value);
        const now = new Date();
        return start > now;
      }
    ),
  endTime: Yup.string()
    .required("Thời gian kết thúc là bắt buộc")
    .test(  
      "is-valid-time",
      "Thời gian không hợp lệ",
      (value) => !!value && !Number.isNaN(new Date(value).getTime())
    )
    .test(
      "is-after-start",
      "Thời gian kết thúc phải sau thời gian bắt đầu",
      function (endTime) {
        const { startTime } = this.parent;
        if (!startTime || !endTime) return true;
        const start = new Date(startTime);
        const end = new Date(endTime);
        return end > start;
      }
    ),
  pointCostToRegister: Yup.number()
    .required("Phí đăng ký là bắt buộc")
    .min(0, "Phí đăng ký không được là số âm"),
  totalRewardPoints: Yup.number()
    .required("Tổng điểm thưởng là bắt buộc")
    .min(0, "Tổng điểm thưởng không được là số âm"),
  totalBudgetCoin: Yup.number()
    .required("Tổng ngân sách là bắt buộc")
    .min(0, "Ngân sách không được là số âm"),
  description: Yup.string().nullable(),
});

// ===================================================
// Prop Types (Cập nhật để hỗ trợ Update)
// ===================================================

// Tạm thời tạo một Union Type cho Initial Values trong Form
export type EventFormValues = Omit<CreateEvent, "partnerId"> & {
  id?: string; // Tùy chọn cho chế độ Update
  partnerId?: string; // Tùy chọn cho chế độ Update (hoặc giữ lại)
};

interface Props {
  initialValues: EventFormValues;
  onSubmit: (values: EventFormValues) => Promise<void>;
  saving: boolean;
  eventCategories: EventCategory[];
  loadingCategories: boolean;
  onModalClose: () => void;
  isUpdateMode?: boolean; // NEW: Cờ báo hiệu chế độ Update
  isEditable?: boolean; // NEW: Cờ báo hiệu có được chỉnh sửa không (dùng cho Partner)
}

// ===================================================
// Form Component
// ===================================================
export const EventForm: FC<Props> = ({
  initialValues,
  onSubmit,
  saving,
  eventCategories,
  loadingCategories,
  onModalClose,
  isUpdateMode = false,
  isEditable = true,
}) => {
  // Khởi tạo state cho input datetime-local dựa trên initialValues
  const [startInput, setStartInput] = useState<string>(
    isUpdateMode ? toLocalDatetimeValue(initialValues.startTime) : ""
  );
  const [endInput, setEndInput] = useState<string>(
    isUpdateMode ? toLocalDatetimeValue(initialValues.endTime) : ""
  );

  // Dùng useEffect để set lại state input khi initialValues thay đổi (khi load chi tiết)
  useEffect(() => {
    if (isUpdateMode && initialValues.startTime) {
      setStartInput(toLocalDatetimeValue(initialValues.startTime));
    }
    if (isUpdateMode && initialValues.endTime) {
      setEndInput(toLocalDatetimeValue(initialValues.endTime));
    }
  }, [isUpdateMode, initialValues.startTime, initialValues.endTime]);

  const handleDateTimeChange = (
    value: string,
    type: "start" | "end",
    setFieldValue: FormikHelpers<EventFormValues>["setFieldValue"]
  ) => {
    if (!isEditable) return; // Guard

    // Cập nhật state cục bộ cho input datetime-local
    if (type === "start") {
      setStartInput(value);
    } else {
      setEndInput(value);
    }

    if (!value) {
      // Nếu giá trị rỗng, set trường Formik về rỗng
      setFieldValue(type === "start" ? "startTime" : "endTime", "");
      return;
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
      // Nếu không phải là thời gian hợp lệ, set trường Formik về rỗng
      setFieldValue(type === "start" ? "startTime" : "endTime", "");
      return;
    }

    const isoStringWithTimezone = toISOStringWithTimezone(parsed);

    // Cập nhật trường Formik (startTime hoặc endTime)
    setFieldValue(
      type === "start" ? "startTime" : "endTime",
      isoStringWithTimezone
    );
  };

  const startLabel = useMemo(() => formatLocalTime(startInput), [startInput]);
  const endLabel = useMemo(() => formatLocalTime(endInput), [endInput]);

  const handleFormikSubmit = async (
    values: EventFormValues,
    actions: FormikHelpers<EventFormValues>
  ) => {
    await onSubmit({
      ...values,
      categoryId: String(values.categoryId),
    });
    actions.setSubmitting(false);
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleFormikSubmit}
      enableReinitialize={true} // Bật tính năng này để load lại form khi detail thay đổi
    >
      {({ isSubmitting, isValid, errors, setFieldValue, values }) => (
        <Form className="space-y-4">
          {/* ... (Tiêu đề) ... */}
          <div>
            <Label htmlFor="title">
              Tiêu đề <span className="text-red-500">*</span>
            </Label>
            <Field
              id="title"
              name="title"
              as={Input}
              placeholder="Nhập tiêu đề sự kiện"
              readOnly={!isEditable} // Dựa trên isEditable
              className={`bg-gray-100 ${
                !isEditable ? "cursor-not-allowed" : ""
              }`}
            />
            <ErrorMessage
              name="title"
              component="p"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* ... (Mô tả, Địa điểm - Tương tự, thêm readOnly={!isEditable}) ... */}
          {/* Mô tả */}
          <div>
            <Label htmlFor="description">Mô tả</Label>
            <Field
              id="description"
              name="description"
              as={Input}
              placeholder="Mô tả sự kiện (tùy chọn)"
              readOnly={!isEditable}
              className={`bg-gray-100 ${
                !isEditable ? "cursor-not-allowed" : ""
              }`}
            />
          </div>

          {/* Địa điểm */}
          <div>
            <Label htmlFor="location">
              Địa điểm <span className="text-red-500">*</span>
            </Label>
            <Field
              id="location"
              name="location"
              as={Input}
              placeholder="Nhập địa điểm tổ chức"
              readOnly={!isEditable}
              className={`bg-gray-100 ${
                !isEditable ? "cursor-not-allowed" : ""
              }`}
            />
            <ErrorMessage
              name="location"
              component="p"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Ngày bắt đầu & giờ (Thêm readOnly) */}
          <div className={errors.startTime ? "space-y-1" : "space-y-2"}>
            <Label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              Thời gian bắt đầu <span className="text-red-500">*</span>
            </Label>
            <Input
              type="datetime-local"
              value={startInput}
              onChange={(e) =>
                isEditable &&
                handleDateTimeChange(e.target.value, "start", setFieldValue)
              }
              readOnly={!isEditable}
              className={`h-11 bg-gray-100 ${
                !isEditable ? "cursor-not-allowed" : ""
              }`}
            />
            <p className="text-xs text-gray-500">
              Đã chọn: <span className="font-medium">{startLabel}</span>
            </p>
            <ErrorMessage
              name="startTime"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Ngày kết thúc & giờ (Thêm readOnly) */}
          <div className={errors.endTime ? "space-y-1" : "space-y-2"}>
            <Label className="flex items-center gap-2 text-sm font-semibold text-gray-800">
              <CalendarIcon className="h-4 w-4 text-gray-500" />
              Thời gian kết thúc <span className="text-red-500">*</span>
            </Label>
            <Input
              type="datetime-local"
              value={endInput}
              min={startInput || undefined}
              onChange={(e) =>
                isEditable &&
                handleDateTimeChange(e.target.value, "end", setFieldValue)
              }
              readOnly={!isEditable}
              className={`h-11 bg-gray-100 ${
                !isEditable ? "cursor-not-allowed" : ""
              }`}
            />
            <p className="text-xs text-gray-500">
              Đã chọn: <span className="font-medium">{endLabel}</span>
            </p>
            <ErrorMessage
              name="endTime"
              component="p"
              className="text-red-500 text-sm"
            />
          </div>

          {/* Danh mục (Thêm disabled) */}
          <div>
            <Label htmlFor="categoryId">
              Danh mục <span className="text-red-500">*</span>
            </Label>
            <Select
              value={values.categoryId}
              onValueChange={(val) =>
                isEditable && setFieldValue("categoryId", val)
              }
              disabled={loadingCategories || !isEditable} // Dựa trên isEditable
            >
              <SelectTrigger disabled={loadingCategories || !isEditable}>
                <SelectValue
                  placeholder={
                    loadingCategories ? "Đang tải..." : "Chọn danh mục (*)"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {/* ... items ... */}
                {eventCategories.length === 0 ? (
                  <SelectItem value="" disabled>
                    {loadingCategories ? "Đang tải..." : "Không có danh mục"}
                  </SelectItem>
                ) : (
                  eventCategories.map((cat) => (
                    <SelectItem key={cat.id} value={String(cat.id)}>
                      {cat.name}
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
            <ErrorMessage
              name="categoryId"
              component="p"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          {/* Điểm/Coin (Thêm readOnly) */}
          <div className="grid grid-cols-3 gap-4">
            {/* Phí đăng ký */}
            <div>
              <Label htmlFor="pointCostToRegister">
                Phí đăng ký (Điểm) <span className="text-red-500">*</span>
              </Label>
              <Field
                id="pointCostToRegister"
                name="pointCostToRegister"
                type="number"
                as={Input}
                min={0}
                readOnly={!isEditable}
                className={`bg-gray-100 ${
                  !isEditable ? "cursor-not-allowed" : ""
                }`}
              />
              <ErrorMessage
                name="pointCostToRegister"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            {/* Điểm thưởng */}
            <div>
              <Label htmlFor="totalRewardPoints">
                Điểm thưởng <span className="text-red-500">*</span>
              </Label>
              <Field
                id="totalRewardPoints"
                name="totalRewardPoints"
                type="number"
                as={Input}
                min={0}
                readOnly={!isEditable}
                className={`bg-gray-100 ${
                  !isEditable ? "cursor-not-allowed" : ""
                }`}
              />
              <ErrorMessage
                name="totalRewardPoints"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            {/* Ngân sách Coin */}
            <div>
              <Label htmlFor="totalBudgetCoin">
                Ngân sách (Coin) <span className="text-red-500">*</span>
              </Label>
              <Field
                id="totalBudgetCoin"
                name="totalBudgetCoin"
                type="number"
                as={Input}
                min={0}
                readOnly={!isEditable}
                className={`bg-gray-100 ${
                  !isEditable ? "cursor-not-allowed" : ""
                }`}
              />
              <ErrorMessage
                name="totalBudgetCoin"
                component="p"
                className="text-red-500 text-sm mt-1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="secondary" onClick={onModalClose} type="button">
              {isUpdateMode ? "Đóng" : "Hủy"}
            </Button>
            {isEditable && (
              <Button
                type="submit"
                className="bg-orange-500 hover:bg-orange-600"
                disabled={isSubmitting || saving || !isValid}
              >
                {
                  isSubmitting || saving ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : isUpdateMode ? (
                    "Cập nhật"
                  ) : (
                    "Tạo sự kiện"
                  ) // Thay đổi text nút
                }
              </Button>
            )}
          </div>
        </Form>
      )}
    </Formik>
  );
};
