"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchAllPartners,
  createPartner,
  updatePartnerStatus,
} from "../thunks/partnerThunks";
import { clearError } from "../slices/partnerSlice";
import type { CreatePartner } from "@/features/partner/types/partner";

export const usePartners = () => {
  const dispatch = useAppDispatch();

  const { list, loadingList, saving, error } = useAppSelector(
    (state) => state.partner
  );

  /** 🔸 Lấy danh sách tất cả partner */
  const loadAll = useCallback(async () => {
    const res: any = await dispatch(fetchAllPartners()).unwrap();

    if (Array.isArray(res)) {
      res.sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : a.id;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : b.id;
        return dateB - dateA;
      });
    }

    return res;
  }, [dispatch]);

  /** 🔸 Tạo mới partner */
  const createNewPartner = useCallback(
    async (data: CreatePartner) => {
      const result = await dispatch(createPartner(data));
      return result;
    },
    [dispatch]
  );

  /** 🔸 Cập nhật trạng thái partner */
  const changePartnerStatus = useCallback(
    async (id: number, status: "ACTIVE" | "INACTIVE") => {
      const result = await dispatch(updatePartnerStatus({ id, status }));
      return result;
    },
    [dispatch]
  );

  /** 🔸 Xoá lỗi */
  const clearPartnerError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /** 🔸 Tự động load danh sách khi mount */
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  return {
    list,
    error,
    loadingList,
    saving,
    loadAll,
    createNewPartner,
    changePartnerStatus,
    clearPartnerError,
  };
};
