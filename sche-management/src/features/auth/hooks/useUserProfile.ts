"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchUserProfile } from "../thunks/authThunks";
import { clearError as clearAuthError, setLoading as setAuthLoading } from "../slices/authSlice";

/** 🔹 Hook quản lý profile user */
export const useUserProfile = () => {
  const dispatch = useAppDispatch();

  const { user, isAuthenticated, isLoading, error } = useAppSelector(
    (state) => state.auth
  );

  /** 🔸 Load thông tin user */
  const loadProfile = useCallback(async () => {
    await dispatch(fetchUserProfile());
  }, [dispatch]);

  /** 🔸 Xoá lỗi */
  const clearProfileError = useCallback(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  /** 🔸 Set loading thủ công (tuỳ trường hợp cần) */
  const setLoading = useCallback(
    (loading: boolean) => {
      dispatch(setAuthLoading(loading));
    },
    [dispatch]
  );

  /** 🔸 Tự động load profile khi mount */
  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    loadProfile,
    clearProfileError,
    setLoading,
  };
};
