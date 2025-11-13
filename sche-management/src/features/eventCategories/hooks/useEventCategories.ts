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
    (data: CreateEventCategory) => {
      return dispatch(createEventCategory(data));
    },
    [dispatch]
  );

  /** 🔸 Cập nhật danh mục */
  const updateCategory = useCallback(
    (id: string, data: UpdateEventCategory) => {
      return dispatch(updateEventCategory({ id, data }));
    },
    [dispatch]
  );

  /** 🔸 Xoá danh mục */
  const deleteCategoryById = useCallback(
    (id: string) => {
      return dispatch(deleteEventCategory(id));
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
