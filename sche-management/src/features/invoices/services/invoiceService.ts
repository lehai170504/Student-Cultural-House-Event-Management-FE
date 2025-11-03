import axiosInstance from "@/config/axiosInstance";
import { CreateInvoice, Invoice, ProductInvoiceMasked } from "../types/invoice";

// Định nghĩa chung cho Invoice Service
const endpoint = "/invoices";

const InvoiceService = {
  // --- 1. Tạo Hóa đơn (Redeem) ---

  /** 🛒 Tạo hóa đơn khi redeem product và trừ balance: POST /api/v1/invoices */
  async createInvoice(payload: CreateInvoice): Promise<Invoice> {
    try {
      // payload chứa thông tin cần thiết để redeem sản phẩm
      const res = await axiosInstance.post<Invoice>(endpoint, payload);
      return res.data;
    } catch (error) {
      console.error("❌ [createInvoice] Error creating invoice:", error);
      throw error;
    }
  },

  // --- 2. Cập nhật Trạng thái Hóa đơn ---
  async markAsDelivered(
    invoiceId: string,
    deliveredBy: string
  ): Promise<ProductInvoiceMasked> {
    try {
      const res = await axiosInstance.put<ProductInvoiceMasked>(
        `${endpoint}/${invoiceId}/deliver`,
        null,
        {
          params: {
            deliveredBy: deliveredBy,
          },
        }
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
      // Thường các API POST/PUT không cần truyền data cho hành động đơn giản
      const res = await axiosInstance.post<Invoice>(
        `${endpoint}/${invoiceId}/cancel`
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
      const res = await axiosInstance.get<Invoice>(`${endpoint}/${invoiceId}`);
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
        `${endpoint}/students/${studentId}`
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

  /** 📊 Thống kê redeem: GET /api/v1/invoices/stats */
  //   async getRedeemStats(): Promise<InvoiceStat> {
  //     try {
  //       const res = await axiosInstance.get<InvoiceStat>(`${endpoint}/stats`);
  //       return res.data;
  //     } catch (error) {
  //       console.error("❌ [getRedeemStats] Error fetching redeem stats:", error);
  //       throw error;
  //     }
  //   },
};

export default InvoiceService;
