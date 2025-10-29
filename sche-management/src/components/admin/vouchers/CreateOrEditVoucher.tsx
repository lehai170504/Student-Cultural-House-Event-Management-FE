"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface CreateOrEditVoucherProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (voucher: {
    code: string;
    discount: string;
    expiredAt: string;
    status: "active" | "expired";
  }) => void;
  voucher?: {
    id?: number;
    code: string;
    discount: string;
    expiredAt: string;
    status: "active" | "expired";
  };
}

export default function CreateOrEditVoucher({
  open,
  onClose,
  onCreate,
  voucher,
}: CreateOrEditVoucherProps) {
  const [formData, setFormData] = useState({
    code: voucher?.code || "",
    discount: voucher?.discount || "",
    expiredAt: voucher?.expiredAt || "",
    status: voucher?.status || "active",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    if (voucher) {
      console.log("Cập nhật voucher:", formData);
    } else {
      console.log("Thêm voucher:", formData);
      onCreate?.(formData); // gọi callback để thêm vào list
    }
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {voucher ? "Xem / Sửa voucher" : "Thêm voucher mới"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Mã Voucher</Label>
            <Input name="code" value={formData.code} onChange={handleChange} />
          </div>

          <div>
            <Label>Giảm giá</Label>
            <Input
              name="discount"
              value={formData.discount}
              onChange={handleChange}
              placeholder="VD: 20% hoặc 50000"
            />
          </div>

          <div>
            <Label>Ngày hết hạn</Label>
            <Input
              type="date"
              name="expiredAt"
              value={formData.expiredAt}
              onChange={handleChange}
            />
          </div>

          <div>
            <Label>Trạng thái</Label>
            <Input
              name="status"
              value={formData.status}
              onChange={handleChange}
              placeholder="active hoặc expired"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            className="bg-purple-500 hover:bg-purple-600"
            onClick={handleSubmit}
          >
            {voucher ? "Lưu thay đổi" : "Thêm"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
