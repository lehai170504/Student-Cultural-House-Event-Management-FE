// eventCategoryService.ts (Phiên bản đã tối ưu hóa)
import axiosInstance from "@/config/axiosInstance";
import {
  EventCategory,
  CreateEventCategory,
  UpdateEventCategory,
  EventCategoryResponse,
} from "@/features/eventCategories/types/eventCategories";

const endpoint = "/event-categories";

export const eventCategoryService = {
  // ✅ Đã sạch: Chỉ định kiểu chuẩn và trả về res.data
  async getAll(): Promise<EventCategory[]> {
    try {
      // 1. Gọi API, mong đợi trả về PaginatedResponse
      const res = await axiosInstance.get<EventCategoryResponse>(endpoint);

      // 2. Trả về mảng data (EventCategory[])
      return res.data.data;
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách danh mục sự kiện:", error);
      throw error;
    }
  },

  // ✅ Đã tối ưu hóa: Loại bỏ res.data?.data ?? res.data và kiểu any
  async getById(id: number): Promise<EventCategory> {
    try {
      // Chỉ định kiểu EventCategory
      const res = await axiosInstance.get<EventCategory>(`${endpoint}/${id}`);
      return res.data; // Trả về data thuần
    } catch (error) {
      console.error(`❌ Lỗi khi lấy danh mục sự kiện ID ${id}:`, error);
      throw error;
    }
  },

  // ✅ Đã tối ưu hóa: Loại bỏ res.data?.data ?? res.data và kiểu any
  async create(data: CreateEventCategory): Promise<EventCategory> {
    try {
      const res = await axiosInstance.post<EventCategory>(endpoint, data);
      return res.data; // Trả về data thuần
    } catch (error) {
      console.error("❌ Lỗi khi tạo danh mục sự kiện:", error);
      throw error;
    }
  },

  // ✅ Đã tối ưu hóa: Loại bỏ res.data?.data ?? res.data và kiểu any
  async update(id: number, data: UpdateEventCategory): Promise<EventCategory> {
    try {
      const res = await axiosInstance.put<EventCategory>(
        `${endpoint}/${id}`,
        data
      );
      return res.data; // Trả về data thuần
    } catch (error) {
      console.error(`❌ Lỗi khi cập nhật danh mục sự kiện ID ${id}:`, error);
      throw error;
    }
  },

  // Giữ nguyên: Delete không cần thay đổi
  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
    } catch (error) {
      console.error(`❌ Lỗi khi xoá danh mục sự kiện ID ${id}:`, error);
      throw error;
    }
  },
};
