// src/features/partner/hooks/usePartners.ts

"use client";

import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
// ✅ Import thunk mới: fetchPartnerById
import { fetchAllPartners, createPartner, fetchPartnerById } from "../thunks/partnerThunks";
// ✅ Import action mới: clearSelectedPartner
import { clearError, clearSelectedPartner } from "../slices/partnerSlice";
import type { CreatePartner } from "@/features/partner/types/partner";

export const usePartners = () => {
  const dispatch = useAppDispatch();

  // ✅ Lấy thêm các state mới: selectedPartner, loadingDetail
  const { 
        list, 
        loadingList, 
        saving, 
        error, 
        selectedPartner, 
        loadingDetail 
    } = useAppSelector(
    (state) => state.partner
  );

  /** 🔸 Lấy danh sách tất cả partner */
  const loadAll = useCallback(async () => {
    try {
      await dispatch(fetchAllPartners()).unwrap();
    } catch (err) {
      console.error("❌ Lỗi khi tải partner:", err);
    }
  }, [dispatch]);

  /** 🔸 Tạo mới partner */
  const createNewPartner = useCallback(
    async (data: CreatePartner) => {
      try {
        const result = await dispatch(createPartner(data)).unwrap();
        return result;
      } catch (err) {
        console.error("❌ Lỗi khi tạo partner:", err);
        throw err;
      }
    },
    [dispatch]
  );

  /** 🔸 ✅ Lấy chi tiết partner theo ID */
  const loadPartnerById = useCallback(
    async (id: string) => {
        try {
            const result = await dispatch(fetchPartnerById(id)).unwrap();
            return result;
        } catch (err) {
            console.error(`❌ Lỗi khi tải chi tiết partner ${id}:`, err);
            throw err;
        }
    },
    [dispatch]
  );
  
  /** 🔸 ✅ Xoá chi tiết partner khỏi state */
  const clearPartnerDetail = useCallback(() => {
    dispatch(clearSelectedPartner());
  }, [dispatch]);


  /** 🔸 Xoá lỗi chung (danh sách, tạo, chi tiết) */
  const clearPartnerError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  /** 🔸 Tự động load danh sách khi mount */
  useEffect(() => {
    if (!list?.length) {
      loadAll();
    }
  }, [loadAll, list?.length]);

  return {
    // State danh sách & thao tác
    list,
    loadingList,
    saving,
    loadAll,
    createNewPartner,
    
    // ✅ State Chi tiết & thao tác (MỚI)
    selectedPartner,
    loadingDetail,
    loadPartnerById,
    clearPartnerDetail,

    // State lỗi
    error,
    clearPartnerError,
  };
};