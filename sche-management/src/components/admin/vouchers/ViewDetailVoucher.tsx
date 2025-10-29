"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Gift, Percent, Calendar, Info } from "lucide-react";

type Voucher = {
  id: number;
  code: string;
  discount: string;
  expiredAt: string;
  status: "active" | "expired";
};

interface ViewDetailVoucherProps {
  voucher: Voucher | null;
  onClose: () => void;
}

export default function ViewDetailVoucher({
  voucher,
  onClose,
}: ViewDetailVoucherProps) {
  if (!voucher) return null;

  return (
    <Dialog open={!!voucher} onOpenChange={onClose}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-purple-600">
            Chi tiết voucher
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Mã voucher */}
          <div>
            <Label className="text-gray-500 flex items-center gap-2">
              <Gift className="w-4 h-4 text-purple-500" />
              Mã voucher
            </Label>
            <p className="font-medium text-gray-800">{voucher.code}</p>
          </div>

          {/* Giảm giá */}
          <div>
            <Label className="text-gray-500 flex items-center gap-2">
              <Percent className="w-4 h-4 text-green-500" />
              Giảm giá
            </Label>
            <p className="font-medium text-gray-800">{voucher.discount}</p>
          </div>

          {/* Ngày hết hạn */}
          <div>
            <Label className="text-gray-500 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Hết hạn
            </Label>
            <p className="font-medium text-gray-800">{voucher.expiredAt}</p>
          </div>

          {/* Trạng thái */}
          <div>
            <Label className="text-gray-500 flex items-center gap-2">
              <Info className="w-4 h-4 text-gray-500" />
              Trạng thái
            </Label>
            <Badge
              className={
                voucher.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-600"
              }
            >
              {voucher.status === "active" ? "Đang hoạt động" : "Hết hạn"}
            </Badge>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
