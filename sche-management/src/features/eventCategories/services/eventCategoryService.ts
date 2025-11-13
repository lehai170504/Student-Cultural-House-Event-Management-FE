// src/features/eventCategories/services/eventCategoryService.ts
import axiosInstance from "@/config/axiosInstance";
import {
  EventCategory,
  CreateEventCategory,
  UpdateEventCategory,
  EventCategoryResponse,
  EventCategoryDetail,
} from "@/features/eventCategories/types/eventCategories";

const endpoint = "/event-categories";

export const eventCategoryService = {
  // Lấy tất cả danh mục sự kiện (trả về EventCategory[])
  async getAll(): Promise<EventCategory[]> {
    try {
      const res = await axiosInstance.get<EventCategoryResponse>(endpoint);
      return res.data.data; // Trả về mảng EventCategory
    } catch (error) {
      console.error("❌ Lỗi khi tải danh sách danh mục sự kiện:", error);
      throw error;
    }
  },

  // Lấy chi tiết danh mục theo ID
  async getById(id: string): Promise<EventCategoryDetail> {
    try {
      const res = await axiosInstance.get<EventCategoryDetail>(
        `${endpoint}/${id}`
      );
      return res.data;
    } catch (error) {
      console.error(`❌ Lỗi khi lấy danh mục sự kiện ID ${id}:`, error);
      throw error;
    }
  },

  // Tạo danh mục mới
  async create(data: CreateEventCategory): Promise<EventCategory> {
    try {
      const res = await axiosInstance.post<EventCategory>(
        `/admin${endpoint}`,
        data
      );
      return res.data;
    } catch (error) {
      console.error("❌ Lỗi khi tạo danh mục sự kiện:", error);
      throw error;
    }
  },

  // Cập nhật danh mục
  async update(id: string, data: UpdateEventCategory): Promise<EventCategory> {
    try {
      const res = await axiosInstance.put<EventCategory>(
        `${endpoint}/${id}`,
        data
      );
      return res.data;
    } catch (error) {
      console.error(`❌ Lỗi khi cập nhật danh mục sự kiện ID ${id}:`, error);
      throw error;
    }
  },

  // Xoá danh mục
  async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`/admin${endpoint}/${id}`);
    } catch (error) {
      console.error(`❌ Lỗi khi xoá danh mục sự kiện ID ${id}:`, error);
      throw error;
    }
  },
};
