import axiosInstance from "@/config/axiosInstance";
import { CreateInvoice, Invoice, ProductInvoiceMasked } from "../types/invoice";

const BASE_ENDPOINT = "/invoices";
const REDEMPTION_ENDPOINT = "/redemptions/invoices";

const InvoiceService = {
  async createInvoice(payload: CreateInvoice): Promise<Invoice> {
    try {
      // payload chứa thông tin cần thiết để redeem sản phẩm
      const res = await axiosInstance.post<Invoice>(BASE_ENDPOINT, payload);
      return res.data;
    } catch (error) {
      console.error("❌ [createInvoice] Error creating invoice:", error);
      throw error;
    }
  },

  // --- 2. Cập nhật Trạng thái Hóa đơn ---
  async markAsDelivered(invoiceId: string): Promise<ProductInvoiceMasked> {
    try {
      const res = await axiosInstance.put<ProductInvoiceMasked>(
        `${BASE_ENDPOINT}/${invoiceId}/confirm-delivery`
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ [markAsDelivered] Error delivering invoice ${invoiceId}:`,
        error
      );
      throw error;
    }
  },
  async cancelInvoice(invoiceId: string): Promise<Invoice> {
    try {
      const res = await axiosInstance.post<Invoice>(
        `${BASE_ENDPOINT}/${invoiceId}/cancel`
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ [cancelInvoice] Error canceling invoice ${invoiceId}:`,
        error
      );
      throw error;
    }
  },

  // --- 3. Lấy Dữ liệu Hóa đơn ---
  async getInvoiceDetail(invoiceId: string): Promise<Invoice> {
    try {
      const res = await axiosInstance.get<Invoice>(
        `${BASE_ENDPOINT}/${invoiceId}`
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ [getInvoiceDetail] Error fetching invoice detail ${invoiceId}:`,
        error
      );
      throw error;
    }
  },
  async getStudentRedeemHistory(studentId: string): Promise<Invoice[]> {
    try {
      // Endpoint hơi khác: /api/v1/invoices/students/{studentId}
      const res = await axiosInstance.get<Invoice[]>(
        `${BASE_ENDPOINT}/students/${studentId}`
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ [getStudentRedeemHistory] Error fetching history for student ${studentId}:`,
        error
      );
      throw error;
    }
  },

  /** 🌟 NEW: Lấy danh sách TẤT CẢ hóa đơn redeem: GET /api/v1/redemptions/invoices */
  async getAllRedemptionInvoices(): Promise<Invoice[]> {
    try {
      const res = await axiosInstance.get<Invoice[]>(REDEMPTION_ENDPOINT);
      return res.data;
    } catch (error) {
      console.error(
        "❌ [getAllRedemptionInvoices] Error fetching all redemption invoices:",
        error
      );
      throw error;
    }
  },
};

export default InvoiceService;
