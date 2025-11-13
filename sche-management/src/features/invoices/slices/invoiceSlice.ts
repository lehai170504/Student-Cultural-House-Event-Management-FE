import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Invoice } from "../types/invoice";
import {
  createInvoice,
  markInvoiceAsDelivered,
  cancelInvoice,
  fetchInvoiceDetail,
  fetchStudentRedeemHistory,
  fetchAllRedemptionInvoices, // 🌟 Import Thunk mới
  //   fetchRedeemStats,
} from "../thunks/invoiceThunks";

interface InvoiceState {
  detail: Invoice | null;
  studentHistory: Invoice[];
  allRedemptions: Invoice[]; // 🌟 State mới: Lưu tất cả hóa đơn redeem
  //   stats: InvoiceStat | null;

  loadingDetail: boolean;
  loadingHistory: boolean;
  loadingAllRedemptions: boolean; // 🌟 Loading state mới
  loadingStats: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: InvoiceState = {
  detail: null,
  studentHistory: [],
  allRedemptions: [], // Khởi tạo mảng rỗng
  //   stats: null,
  loadingDetail: false,
  loadingHistory: false,
  loadingAllRedemptions: false, // Khởi tạo loading state
  loadingStats: false,
  saving: false,
  error: null,
};

const invoiceSlice = createSlice({
  name: "invoice",
  initialState,
  reducers: {
    resetDetail: (state) => {
      state.detail = null;
    },
    resetStudentHistory: (state) => {
      state.studentHistory = [];
    },
    // 🌟 Reducer mới: Reset danh sách tất cả hóa đơn redeem
    resetAllRedemptions: (state) => {
      state.allRedemptions = [];
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // A. LẤY DỮ LIỆU (READ)

      // FETCH INVOICE DETAIL (giữ nguyên)
      .addCase(fetchInvoiceDetail.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(
        fetchInvoiceDetail.fulfilled,
        (state, action: PayloadAction<Invoice>) => {
          state.loadingDetail = false;
          state.detail = action.payload;
        }
      )
      .addCase(fetchInvoiceDetail.rejected, (state, action) => {
        state.loadingDetail = false;
        state.detail = null;
        state.error =
          (action.payload as string) || "Không thể tải chi tiết hóa đơn.";
      })

      // FETCH STUDENT REDEEM HISTORY (giữ nguyên)
      .addCase(fetchStudentRedeemHistory.pending, (state) => {
        state.loadingHistory = true;
        state.error = null;
      })
      .addCase(
        fetchStudentRedeemHistory.fulfilled,
        (state, action: PayloadAction<Invoice[]>) => {
          state.loadingHistory = false;
          state.studentHistory = action.payload;
        }
      )
      .addCase(fetchStudentRedeemHistory.rejected, (state, action) => {
        state.loadingHistory = false;
        state.studentHistory = [];
        state.error =
          (action.payload as string) || "Không thể tải lịch sử redeem.";
      })

      // 🌟 FETCH ALL REDEMPTION INVOICES
      .addCase(fetchAllRedemptionInvoices.pending, (state) => {
        state.loadingAllRedemptions = true;
        state.error = null;
      })
      .addCase(
        fetchAllRedemptionInvoices.fulfilled,
        (state, action: PayloadAction<Invoice[]>) => {
          state.loadingAllRedemptions = false;
          state.allRedemptions = action.payload;
        }
      )
      .addCase(fetchAllRedemptionInvoices.rejected, (state, action) => {
        state.loadingAllRedemptions = false;
        state.allRedemptions = [];
        state.error =
          (action.payload as string) || "Không thể tải tất cả hóa đơn đổi quà.";
      })

      // B. THAO TÁC (WRITE: CREATE/UPDATE/CANCEL) - (giữ nguyên)

      // PENDING
      .addCase(createInvoice.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(markInvoiceAsDelivered.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(cancelInvoice.pending, (state) => {
        state.saving = true;
        state.error = null;
      })

      // CREATE INVOICE
      .addCase(createInvoice.fulfilled, (state) => {
        state.saving = false;
      })

      // MARK AS DELIVERED
      .addCase(markInvoiceAsDelivered.fulfilled, (state) => {
        state.saving = false;
      })

      // CANCEL INVOICE
      .addCase(
        cancelInvoice.fulfilled,
        (state, action: PayloadAction<Invoice>) => {
          state.saving = false;
          if (state.detail?.invoiceId === action.payload.invoiceId) {
            state.detail = action.payload;
          }
        }
      )

      // REJECTED
      .addCase(createInvoice.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) || "Lỗi tạo/thao tác hóa đơn.";
      })
      .addCase(markInvoiceAsDelivered.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) || "Lỗi đánh dấu đã giao.";
      })
      .addCase(cancelInvoice.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) || "Lỗi hủy hóa đơn.";
      });
  },
});

export const {
  resetDetail,
  resetStudentHistory,
  resetAllRedemptions,
  clearError,
} = invoiceSlice.actions;
export default invoiceSlice.reducer;
