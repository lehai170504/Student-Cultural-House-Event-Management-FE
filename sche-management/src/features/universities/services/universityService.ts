// src/features/universities/services/universityService.ts
import axiosInstance from "@/config/axiosInstance";
import {
  CreateUniversity,
  University,
  UpdateUniversity,
} from "../types/universities";

const endpoint = "/universities";
const endpoint2 = "/admin/universities";

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

  /** 🔹 Tạo mới university */
  async create(data: CreateUniversity): Promise<University> {
    try {
      const res = await axiosInstance.post<University>(endpoint2, data);
      return res.data;
    } catch (error) {
      console.error("❌ [create] Lỗi khi tạo university:", error);
      throw error;
    }
  },

  /** 🔹 Cập nhật university theo ID */
  async update(id: number, data: UpdateUniversity): Promise<University> {
    try {
      const res = await axiosInstance.put<University>(
        `${endpoint2}/${id}`,
        data
      );
      return res.data;
    } catch (error) {
      console.error(`❌ [update] Lỗi khi cập nhật university ID ${id}:`, error);
      throw error;
    }
  },

  /** 🔹 Xoá university theo ID */
  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${endpoint2}/${id}`);
    } catch (error) {
      console.error(`❌ [delete] Lỗi khi xóa university ID ${id}:`, error);
      throw error;
    }
  },
};
