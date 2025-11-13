"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  fetchEventAttendees,
  finalizeEvent,
  checkinByPhoneNumber,
  approveEvent,
} from "../thunks/eventThunks";
import { resetDetail, clearError, resetPagination } from "../slices/eventSlice";
import { fetchAllEventCategories } from "@/features/eventCategories/thunks/eventCategoryThunks";
import type {
  CreateEvent,
  UpdateEvent,
  EventCheckinDetail,
} from "../types/events";
import { toast } from "sonner";

export const useEvents = () => {
  const dispatch = useAppDispatch();

  const {
    list,
    detail,
    loadingList,
    loadingDetail,
    saving,
    deleting,
    error,
    pagination,
    registering,
    sendingFeedback,
    checkingIn,
    loadingAttendees,
    attendees,
    finalizing,
    submittingCheckin,
    approving,
  } = useAppSelector((state) => state.event);

  const { list: categories = [], loadingList: loadingCategories } =
    useAppSelector((state) => state.eventCategory);

  // 📦 --- CÁC HÀM CƠ BẢN ---
  const loadAll = useCallback(
    async (params?: Record<string, any>) => {
      const res = await dispatch(fetchAllEvents(params)).unwrap();
      if (res?.data && Array.isArray(res.data)) {
        return res.data
          .filter((item) => item?.createdAt)
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
      return [];
    },
    [dispatch]
  );

  const loadDetail = useCallback(
    async (id: string) => {
      return await dispatch(fetchEventById(id)).unwrap();
    },
    [dispatch]
  );

  const createNewEvent = useCallback(
    async (data: CreateEvent) => {
      return await dispatch(createEvent(data)).unwrap();
    },
    [dispatch]
  );

  const updateExistingEvent = useCallback(
    async (id: string, data: UpdateEvent) => {
      return await dispatch(updateEvent({ id, data })).unwrap();
    },
    [dispatch]
  );

  const deleteEventById = useCallback(
    async (id: string) => {
      return await dispatch(deleteEvent(id)).unwrap();
    },
    [dispatch]
  );

  const cancelEventById = useCallback(
    async (id: string) => {
      const currentEventDetail = await dispatch(fetchEventById(id)).unwrap();

      // Kiểm tra dữ liệu
      if (!currentEventDetail || !currentEventDetail.id) {
        throw new Error("Không tìm thấy sự kiện để hủy (CANCEL).");
      }
      const {
        id: _,
        partnerId: __,
        createdAt: ___,
        updatedAt: ____,
        ...updatableFields
      } = currentEventDetail as any;

      const fullUpdatePayload: UpdateEvent = {
        ...updatableFields,
        status: "CANCELLED",
      };
      return await dispatch(
        updateEvent({ id, data: fullUpdatePayload })
      ).unwrap();
    },
    [dispatch]
  );

  const finalizeEventById = useCallback(
    async (eventId: string) => {
      return await dispatch(finalizeEvent(eventId)).unwrap();
    },
    [dispatch]
  );

  const approveEventById = useCallback(
    async (eventId: string) => {
      return await dispatch(approveEvent(eventId)).unwrap();
    },
    [dispatch]
  );

  const deleteEventAndReload = useCallback(
    async (eventId: string, title: string, params?: any) => {
      try {
        await cancelEventById(eventId);
        await loadAll(params);
        toast.success(`Đã hủy (Soft Delete) sự kiện: ${title}`);
      } catch (error) {
        toast.error(
          (error as any)?.message || `Hủy sự kiện ${title} thất bại.`
        );
      }
    },
    [cancelEventById, loadAll]
  );

  const submitCheckinDetailData = useCallback(
    async (data: EventCheckinDetail & { phoneNumber: string }) => {
      const checkinPayload = {
        eventId: data.eventId,
        data: { phoneNumber: data.phoneNumber },
      };
      return await dispatch(checkinByPhoneNumber(checkinPayload)).unwrap();
    },
    [dispatch]
  );

  /** ✅ TẢI DANH SÁCH NGƯỜI THAM DỰ */
  const loadEventAttendees = useCallback(
    async (eventId: string, params?: Record<string, any>) => {
      return await dispatch(fetchEventAttendees({ eventId, params })).unwrap();
    },
    [dispatch]
  );

  /** ✅ TẢI DANH SÁCH NGƯỜI THAM DỰ CÓ TOAST */
  const loadEventAttendeesWithToast = useCallback(
    async (eventId: string, params?: Record<string, any>) => {
      try {
        await loadEventAttendees(eventId, params);
      } catch (error) {
        toast.error(
          (error as any)?.message || "Không thể tải danh sách người tham dự."
        );
      }
    },
    [loadEventAttendees]
  );

  // 📦 --- HỖ TRỢ KHÁC ---
  const resetEventDetail = useCallback(
    () => dispatch(resetDetail()),
    [dispatch]
  );
  const resetEventPagination = useCallback(
    () => dispatch(resetPagination()),
    [dispatch]
  );
  const clearEventError = useCallback(() => dispatch(clearError()), [dispatch]);
  const loadCategories = useCallback(async () => {
    await dispatch(fetchAllEventCategories()).unwrap();
  }, [dispatch]);

  // 📦 --- HÀM WRAPPER CÓ TOAST + RELOAD ---
  const approveEventAndReload = useCallback(
    async (eventId: string, title: string, params?: any) => {
      try {
        await approveEventById(eventId);
        await loadAll(params);
        toast.success(`Đã duyệt sự kiện: ${title}`);
      } catch (error) {
        toast.error(
          (error as any)?.message || `Duyệt sự kiện ${title} thất bại.`
        );
      }
    },
    [approveEventById, loadAll]
  );

  const finalizeEventAndReload = useCallback(
    async (eventId: string, title: string, params?: any) => {
      try {
        await finalizeEventById(eventId);
        await loadAll(params);
        toast.success(`Đã chốt (Finalize) sự kiện: ${title}`);
      } catch (error) {
        toast.error(
          (error as any)?.message || `Chốt sự kiện ${title} thất bại.`
        );
      }
    },
    [finalizeEventById, loadAll]
  );

  const submitCheckinAndNotify = useCallback(
    async (data: EventCheckinDetail & { phoneNumber: string }) => {
      try {
        const result = await submitCheckinDetailData(data);
        toast.success(
          `Check-in thành công cho sự kiện ${data.eventTitle} (${data.phoneNumber})`
        );
        return result;
      } catch (error) {
        toast.error((error as any)?.message || "Check-in thất bại.");
        throw error;
      }
    },
    [submitCheckinDetailData]
  );

  // 📦 --- AUTO LOAD LẦN ĐẦU ---
  useEffect(() => {
    loadAll({ page: 1, size: 10 }).catch(console.error);
    loadCategories().catch(console.error);
  }, [loadAll, loadCategories]);

  // 📦 --- TRẢ VỀ ---
  return {
    list,
    detail,
    attendees,
    pagination,
    error,

    // Loading states
    loadingList,
    loadingDetail,
    saving,
    deleting,
    registering,
    sendingFeedback,
    checkingIn,
    loadingAttendees,
    finalizing,
    submittingCheckin,
    approving,
    loadingCategories,

    // Basic API
    loadAll,
    loadDetail,
    createNewEvent,
    updateExistingEvent,
    deleteEventById,
    finalizeEventById,
    approveEventById,
    submitCheckinDetailData,
    loadEventAttendees,
    loadEventAttendeesWithToast,

    // Utility
    resetEventDetail,
    resetEventPagination,
    clearEventError,
    loadCategories,

    // Smart Actions (toast + reload)
    approveEventAndReload,
    finalizeEventAndReload,
    deleteEventAndReload,
    submitCheckinAndNotify,

    // Event categories
    eventCategories: categories,
  };
};
