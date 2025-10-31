"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from "../thunks/universityThunks";
import { clearError } from "../slices/universitySlice";
import type { CreateUniversity, UpdateUniversity } from "../types/universities";

export const useUniversities = () => {
  const dispatch = useAppDispatch();

  const { list, loadingList, saving, deleting, error } = useAppSelector(
    (state) => state.university
  );

  /** 🔸 Lấy danh sách tất cả universities */
  const loadAll = useCallback(
    async (params?: Record<string, any>) => {
      await dispatch(fetchAllUniversities(params));
    },
    [dispatch]
  );

  /** 🔸 Tạo mới university */
  const create = useCallback(
    async (data: CreateUniversity) => {
      const result = await dispatch(createUniversity(data));
      return result;
    },
    [dispatch]
  );

  /** 🔸 Cập nhật university */
  const update = useCallback(
    async (id: number, data: UpdateUniversity) => {
      const result = await dispatch(updateUniversity({ id, data }));
      return result;
    },
    [dispatch]
  );

  /** 🔸 Xoá university */
  const remove = useCallback(
    async (id: number) => {
      const result = await dispatch(deleteUniversity(id));
      return result;
    },
    [dispatch]
  );

  /** 🔸 Xoá lỗi */
  const clearUniversityError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /** 🔸 Tự động load universities khi mount */
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    list,
    loadingList,
    saving,
    deleting,
    error,
    loadAll,
    create,
    update,
    remove,
    clearUniversityError,
  };
};
