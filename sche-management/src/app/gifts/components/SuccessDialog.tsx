"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Gift } from "lucide-react";
import type { RedeemedProduct } from "../types";

interface SuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: RedeemedProduct | null;
}

export default function SuccessDialog({ open, onOpenChange, product }: SuccessDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-600 flex items-center gap-2">
            <Gift className="h-6 w-6" />
            Đổi quà thành công!
          </DialogTitle>
        </DialogHeader>
        
        {product && (
          <div className="mt-4 space-y-4">
            {/* Product Image */}
            <div className="relative w-full h-48 rounded-lg overflow-hidden bg-gray-100">
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">{product.title}</h3>
                <Badge className="bg-blue-500 text-white">
                  {product.type}
                </Badge>
              </div>
              
              <p className="text-gray-600 text-sm">{product.description}</p>
              
              <div className="flex items-center gap-2 flex-wrap">
                <Badge className="bg-orange-500 text-white">
                  {product.unitCost.toLocaleString("vi-VN")} {product.currency}
                </Badge>
              </div>
            </div>

            {/* Action Button */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                onClick={() => onOpenChange(false)}
                className="bg-green-600 hover:bg-green-700"
              >
                Đóng
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

