"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// @ts-ignore
import { toast } from "sonner";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import type { RequestWalletTopUpPartner } from "@/features/wallet/types/wallet";

interface TopUpPartnerModalProps {
  open: boolean;
  onClose: () => void;
  onTopUpSuccess: (partnerName: string, amount: number) => void;
  partnerId: string;
  partnerName: string;
}

export default function TopUpPartnerModal({
  open,
  onClose,
  onTopUpSuccess,
  partnerId,
  partnerName,
}: TopUpPartnerModalProps) {
  const { doTopUpPartner } = useWallet();
  const [amount, setAmount] = useState<number | string>("");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (open) {
      setAmount("");
      setIsProcessing(false);
    }
  }, [open]);

  const handleTopUp = async () => {
    const topUpAmount = Number(amount);

    if (isNaN(topUpAmount) || topUpAmount <= 0) {
      toast.warning("Lỗi dữ liệu", {
        description: "Vui lòng nhập số lượng coin hợp lệ (> 0).",
      });
      return;
    }

    setIsProcessing(true);

    const payload: RequestWalletTopUpPartner = {
      partnerId,
      amount: topUpAmount,
    };

    try {
      const action: any = await doTopUpPartner(payload);
      const ok = action?.meta?.requestStatus === "fulfilled";
      if (ok) {
        toast.success("Nạp coin thành công", {
          description: `${topUpAmount} coin đã được nạp cho đối tác ${partnerName}`,
        });
        onTopUpSuccess(partnerName, topUpAmount);
      } else {
        const errMsg =
          action?.payload || "Không thể nạp coin. Vui lòng thử lại.";
        toast.error("Nạp coin thất bại", { description: String(errMsg) });
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Nạp Coin cho Đối tác
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            Thực hiện nạp coin vào ví cho đối tác **{partnerName}**.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Số lượng Coin cần nạp <span className="text-red-500">*</span>
            </label>
            <Input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Nhập số lượng coin (ví dụ: 1000)"
              min="1"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={isProcessing}>
            Hủy
          </Button>
          <Button
            className="bg-blue-500 hover:bg-blue-600 flex items-center gap-1"
            onClick={handleTopUp}
            disabled={isProcessing}
          >
            {isProcessing ? "Đang xử lý..." : "Xác nhận Nạp Coin"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
