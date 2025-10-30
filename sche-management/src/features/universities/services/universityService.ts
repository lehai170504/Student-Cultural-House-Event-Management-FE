// src/features/universities/services/universityService.ts
import axiosInstance from "@/config/axiosInstance";
import { University } from "../types/universities";

const endpoint = "/universities";

export const universityService = {
  /** 🔹 Lấy tất cả universities với filter tùy chọn */
  async getAll(params?: Record<string, any>): Promise<University[]> {
    try {
      const res = await axiosInstance.get(endpoint, { params });
      // Backend có thể trả về { status, message, data } hoặc trả thẳng mảng
      const payload = res.data;
      const list: University[] = Array.isArray(payload)
        ? payload
        : payload?.data ?? [];
      return list;
    } catch (error) {
      console.error(
        "❌ [getAll] Lỗi khi lấy danh sách các trường đại học:",
        error
      );
      throw error;
    }
  },
};
