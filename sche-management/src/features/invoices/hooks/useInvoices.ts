import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  createInvoice,
  markInvoiceAsDelivered,
  cancelInvoice,
  fetchInvoiceDetail,
  fetchStudentRedeemHistory,
  fetchAllRedemptionInvoices, // 🌟 Import Thunk mới
} from "../thunks/invoiceThunks";
import {
  clearError,
  resetDetail,
  resetStudentHistory,
  resetAllRedemptions, // 🌟 Import Reducer mới
} from "../slices/invoiceSlice";
import type { CreateInvoice } from "../types/invoice";

export const useInvoices = () => {
  const dispatch = useAppDispatch();

  // Lấy trạng thái từ Invoice Slice
  const {
    detail,
    studentHistory,
    allRedemptions, // 🌟 State mới: Danh sách tất cả hóa đơn redeem
    loadingDetail,
    loadingHistory,
    loadingAllRedemptions, // 🌟 Loading state mới
    loadingStats,
    saving,
    error,
  } = useAppSelector((state) => state.invoice); // Giả định slice tên là 'invoice'

  // --- 1. LẤY DỮ LIỆU (READ) ---

  /** 🔎 Fetch chi tiết hóa đơn theo ID */
  const loadDetail = useCallback(
    async (invoiceId: string) => {
      await dispatch(fetchInvoiceDetail(invoiceId));
    },
    [dispatch]
  );

  /** 📜 Fetch lịch sử redeem của sinh viên */
  const loadStudentHistory = useCallback(
    async (studentId: string) => {
      await dispatch(fetchStudentRedeemHistory(studentId));
    },
    [dispatch]
  );

  /** 🌟 Fetch TẤT CẢ hóa đơn đổi quà */
  const loadAllRedemptions = useCallback(async () => {
    await dispatch(fetchAllRedemptionInvoices());
  }, [dispatch]);

  /** 🛒 Tạo hóa đơn mới (Thực hiện Redeem) */
  const createNewInvoice = useCallback(
    async (data: CreateInvoice): Promise<boolean> => {
      const result = await dispatch(createInvoice(data));
      // Trả về true nếu fulfilled, false nếu rejected
      return createInvoice.fulfilled.match(result);
    },
    [dispatch]
  );

  /** ✅ Đánh dấu hóa đơn đã giao */
  const deliverInvoice = useCallback(
    async (invoiceId: string): Promise<boolean> => {
      const result = await dispatch(markInvoiceAsDelivered({ invoiceId }));
      return markInvoiceAsDelivered.fulfilled.match(result);
    },
    [dispatch]
  );

  /** ↩️ Huỷ hóa đơn */
  const cancelRedemption = useCallback(
    async (invoiceId: string): Promise<boolean> => {
      const result = await dispatch(cancelInvoice(invoiceId));
      return cancelInvoice.fulfilled.match(result);
    },
    [dispatch]
  );

  // --- 3. RESET & UTILITY ---

  /** 🔄 Reset chi tiết hóa đơn */
  const resetInvoiceDetail = useCallback(() => {
    dispatch(resetDetail());
  }, [dispatch]);

  /** 🔄 Reset lịch sử redeem */
  const resetHistory = useCallback(() => {
    dispatch(resetStudentHistory());
  }, [dispatch]);

  /** 🌟 Reset danh sách tất cả hóa đơn redeem */
  const resetAllRedemptionsList = useCallback(() => {
    dispatch(resetAllRedemptions());
  }, [dispatch]);

  /** ❌ Xóa lỗi */
  const clearInvoiceError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  // --- RETURN VALUE ---
  return {
    detail,
    studentHistory,
    allRedemptions,
    // stats,
    loadingDetail,
    loadingHistory,
    loadingAllRedemptions,
    loadingStats,
    saving,
    error,

    loadDetail,
    loadStudentHistory,
    loadAllRedemptions,
    // loadStats,

    createNewInvoice,
    deliverInvoice,
    cancelRedemption,

    resetInvoiceDetail,
    resetHistory,
    resetAllRedemptionsList,
    clearInvoiceError,
  };
};
