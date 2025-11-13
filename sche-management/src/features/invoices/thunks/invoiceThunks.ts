import { createAsyncThunk } from "@reduxjs/toolkit";
import InvoiceService from "../services/invoiceService"; // Import service vừa tạo
import type {
  CreateInvoice,
  Invoice,
  ProductInvoiceMasked,
} from "../types/invoice";
// Đảm bảo Import kiểu InvoiceStat

// --- 1. Thunks liên quan đến CRUD và Trạng thái ---

/** 🛒 Tạo hóa đơn (Redeem sản phẩm) */
export const createInvoice = createAsyncThunk<Invoice, CreateInvoice>(
  "invoice/create",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await InvoiceService.createInvoice(payload);
      return response;
    } catch (error: any) {
      console.error("❌ [createInvoice] Error:", error);
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

/** ✅ Đánh dấu hóa đơn đã giao */
export const markInvoiceAsDelivered = createAsyncThunk<
  ProductInvoiceMasked,
  { invoiceId: string }
>("invoice/markAsDelivered", async ({ invoiceId }, { rejectWithValue }) => {
  try {
    const response = await InvoiceService.markAsDelivered(invoiceId);
    return response;
  } catch (error: any) {
    console.error(
      `❌ [markInvoiceAsDelivered] Error for id=${invoiceId}:`,
      error
    );
    return rejectWithValue(error.response?.data || error.message);
  }
});

/** ↩️ Hủy hóa đơn */
export const cancelInvoice = createAsyncThunk<
  Invoice,
  string // invoiceId
>("invoice/cancel", async (invoiceId, { rejectWithValue }) => {
  try {
    const response = await InvoiceService.cancelInvoice(invoiceId);
    return response;
  } catch (error: any) {
    console.error(`❌ [cancelInvoice] Error for id=${invoiceId}:`, error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

// --- 2. Thunks liên quan đến Lấy dữ liệu ---

/** 🔎 Lấy chi tiết hóa đơn theo ID */
export const fetchInvoiceDetail = createAsyncThunk<
  Invoice,
  string // invoiceId
>("invoice/fetchDetail", async (invoiceId, { rejectWithValue }) => {
  try {
    const response = await InvoiceService.getInvoiceDetail(invoiceId);
    return response;
  } catch (error: any) {
    console.error(`❌ [fetchInvoiceDetail] Error for id=${invoiceId}:`, error);
    return rejectWithValue(error.response?.data || error.message);
  }
});

/** 📜 Lịch sử redeem của sinh viên */
export const fetchStudentRedeemHistory = createAsyncThunk<
  Invoice[],
  string // studentId
>("invoice/fetchStudentHistory", async (studentId, { rejectWithValue }) => {
  try {
    const response = await InvoiceService.getStudentRedeemHistory(studentId);
    return response;
  } catch (error: any) {
    console.error(
      `❌ [fetchStudentRedeemHistory] Error for studentId=${studentId}:`,
      error
    );
    return rejectWithValue(error.response?.data || error.message);
  }
});
