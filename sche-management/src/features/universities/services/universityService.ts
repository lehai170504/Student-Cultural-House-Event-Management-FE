// src/features/universities/services/universityService.ts
import axiosInstance from "@/config/axiosInstance";
import {
  CreateUniversity,
  University,
  UpdateUniversity,
} from "../types/universities";
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/utils/apiResponse";

const endpoint = "/universities";
const endpoint2 = "/admin/universities";

export const universityService = {
  /** 🔹 Lấy tất cả universities với pagination (format mới: { data: [...], meta: {...} }) */
  async getAll(
    params?: PaginationParams
  ): Promise<PaginatedResponse<University>> {
    try {
      // Mặc định: page=1, size=10, không có sort
      const queryParams: Record<string, any> = {
        page: params?.page ?? 1,
        size: params?.size ?? 10,
        // sort không được include theo yêu cầu
      };

      const res = await axiosInstance.get<any>(endpoint, {
        params: queryParams,
      });
      
      // Format mới: { data: [...], meta: { currentPage, pageSize, totalPages, totalItems } }
      const responseData = res.data;
      
      // Nếu có wrap trong { status, message, data } thì lấy data
      if (responseData?.data && Array.isArray(responseData.data) && responseData.meta) {
        return responseData as PaginatedResponse<University>;
      }
      
      // Nếu trả về trực tiếp { data, meta }
      if (responseData?.data && responseData?.meta) {
        return responseData as PaginatedResponse<University>;
      }
      
      // Fallback: giả sử responseData là PaginatedResponse trực tiếp
      return responseData as PaginatedResponse<University>;
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
