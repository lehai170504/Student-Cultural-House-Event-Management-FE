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

  const {
    list,
    detailCategory,
    loadingList,
    loadingDetail,
    saving,
    deleting,
    error,
  } = useAppSelector((state) => state.eventCategory);

  /** 🔸 Lấy danh sách tất cả danh mục */
  const loadAll = useCallback(async () => {
    const res: any = await dispatch(fetchAllEventCategories()).unwrap();

    if (Array.isArray(res)) {
      res.sort((a, b) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;

        // Nếu createdAt bằng nhau, fallback so sánh id (string) theo Unicode
        if (timeB === timeA) {
          return a.id.localeCompare(b.id);
        }
        return timeB - timeA;
      });
    }

    return res;
  }, [dispatch]);

  /** 🔸 Lấy chi tiết danh mục */
  const loadDetail = useCallback(
    async (id: string) => {
      await dispatch(fetchEventCategoryById(id));
    },
    [dispatch]
  );

  /** 🔸 Tạo mới danh mục */
  const createCategory = useCallback(
    async (data: CreateEventCategory) => {
      const result = await dispatch(createEventCategory(data));
      return result;
    },
    [dispatch]
  );

  /** 🔸 Cập nhật danh mục */
  const updateCategory = useCallback(
    async (id: string, data: UpdateEventCategory) => {
      const result = await dispatch(updateEventCategory({ id, data }));
      return result;
    },
    [dispatch]
  );

  /** 🔸 Xoá danh mục */
  const deleteCategoryById = useCallback(
    async (id: string) => {
      const result = await dispatch(deleteEventCategory(id));
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
    // loadAll() có thể gọi thủ công khi component mount
    // loadAll();
  }, []);

  return {
    list,
    detail: detailCategory,
    error,
    loadingList,
    loadingDetail,
    saving,
    deleting,
    loadAll,
    loadDetail,
    createCategory,
    updateCategory,
    deleteCategoryById,
    resetCategoryDetail,
    clearCategoryError,
  };
};
