"use client";

import { useEffect, useState } from "react";
import { useWallet } from "@/features/wallet/hooks/useWallet";
import { Wallet } from "@/features/wallet/types/wallet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Wallet as WalletIcon,
  User,
  Calendar,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";

interface PartnerWalletDetailProps {
  walletId: string;
  partnerName: string;
  open: boolean;
  onClose: () => void;
}

export default function PartnerWalletDetail({
  walletId,
  partnerName,
  open,
  onClose,
}: PartnerWalletDetailProps) {
  const { loadWallet, loading } = useWallet();
  const [loadedWallet, setLoadedWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    if (!open || !walletId) return;

    const fetchWallet = async () => {
      try {
        const result = await loadWallet(walletId);
        if (result?.payload && typeof result.payload !== "string") {
          setLoadedWallet(result.payload);
        } else {
          toast.error(`Không tìm thấy wallet của ${partnerName}`);
          setLoadedWallet(null);
        }
      } catch (err) {
        console.error(err);
        toast.error(`Không thể tải wallet của ${partnerName}`);
        setLoadedWallet(null);
      }
    };

    fetchWallet();
  }, [walletId, open, loadWallet, partnerName]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg">
        <DialogHeader className="border-b pb-2">
          <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <WalletIcon className="w-5 h-5 text-orange-500" />
            Wallet của {partnerName}
          </DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex justify-center items-center py-10 gap-2 text-gray-500">
            <Loader2 className="animate-spin h-6 w-6" />
            Đang tải wallet...
          </div>
        ) : loadedWallet ? (
          <div className="space-y-6 py-4">
            {/* Balance card */}
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between shadow-sm">
              <div>
                <p className="text-sm text-gray-500">Số dư</p>
                <p className="text-2xl font-bold text-orange-600">
                  {new Intl.NumberFormat("vi-VN").format(loadedWallet.balance)}{" "}
                  {loadedWallet.currency}
                </p>
              </div>
              <WalletIcon className="w-12 h-12 text-orange-400" />
            </div>

            {/* Wallet info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Chủ sở hữu</p>
                  <p className="text-sm font-medium">
                    {loadedWallet.ownerType || "N/A"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg shadow-sm">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Ngày tạo</p>
                  <p className="text-sm font-medium">
                    {new Date(loadedWallet.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500">
            Không tìm thấy wallet
          </div>
        )}

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={onClose} className="w-full">
            Đóng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
