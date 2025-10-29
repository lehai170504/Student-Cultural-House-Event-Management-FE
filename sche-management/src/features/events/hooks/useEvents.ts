"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../thunks/eventThunks";
import { resetDetail, clearError } from "../slices/eventSlice";
import type { CreateEvent, UpdateEvent } from "../types/events";

export const useEvents = () => {
  const dispatch = useAppDispatch();

  const { list, detail, loadingList, loadingDetail, saving, deleting, error } =
    useAppSelector((state) => state.event);

  /** 🔸 Lấy danh sách tất cả events */
  const loadAll = useCallback(
    async (params?: Record<string, any>) => {
      await dispatch(fetchAllEvents(params));
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

  /** 🔸 Xoá lỗi */
  const clearEventError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /** 🔸 Tự động load danh sách khi mount */
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    list,
    detail,
    error,
    loadingList,
    loadingDetail,
    saving,
    deleting,
    loadAll,
    loadDetail,
    createNewEvent,
    updateExistingEvent,
    deleteEventById,
    resetEventDetail,
    clearEventError,
  };
};
