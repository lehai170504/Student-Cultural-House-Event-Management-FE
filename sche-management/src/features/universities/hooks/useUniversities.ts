"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchAllUniversities } from "../thunks/universityThunks";
import { clearError } from "../slices/universitySlice";

export const useUniversities = () => {
  const dispatch = useAppDispatch();

  const { list, loading, error } = useAppSelector((state) => state.university);

  /** 🔸 Lấy danh sách tất cả universities */
  const loadAll = useCallback(
    async (params?: Record<string, any>) => {
      await dispatch(fetchAllUniversities(params));
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
    loading,
    error,
    loadAll,
    clearUniversityError,
  };
};
