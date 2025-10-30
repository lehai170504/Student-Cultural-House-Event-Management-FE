"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  sendEventFeedback,
  checkinEvent,
  fetchEventAttendees,
} from "../thunks/eventThunks";
import { resetDetail, clearError, resetPagination } from "../slices/eventSlice";
import { fetchAllEventCategories } from "@/features/eventCategories/thunks/eventCategoryThunks";

import type { CreateEvent, UpdateEvent } from "../types/events";

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
    currentPage,
    totalElements,
    totalPages,
    pageSize,
    isLastPage,

    // EXTENDED STATE
    registering,
    sendingFeedback,
    checkingIn,
    loadingAttendees,
    attendees,
  } = useAppSelector((state) => state.event);

  const { list: categories = [], loadingList: loadingCategories } =
    useAppSelector((state) => state.eventCategory);

  /** 🔸 Lấy danh sách tất cả events */
  const loadAll = useCallback(
    async (params?: Record<string, any>) => {
      const res = await dispatch(fetchAllEvents(params)).unwrap();
      return res;
    },
    [dispatch]
  );

  /** 🔸 Lấy chi tiết event */
  const loadDetail = useCallback(
    async (id: number) => {
      await dispatch(fetchEventById(id));
    },
    [dispatch]
  );

  /** 🔸 Tạo mới event */
  const createNewEvent = useCallback(
    async (data: CreateEvent) => {
      const result = await dispatch(createEvent(data));
      return result;
    },
    [dispatch]
  );

  /** 🔸 Cập nhật event */
  const updateExistingEvent = useCallback(
    async (id: number, data: UpdateEvent) => {
      const result = await dispatch(updateEvent({ id, data }));
      return result;
    },
    [dispatch]
  );

  /** 🔸 Xoá event */
  const deleteEventById = useCallback(
    async (id: number) => {
      const result = await dispatch(deleteEvent(id));
      return result;
    },
    [dispatch]
  );

  /** 🔸 Reset chi tiết */
  const resetEventDetail = useCallback(() => {
    dispatch(resetDetail());
  }, [dispatch]);

  /** 🔸 Reset Pagination */
  const resetEventPagination = useCallback(() => {
    dispatch(resetPagination());
  }, [dispatch]);

  /** 🔸 Xoá lỗi */
  const clearEventError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /** 🔸 Load danh mục */
  const loadCategories = useCallback(async () => {
    await dispatch(fetchAllEventCategories());
  }, [dispatch]);

  /** 🔸 1️⃣ Đăng ký sự kiện */
  const registerForEventByStudent = useCallback(
    async (eventId: number, studentId: number) => {
      const result = await dispatch(registerForEvent({ eventId, studentId }));
      return result;
    },
    [dispatch]
  );

  /** 🔸 2️⃣ Gửi feedback */
  const sendFeedbackForEvent = useCallback(
    async (eventId: number, data: { rating: number; comments: string }) => {
      const result = await dispatch(sendEventFeedback({ eventId, data }));
      return result;
    },
    [dispatch]
  );

  /** 🔸 3️⃣ Check-in sự kiện */
  const checkinForEvent = useCallback(
    async (data: { eventId: number; phoneNumber: string }) => {
      const result = await dispatch(checkinEvent(data));
      return result;
    },
    [dispatch]
  );

  /** 🔸 4️⃣ Lấy danh sách người tham dự */
  const loadEventAttendees = useCallback(
    async (eventId: number, params?: Record<string, any>) => {
      const result = await dispatch(fetchEventAttendees({ eventId, params }));
      return result;
    },
    [dispatch]
  );

  /** 🔸 Tự động load events + categories khi mount */
  useEffect(() => {
    loadAll();
    loadCategories();
  }, [loadAll, loadCategories]);

  return {
    // DỮ LIỆU SỰ KIỆN
    list,
    detail,
    attendees,
    error,
    eventCategories: categories,

    // TRẠNG THÁI LOADING
    loadingList,
    loadingDetail,
    saving,
    deleting,
    loadingCategories,
    registering,
    sendingFeedback,
    checkingIn,
    loadingAttendees,

    // TRẠNG THÁI PHÂN TRANG
    currentPage,
    totalElements,
    totalPages,
    pageSize,
    isLastPage,

    // ACTIONS
    loadAll,
    loadDetail,
    createNewEvent,
    updateExistingEvent,
    deleteEventById,
    resetEventDetail,
    resetEventPagination,
    clearEventError,

    // EXTENDED ACTIONS
    registerForEventByStudent,
    sendFeedbackForEvent,
    checkinForEvent,
    loadEventAttendees,
  };
};
