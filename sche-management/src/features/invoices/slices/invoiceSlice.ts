import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Invoice } from "../types/invoice";
import {
  createInvoice,
  markInvoiceAsDelivered,
  cancelInvoice,
  fetchInvoiceDetail,
  fetchStudentRedeemHistory,
  //   fetchRedeemStats,
} from "../thunks/invoiceThunks";

interface InvoiceState {
  detail: Invoice | null;
  studentHistory: Invoice[];
  //   stats: InvoiceStat | null;

  loadingDetail: boolean;
  loadingHistory: boolean;
  loadingStats: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: InvoiceState = {
  detail: null,
  studentHistory: [],
  //   stats: null,
  loadingDetail: false,
  loadingHistory: false,
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
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // A. LẤY DỮ LIỆU (READ)

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

      // FETCH STUDENT REDEEM HISTORY
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

      // B. THAO TÁC (WRITE: CREATE/UPDATE/CANCEL)

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

export const { resetDetail, resetStudentHistory, clearError } =
  invoiceSlice.actions;
export default invoiceSlice.reducer;
