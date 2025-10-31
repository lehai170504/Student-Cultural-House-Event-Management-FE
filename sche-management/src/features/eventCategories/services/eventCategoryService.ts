import axiosInstance from "@/config/axiosInstance";
import {
  EventCategory,
  CreateEventCategory,
  UpdateEventCategory,
  EventCategoryDetail,
  EventCategoryResponse,
} from "@/features/eventCategories/types/eventCategories";

const endpoint = "/event-categories";

export const eventCategoryService = {
  /** 🔹 Lấy tất cả danh mục sự kiện */
  async getAll(): Promise<EventCategoryResponse> {
    try {
      const res = await axiosInstance.get<EventCategoryResponse>(endpoint);
      return res.data;
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
      const res = await axiosInstance.get<EventCategoryDetail>(
        `${endpoint}/${id}`
      );
      return res.data.data;
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
