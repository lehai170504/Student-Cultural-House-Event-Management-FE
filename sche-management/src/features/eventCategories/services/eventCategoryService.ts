import axiosInstance from "@/config/axiosInstance";
import {
  EventCategory,
  CreateEventCategory,
  UpdateEventCategory,
  EventCategoryDetail,
  EventCategoryResponse,
} from "@/features/eventCategories/types/eventCategories";
import type {
  PaginatedResponse,
  PaginationParams,
} from "@/utils/apiResponse";

const endpoint = "/event-categories";

export const eventCategoryService = {
  /** 🔹 Lấy tất cả danh mục sự kiện với pagination (format mới: { data: [...], meta: {...} }) */
  async getAll(
    params?: PaginationParams
  ): Promise<PaginatedResponse<EventCategory>> {
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
      
      // Nếu có wrap trong { status, message, data } hoặc trả về trực tiếp { data, meta }
      if (responseData?.data && Array.isArray(responseData.data) && responseData.meta) {
        return responseData as PaginatedResponse<EventCategory>;
      }
      
      // Nếu là format cũ { status, message, data: [...] }, convert sang format mới
      if (responseData?.data && Array.isArray(responseData.data) && responseData.status) {
        return {
          data: responseData.data,
          meta: {
            currentPage: 1,
            pageSize: responseData.data.length,
            totalPages: 1,
            totalItems: responseData.data.length,
          },
        };
      }
      
      // Fallback: giả sử responseData là PaginatedResponse trực tiếp
      return responseData as PaginatedResponse<EventCategory>;
    } catch (error) {
      console.error(
        "❌ [getAll] Lỗi khi lấy danh sách danh mục sự kiện:",
        error
      );
      throw error;
    }
  },

  /** 🔹 Lấy chi tiết danh mục sự kiện theo ID */
  async getById(id: number): Promise<EventCategory> {
    try {
      const res = await axiosInstance.get<any>(
        `${endpoint}/${id}`
      );
      // BE giờ trả về data trực tiếp hoặc wrap trong { data: {...} }
      return res.data?.data ?? res.data;
    } catch (error) {
      console.error(
        `❌ [getById] Lỗi khi lấy danh mục sự kiện ID ${id}:`,
        error
      );
      throw error;
    }
  },
  /** 🔹 Tạo mới danh mục sự kiện */
  async create(data: CreateEventCategory): Promise<EventCategory> {
    try {
      const res = await axiosInstance.post<EventCategory>(endpoint, data);
      return res.data;
    } catch (error) {
      console.error("❌ [create] Lỗi khi tạo danh mục sự kiện:", error);
      throw error;
    }
  },

  /** 🔹 Cập nhật danh mục sự kiện theo ID */
  async update(id: number, data: UpdateEventCategory): Promise<EventCategory> {
    try {
      const res = await axiosInstance.put<EventCategory>(
        `${endpoint}/${id}`,
        data
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ [update] Lỗi khi cập nhật danh mục sự kiện ID ${id}:`,
        error
      );
      throw error;
    }
  },

  /** 🔹 Xoá danh mục sự kiện theo ID */
  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
    } catch (error) {
      console.error(
        `❌ [delete] Lỗi khi xoá danh mục sự kiện ID ${id}:`,
        error
      );
      throw error;
    }
  },
};
