// ⭐ Add missing type
import type { Invoice, InvoiceMeta } from "../types/invoice";
import type { RedemptionInvoiceResult } from "../types/invoice"; // nếu bạn để trong cùng file thì bỏ dòng này đi

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import {
  createInvoice,
  markInvoiceAsDelivered,
  cancelInvoice,
  fetchInvoiceDetail,
  fetchStudentRedeemHistory,
  fetchAllRedemptionInvoices,
} from "../thunks/invoiceThunks";

interface InvoiceState {
  detail: Invoice | null;
  studentHistory: Invoice[];

  allRedemptions: Invoice[];
  redemptionMeta: InvoiceMeta | null; // ⭐ Needed for pagination

  loadingDetail: boolean;
  loadingHistory: boolean;
  loadingAllRedemptions: boolean;
  loadingStats: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: InvoiceState = {
  detail: null,
  studentHistory: [],
  allRedemptions: [],
  redemptionMeta: null, // ⭐ init meta

  loadingDetail: false,
  loadingHistory: false,
  loadingAllRedemptions: false,
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
    resetAllRedemptions: (state) => {
      state.allRedemptions = [];
      state.redemptionMeta = null; // ⭐ Reset luôn meta
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH INVOICE DETAIL
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

      // FETCH STUDENT HISTORY
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

      // ⭐ FETCH ALL REDEMPTIONS
      .addCase(fetchAllRedemptionInvoices.pending, (state) => {
        state.loadingAllRedemptions = true;
        state.error = null;
      })
      .addCase(
        fetchAllRedemptionInvoices.fulfilled,
        (state, action: PayloadAction<RedemptionInvoiceResult>) => {
          state.loadingAllRedemptions = false;
          state.allRedemptions = action.payload.invoices;
          state.redemptionMeta = action.payload.meta; // ⭐ Save pagination meta
        }
      )
      .addCase(fetchAllRedemptionInvoices.rejected, (state, action) => {
        state.loadingAllRedemptions = false;
        state.allRedemptions = [];
        state.redemptionMeta = null;
        state.error =
          (action.payload as string) || "Không thể tải tất cả hóa đơn đổi quà.";
      })

      // WRITE ACTIONS
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

      .addCase(createInvoice.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(markInvoiceAsDelivered.fulfilled, (state) => {
        state.saving = false;
      })
      .addCase(
        cancelInvoice.fulfilled,
        (state, action: PayloadAction<Invoice>) => {
          state.saving = false;
          if (state.detail?.invoiceId === action.payload.invoiceId) {
            state.detail = action.payload;
          }
        }
      )

      .addCase(createInvoice.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) || "Lỗi tạo hóa đơn.";
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
