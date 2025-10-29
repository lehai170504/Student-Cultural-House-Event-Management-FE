import axiosInstance from "@/config/axiosInstance";
import {
  EventCategory,
  CreateEventCategory,
  UpdateEventCategory,
  EventCategoryDetail,
} from "@/features/eventCategories/types/eventCategories";

const endpoint = "/event-categories";

export const eventCategoryService = {
  /** 🔹 Lấy tất cả danh mục sự kiện */
  async getAll(): Promise<EventCategory[]> {
    try {
      console.log("📡 [getAll] Gọi API /event-categories...");
      const res = await axiosInstance.get<EventCategory[]>(endpoint);
      console.log("✅ [getAll] API trả về:", res.data);
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
  async getById(id: number): Promise<EventCategoryDetail> {
    try {
      const res = await axiosInstance.get<EventCategoryDetail>(
        `${endpoint}/${id}`
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ [getById] Lỗi khi lấy danh mục sự kiện ID ${id}:`,
        error
      );
      throw error;
    }
  },

  /** 🔹 Tạo mới danh mục sự kiện */
  async create(data: CreateEventCategory): Promise<EventCategoryDetail> {
    try {
      const res = await axiosInstance.post<EventCategoryDetail>(endpoint, data);
      return res.data;
    } catch (error) {
      console.error("❌ [create] Lỗi khi tạo danh mục sự kiện:", error);
      throw error;
    }
  },

  /** 🔹 Cập nhật danh mục sự kiện theo ID */
  async update(
    id: number,
    data: UpdateEventCategory
  ): Promise<EventCategoryDetail> {
    try {
      const res = await axiosInstance.put<EventCategoryDetail>(
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
