// src/features/partner/components/CheckinPhoneNumberDialog.tsx (Đã thêm Validation)
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Phone, RotateCw, CheckSquare } from "lucide-react";
import { toast } from "sonner";
import { EventForCheckin } from "../types/events";

interface CheckinDialogProps {
  open: boolean;
  event: EventForCheckin;
  onClose: () => void;
  onSubmit: (payload: { eventId: string; phoneNumber: string }) => void;
  submitting: boolean;
}

// Hàm làm sạch và chuẩn hóa số điện thoại
const cleanPhoneNumber = (phone: string) => {
  // Loại bỏ mọi ký tự không phải số, ngoại trừ dấu cộng (+) ở đầu
  const cleaned = phone.replace(/[^\d+]/g, "");
  // Chuẩn hóa, loại bỏ dấu cộng ở giữa hoặc cuối nếu có
  return cleaned.replace(/(.)\+/g, "$1").replace(/^\++/g, "+");
};

// Hàm kiểm tra định dạng và độ dài
const validatePhoneNumber = (phone: string) => {
  const cleaned = cleanPhoneNumber(phone);

  if (!cleaned) {
    return "Vui lòng nhập số điện thoại.";
  }

  // Loại bỏ dấu '+' ở đầu để kiểm tra độ dài
  const digits = cleaned.replace(/^\+/, "").replace(/\s/g, "");

  // Quy tắc kiểm tra số điện thoại (Ví dụ cơ bản cho VN: 9-11 chữ số)
  if (digits.length < 9 || digits.length > 15) {
    return "Số điện thoại phải có từ 9 đến 15 chữ số.";
  }

  // Quy tắc kiểm tra ký tự (chỉ cho phép số, khoảng trắng, và dấu + ở đầu)
  const phoneRegex = /^\+?[\d\s]+$/;
  if (!phoneRegex.test(phone.trim())) {
    return "Số điện thoại chứa ký tự không hợp lệ.";
  }

  return null; // Trả về null nếu hợp lệ
};

export default function CheckinPhoneNumberDialog({
  open,
  event,
  onClose,
  onSubmit,
  submitting,
}: CheckinDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState<string | null>(null); // Thêm state cho lỗi validation

  // Reset state và lỗi mỗi khi modal mở hoặc đóng
  useEffect(() => {
    if (!open) {
      setPhoneNumber("");
      setError(null);
    }
  }, [open]);

  // Xóa lỗi khi người dùng thay đổi input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumber(e.target.value);
    if (error) setError(null); // Xóa lỗi khi bắt đầu nhập
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Chạy Validation
    const validationError = validatePhoneNumber(phoneNumber);

    if (validationError) {
      setError(validationError);
      toast.error(validationError); // Hiển thị lỗi dưới dạng toast
      return;
    }

    setError(null); // Xóa lỗi nếu validation thành công

    // 2. Chuẩn hóa số điện thoại (chỉ giữ lại số, có thể bao gồm '+' ở đầu) trước khi submit
    const cleanedPhone = cleanPhoneNumber(phoneNumber);

    onSubmit({ eventId: event.id, phoneNumber: cleanedPhone });
  };

  const handleClose = () => {
    setPhoneNumber("");
    setError(null);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px] rounded-xl shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-bold text-green-700">
            <Phone className="h-6 w-6 text-green-600" />
            Xác nhận Check-in qua Số điện thoại
          </DialogTitle>
          <DialogDescription className="mt-2 text-gray-600">
            Vui lòng nhập **số điện thoại** đã dùng để đăng ký sự kiện{" "}
            <span className="font-semibold text-gray-800">{event.title}</span>.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-2 py-4">
            <Input
              id="phone"
              type="tel"
              placeholder="Ví dụ: 0901 234 567"
              value={phoneNumber}
              onChange={handleInputChange} // Sử dụng hàm mới
              className={`col-span-4 border-2 focus-visible:ring-green-500 text-lg ${
                error ? "border-red-500" : "border-green-300"
              }`}
              disabled={submitting}
            />
            {error && ( // Hiển thị lỗi ngay dưới input
              <p className="text-red-500 text-sm mt-1">{error}</p>
            )}
          </div>

          <DialogFooter className="mt-4 pt-4 border-t border-gray-100">
            <Button
              variant="outline"
              onClick={handleClose}
              disabled={submitting}
              type="button"
              className="hover:bg-gray-100 transition-colors"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              disabled={submitting || !phoneNumber.trim()}
              className="bg-green-600 hover:bg-green-700 text-white transition-all duration-200"
            >
              {submitting ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" /> Đang
                  Check-in...
                </>
              ) : (
                <>
                  <CheckSquare className="mr-2 h-4 w-4" />
                  Xác nhận Check-in
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
