// src/features/partner/components/ViewDetailEvent.tsx
"use client";

import { useEffect, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEvents } from "../hooks/useEvents";
import { useUserProfileAuth } from "@/hooks/useUserProfileAuth";
import { toast } from "sonner";
// Import EventForm và các types
import { EventForm, EventFormValues } from "./EventForm";
// Giả định các imports này
// import type { EventDetail, UpdateEvent } from "@/features/events/types/events";

interface ViewDetailEventProps {
  eventId: string | null;
  open: boolean;
  onClose: () => void;
}

export default function ViewDetailEvent({
  eventId,
  open,
  onClose,
}: ViewDetailEventProps) {
  const { user: authUser } = useUserProfileAuth();
  const isPartner = authUser?.groups.includes("PARTNERS") || false;

  const {
    detail,
    loadingDetail,
    loadDetail,
    eventCategories,
    loadingCategories,
    updateExistingEvent,
    saving, // Lấy biến saving từ hook
    loadCategories,
  } = useEvents();

  // Load chi tiết và categories
  useEffect(() => {
    if (open && eventId) {
      loadDetail(eventId);
      loadCategories().catch(console.error);
    }
  }, [eventId, open, loadDetail, loadCategories]);

  // Chuẩn bị initialValues cho EventForm khi detail đã load
  const initialValuesForForm: EventFormValues | null = useMemo(() => {
    if (detail && detail.id === eventId) {
      // Map dữ liệu chi tiết sang EventFormValues
      return {
        id: eventId,
        title: detail.title,
        description: detail.description,
        location: detail.location,
        startTime: detail.startTime, // ISO String
        endTime: detail.endTime, // ISO String
        categoryId: String(detail.category?.id ?? ""),
        pointCostToRegister: detail.pointCostToRegister,
        totalRewardPoints: detail.totalRewardPoints,
        totalBudgetCoin: detail.totalBudgetCoin,
      };
    }
    return null; // Trả về null khi đang tải
  }, [detail, eventId]);

  const handleUpdate = async (values: EventFormValues) => {
    if (!eventId) return;

    // Type casting/Omit ID nếu cần thiết cho API của bạn
    const updateData = {
      title: values.title,
      description: values.description,
      location: values.location,
      startTime: values.startTime,
      endTime: values.endTime,
      categoryId: values.categoryId,
      pointCostToRegister: Number(values.pointCostToRegister),
      totalRewardPoints: Number(values.totalRewardPoints),
      totalBudgetCoin: Number(values.totalBudgetCoin),
    };

    try {
      await updateExistingEvent(eventId, updateData);

      toast.success("Cập nhật sự kiện thành công!");
      onClose();
    } catch (err) {
      console.error(err);
      toast.error("Cập nhật thất bại!");
    }
  };

  const isEditable = isPartner; // Chỉ partner mới được chỉnh sửa

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl w-full rounded-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800">
            Chi tiết sự kiện
          </DialogTitle>
        </DialogHeader>

        {loadingDetail || !initialValuesForForm ? (
          <p className="text-center py-10">Đang tải chi tiết...</p>
        ) : (
          <EventForm
            initialValues={initialValuesForForm}
            onSubmit={handleUpdate}
            saving={saving}
            eventCategories={eventCategories}
            loadingCategories={loadingCategories}
            onModalClose={onClose}
            isEditable={isEditable}
            isUpdateMode={true}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
