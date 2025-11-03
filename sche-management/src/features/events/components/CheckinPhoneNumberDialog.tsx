// CheckinPhoneNumberDialog.tsx
// File này chứa component modal để nhập số điện thoại check-in cho sự kiện.

import { useState } from "react";
// Giả định các imports từ ShadCN/ui và các thư viện khác (Lucide, Sonner)
import { Button } from "@/components/ui/button"; // Hoặc tương đương
import { Input } from "@/components/ui/input"; // Hoặc tương đương
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Phone, RotateCw, CheckSquare } from "lucide-react";
import { toast } from "sonner"; // Hoặc tương đương

// Interface cần thiết cho component này
interface CheckinDialogProps {
  open: boolean;
  event: { id: number; title: string; studentId: number; studentName: string };
  onClose: () => void;
  onSubmit: (eventId: number, phoneNumber: string) => void;
  submitting: boolean;
}

export default function CheckinPhoneNumberDialog({
  open,
  event,
  onClose,
  onSubmit,
  submitting,
}: CheckinDialogProps) {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneNumber.trim() === "") {
      toast.error("Vui lòng nhập số điện thoại.");
      return;
    }
    onSubmit(event.id, phoneNumber.trim());
  };

  // Hàm này để reset form khi modal đóng, đảm bảo SĐT trống cho lần mở tiếp theo
  const handleClose = () => {
    setPhoneNumber("");
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
            <span className="font-semibold text-gray-800">"{event.title}"</span>
            .
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Input
              id="phone"
              type="tel"
              placeholder="Ví dụ: 0901 234 567"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="col-span-4 border-2 border-green-300 focus-visible:ring-green-500 text-lg"
              disabled={submitting}
            />
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
              disabled={submitting || phoneNumber.trim() === ""}
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
