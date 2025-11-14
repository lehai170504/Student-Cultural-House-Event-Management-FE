"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import type { Reward } from "../types";

interface GiftDetailDialogProps {
  reward: Reward | null;
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  onClose: () => void;
  onConfirmRedeem: () => void;
  creatingInvoice: boolean;
  studentId: string | null;
  similarRewards: Reward[];
  onOpenSimilar: (id: string) => void;
}

export default function GiftDetailDialog({
  reward,
  quantity,
  onQuantityChange,
  onClose,
  onConfirmRedeem,
  creatingInvoice,
  studentId,
  similarRewards,
  onOpenSimilar,
}: GiftDetailDialogProps) {
  if (!reward) return null;

  return (
    <Dialog open={Boolean(reward)} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-3xl p-0 overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative h-56 md:h-full min-h-[260px]">
            {reward.image.startsWith("data:") || reward.image.startsWith("/") ? (
              <Image src={reward.image} alt={reward.name} fill className="object-cover" />
            ) : (
              <img src={reward.image} alt={reward.name} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                {reward.name}
              </DialogTitle>
            </DialogHeader>
            <p className="text-gray-600 mt-2 mb-4">{reward.description}</p>
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-orange-500 text-white">
                {reward.points.toLocaleString("vi-VN")} điểm
              </Badge>
              {reward.inStock ? (
                <Badge className="bg-green-500 text-white">Còn {reward.stock}</Badge>
              ) : (
                <Badge className="bg-gray-400 text-white">Hết quà</Badge>
              )}
            </div>
            
            {/* Quantity Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số lượng
              </label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || !reward.inStock}
                  className="w-10 h-10"
                >
                  -
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={reward.stock}
                  value={quantity}
                  onChange={(e) => {
                    const value = parseInt(e.target.value) || 1;
                    const clampedValue = Math.max(1, Math.min(value, reward.stock));
                    onQuantityChange(clampedValue);
                  }}
                  className="w-20 text-center"
                  disabled={!reward.inStock}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(Math.min(reward.stock, quantity + 1))}
                  disabled={quantity >= reward.stock || !reward.inStock}
                  className="w-10 h-10"
                >
                  +
                </Button>
                <span className="text-sm text-gray-600 ml-2">
                  Tổng: <span className="font-semibold text-orange-600">
                    {(reward.points * quantity).toLocaleString("vi-VN")} điểm
                  </span>
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button 
                className="bg-orange-500 hover:bg-orange-600 text-white"
                onClick={onConfirmRedeem}
                disabled={creatingInvoice || !reward.inStock || !studentId}
              >
                {creatingInvoice ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Đang xử lý...
                  </>
                ) : (
                  "Xác nhận đổi quà"
                )}
              </Button>
            </div>

            {similarRewards.length > 0 && (
              <div className="mt-6">
                <h4 className="font-semibold mb-3">Gợi ý quà tương tự</h4>
                <div className="grid grid-cols-2 gap-3">
                  {similarRewards.map((s) => (
                    <div 
                      key={s.id} 
                      className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer" 
                      onClick={() => onOpenSimilar(s.id)}
                    >
                      <div className="relative h-24">
                        <img src={s.image} alt={s.name} className="object-cover" />
                      </div>
                      <div className="p-2">
                        <p className="text-sm font-medium line-clamp-1">{s.name}</p>
                        <span className="text-xs text-gray-600">
                          {s.points.toLocaleString("vi-VN")} điểm
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

