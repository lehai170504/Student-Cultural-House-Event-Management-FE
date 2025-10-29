"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllEventCategories,
  fetchEventCategoryById,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
} from "../thunks/eventCategoryThunks";
import { resetDetail, clearError } from "../slices/eventCategorySlice";
import type {
  CreateEventCategory,
  UpdateEventCategory,
} from "../types/eventCategories";

export const useEventCategories = () => {
  const dispatch = useAppDispatch();

  // 🔹 Lấy state từ Redux store
  const { list, detail, loadingList, loadingDetail, saving, deleting, error } =
    useAppSelector((state) => state.eventCategory);

  /** 🔸 Lấy danh sách tất cả danh mục */
  const loadAll = useCallback(async () => {
    await dispatch(fetchAllEventCategories());
  }, [dispatch]);

  /** 🔸 Lấy chi tiết danh mục */
  const loadDetail = useCallback(
    async (id: number) => {
      await dispatch(fetchEventCategoryById(id));
    },
    [dispatch]
  );

  /** 🔸 Tạo mới danh mục */
  const createCategory = useCallback(
    async (data: CreateEventCategory) => {
      const result = await dispatch(createEventCategory(data));
      if (createEventCategory.fulfilled.match(result)) {
        await dispatch(fetchAllEventCategories());
      }
      return result;
    },
    [dispatch]
  );

  /** 🔸 Cập nhật danh mục */
  const updateCategory = useCallback(
    async (id: number, data: UpdateEventCategory) => {
      const result = await dispatch(updateEventCategory({ id, data }));
      if (updateEventCategory.fulfilled.match(result)) {
        await dispatch(fetchAllEventCategories());
      }
      return result;
    },
    [dispatch]
  );

  /** 🔸 Xoá danh mục */
  const deleteCategoryById = useCallback(
    async (id: number) => {
      const result = await dispatch(deleteEventCategory(id));
      if (deleteEventCategory.fulfilled.match(result)) {
        await dispatch(fetchAllEventCategories());
      }
      return result;
    },
    [dispatch]
  );

  /** 🔸 Reset chi tiết */
  const resetCategoryDetail = useCallback(() => {
    dispatch(resetDetail());
  }, [dispatch]);

  /** 🔸 Xoá lỗi */
  const clearCategoryError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /** 🔸 Tự động load danh sách khi mount */
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    // Data
    list,
    detail,
    error,

    // Loading states
    loadingList,
    loadingDetail,
    saving,
    deleting,

    // Actions
    loadAll,
    loadDetail,
    createCategory,
    updateCategory,
    deleteCategoryById,
    resetCategoryDetail,
    clearCategoryError,
  };
};
