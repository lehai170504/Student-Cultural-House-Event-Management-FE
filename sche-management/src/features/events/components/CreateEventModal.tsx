// src/features/partner/components/CreateEventModal.tsx
"use client";

import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

// Giả định type CreateEvent được import từ đây
import type { CreateEvent } from "@/features/events/types/events";
import { useEvents } from "../hooks/useEvents";
import { EventForm, EventFormValues } from "./EventForm";

interface CreateEventModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  partnerId: string;
}

export default function CreateEventModal({
  open,
  onClose,
  onSuccess,
  partnerId,
}: CreateEventModalProps) {
  const {
    createNewEvent,
    eventCategories,
    loadingCategories,
    saving,
    loadCategories,
  } = useEvents();

  // Khởi tạo giá trị ban đầu sử dụng EventFormValues
  // Đảm bảo partnerId được đưa vào vì API tạo mới cần nó
  const initialValues: EventFormValues = {
    partnerId: partnerId || "",
    title: "",
    description: "",
    startTime: "",
    endTime: "",
    location: "",
    categoryId: "",
    pointCostToRegister: 0,
    totalRewardPoints: 0,
    totalBudgetCoin: 0,
  };

  // Load categories khi mở modal
  useEffect(() => {
    if (open) loadCategories().catch(console.error);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Cập nhật hàm handleSubmit để nhận EventFormValues và map lại về CreateEvent
  const handleSubmit = async (values: EventFormValues) => {
    const createData: CreateEvent = {
      partnerId: partnerId,
      title: values.title,
      description: values.description,
      location: values.location,
      startTime: values.startTime,
      endTime: values.endTime,
      categoryId: values.categoryId,
      // Đảm bảo các giá trị là number
      pointCostToRegister: Number(values.pointCostToRegister),
      totalRewardPoints: Number(values.totalRewardPoints),
      totalBudgetCoin: Number(values.totalBudgetCoin),
    };

    try {
      await createNewEvent(createData);

      toast.success("Sự kiện đã được tạo thành công!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Không thể tạo sự kiện. Vui lòng thử lại.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white rounded-lg shadow-xl">
        <DialogHeader className="border-b pb-4">
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Tạo sự kiện mới
          </DialogTitle>
        </DialogHeader>

        {/* Sử dụng EventForm với các props mới */}
        <EventForm
          initialValues={initialValues}
          onSubmit={handleSubmit}
          saving={saving}
          eventCategories={eventCategories}
          loadingCategories={loadingCategories}
          onModalClose={onClose}
          isUpdateMode={false}
          isEditable={true}
        />
      </DialogContent>
    </Dialog>
  );
}
