import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

import {
  createInvoice,
  markInvoiceAsDelivered,
  cancelInvoice,
  fetchInvoiceDetail,
  fetchStudentRedeemHistory,
  fetchAllRedemptionInvoices,
} from "../thunks/invoiceThunks";

import {
  clearError,
  resetDetail,
  resetStudentHistory,
  resetAllRedemptions,
} from "../slices/invoiceSlice";

import type { CreateInvoice } from "../types/invoice";

export const useInvoices = () => {
  const dispatch = useAppDispatch();

  const {
    detail,
    studentHistory,
    allRedemptions,
    redemptionMeta, // ⭐ Lấy pagination meta
    loadingDetail,
    loadingHistory,
    loadingAllRedemptions,
    loadingStats,
    saving,
    error,
  } = useAppSelector((state) => state.invoice);

  // ======================
  // 📌 FETCH DATA
  // ======================

  /** 🔎 Lấy chi tiết hóa đơn */
  const loadDetail = useCallback(
    async (invoiceId: string) => {
      await dispatch(fetchInvoiceDetail(invoiceId));
    },
    [dispatch]
  );

  /** 📜 Lấy lịch sử redeem của sinh viên */
  const loadStudentHistory = useCallback(
    async (studentId: string) => {
      await dispatch(fetchStudentRedeemHistory(studentId));
    },
    [dispatch]
  );

  /** 🌟 Lấy tất cả hóa đơn đổi quà (có phân trang) */
  const loadAllRedemptions = useCallback(
    async (page: number = 1, size: number = 10) => {
      await dispatch(fetchAllRedemptionInvoices({ page, size }));
    },
    [dispatch]
  );

  // ======================
  // 📌 ACTIONS
  // ======================

  /** 🛒 Tạo hóa đơn redeem */
  const createNewInvoice = useCallback(
    async (data: CreateInvoice): Promise<{ success: boolean; error?: any; data?: any }> => {
      const result = await dispatch(createInvoice(data));
      // Trả về success, error và data nếu có
      if (createInvoice.fulfilled.match(result)) {
        return { success: true, data: result.payload };
      } else {
        const error = createInvoice.rejected.match(result) ? result.payload : undefined;
        return { success: false, error };
      }
    },
    [dispatch]
  );

  /** 🚚 Đánh dấu đã giao */
  const deliverInvoice = useCallback(
    async (invoiceId: string): Promise<boolean> => {
      const result = await dispatch(markInvoiceAsDelivered({ invoiceId }));
      return markInvoiceAsDelivered.fulfilled.match(result);
    },
    [dispatch]
  );

  /** ❌ Hủy hóa đơn */
  const cancelRedemption = useCallback(
    async (invoiceId: string): Promise<boolean> => {
      const result = await dispatch(cancelInvoice(invoiceId));
      return cancelInvoice.fulfilled.match(result);
    },
    [dispatch]
  );

  // ======================
  // 📌 RESET
  // ======================

  const resetInvoiceDetail = useCallback(() => {
    dispatch(resetDetail());
  }, [dispatch]);

  const resetHistory = useCallback(() => {
    dispatch(resetStudentHistory());
  }, [dispatch]);

  const resetAllRedemptionsList = useCallback(() => {
    dispatch(resetAllRedemptions());
  }, [dispatch]);

  const clearInvoiceError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // ======================
  // 📌 RETURN
  // ======================

  return {
    detail,
    studentHistory,
    allRedemptions,
    redemptionMeta, // ⭐ Trả meta cho UI phân trang

    loadingDetail,
    loadingHistory,
    loadingAllRedemptions,
    loadingStats,
    saving,
    error,

    loadDetail,
    loadStudentHistory,
    loadAllRedemptions,

    createNewInvoice,
    deliverInvoice,
    cancelRedemption,

    resetInvoiceDetail,
    resetHistory,
    resetAllRedemptionsList,
    clearInvoiceError,
  };
};
