import axiosInstance from "@/config/axiosInstance";
import type { FeedbackResponse } from "../types/feedback";
import type { PaginationParams } from "@/utils/apiResponse";

// Mở rộng PaginationParams để hỗ trợ filter bất kỳ trường nào, ví dụ eventId
export interface FeedbackPaginationParams extends PaginationParams {
  eventId?: string;
}

const endpoint = "/admin/feedback";

export const feedbackService = {
  /** 🔹 Lấy tất cả feedback với pagination và optional filter eventId */
  async getAll(params?: FeedbackPaginationParams): Promise<FeedbackResponse> {
    try {
      // Chỉ include các param hợp lệ
      const queryParams: Record<string, any> = {
        page: params?.page ?? 1,
        size: params?.size ?? 10,
      };

      if (params?.eventId) queryParams.eventId = params.eventId;

      const res = await axiosInstance.get<any>(endpoint, {
        params: queryParams,
      });

      const responseData = res.data;
      if (responseData?.data && responseData?.meta) {
        return responseData as FeedbackResponse;
      }

      return responseData as FeedbackResponse;
    } catch (error) {
      console.error("❌ [getAll] Lỗi khi lấy danh sách feedback:", error);
      throw error;
    }
  },
};
