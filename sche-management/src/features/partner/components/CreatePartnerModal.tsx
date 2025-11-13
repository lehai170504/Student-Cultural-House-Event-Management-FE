// src/features/partner/components/CreatePartnerModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { PartnerForm } from "./PartnerForm";
import { usePartners } from "../hooks/usePartners";
import type { CreatePartner } from "@/features/partner/types/partner";

interface Props {
  open: boolean;
  onClose: () => void;
  onCreate?: (data: CreatePartner) => Promise<void>;
}

export default function CreatePartnerModal({ open, onClose, onCreate }: Props) {
  const { createNewPartner, saving } = usePartners();

  const initialValues: CreatePartner = {
    username: "",
    name: "",
    organizationType: "",
    contactEmail: "",
    contactPhone: "",
  };

  const handleSubmit = async (values: CreatePartner) => {
    try {
      if (onCreate) {
        await onCreate(values);
      } else {
        await createNewPartner(values);
      }

      toast.success("Tạo partner thành công", {
        description: `Partner ${values.name} đã được tạo.`,
      });
      onClose();
    } catch (err) {
      toast.error("Lỗi khi tạo partner", {
        description: "Đã xảy ra lỗi trong quá trình tạo partner.",
      });
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

        <PartnerForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          saving={saving}
        />
      </DialogContent>
    </Dialog>
  );
}
