"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../thunks/eventThunks";
import { resetDetail, clearError } from "../slices/eventSlice";
import {
  fetchAllEventCategories,
} from "@/features/eventCategories/thunks/eventCategoryThunks";

import type { CreateEvent, UpdateEvent } from "../types/events";


export const useEvents = () => {
  const dispatch = useAppDispatch();

  const { list, detail, loadingList, loadingDetail, saving, deleting, error } =
    useAppSelector((state) => state.event);

  const { list: categories = [], loadingList: loadingCategories } =
    useAppSelector((state) => state.eventCategory);

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

  /** 🔸 Load danh mục luôn */
  const loadCategories = useCallback(async () => {
    await dispatch(fetchAllEventCategories());
  }, [dispatch]);

  /** 🔸 Tự động load events + categories khi mount */
  useEffect(() => {
    loadAll();
    loadCategories();
  }, [loadAll, loadCategories]);

  return {
    list,
    detail,
    error,
    loadingList,
    loadingDetail,
    saving,
    deleting,
    eventCategories: categories,
    loadingCategories,
    loadAll,
    loadDetail,
    createNewEvent,
    updateExistingEvent,
    deleteEventById,
    resetEventDetail,
    clearEventError,
  };
};
