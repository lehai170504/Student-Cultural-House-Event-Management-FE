"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePartners } from "../hooks/usePartners";
import { showToast } from "@/components/ui/Toast";
import type { CreatePartner } from "@/features/partner/types/partner";

interface CreatePartnerModalProps {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: CreatePartner) => Promise<void>;
}

export default function CreatePartnerModal({
  open,
  onClose,
  onCreate,
}: CreatePartnerModalProps) {
  const { createNewPartner, saving } = usePartners();

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [organizationType, setOrganizationType] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  // Reset form khi modal mở
  useEffect(() => {
    if (open) {
      setUsername("");
      setName("");
      setOrganizationType("");
      setContactEmail("");
      setContactPhone("");
    }
  }, [open]);

  const handleSave = async () => {
    if (!username.trim() || !name.trim() || !contactEmail.trim()) {
      showToast({
        title: "Vui lòng điền đầy đủ thông tin bắt buộc",
        icon: "warning",
      });
      return;
    }

    const data: CreatePartner = {
      username,
      name,
      organizationType,
      contactEmail,
      contactPhone,
    };

    try {
      if (onCreate) {
        await onCreate(data);
      } else {
        await createNewPartner(data);
      }
      showToast({ title: "Tạo partner thành công", icon: "success" });
      onClose();
    } catch (err) {
      showToast({ title: "Lỗi khi tạo partner", icon: "error" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Tạo mới Partner
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Username <span className="text-red-500">*</span>
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập username"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Tên đối tác <span className="text-red-500">*</span>
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên đối tác"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Loại tổ chức
            </label>
            <Input
              value={organizationType}
              onChange={(e) => setOrganizationType(e.target.value)}
              placeholder="Nhập loại tổ chức"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <Input
              value={contactEmail}
              onChange={(e) => setContactEmail(e.target.value)}
              placeholder="Nhập email liên hệ"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Số điện thoại
            </label>
            <Input
              value={contactPhone}
              onChange={(e) => setContactPhone(e.target.value)}
              placeholder="Nhập số điện thoại liên hệ"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Hủy
          </Button>
          <Button
            className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"
            onClick={handleSave}
            disabled={saving}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
