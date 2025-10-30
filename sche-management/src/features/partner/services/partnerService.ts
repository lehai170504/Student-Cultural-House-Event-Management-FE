import axiosInstance from "@/config/axiosInstance";
import type { Partner, CreatePartner } from "@/features/partner/types/partner";

const endpoint = "/partners";

export const partnerService = {
  /** 🔹 Lấy tất cả partner */
  async getAll(): Promise<Partner[]> {
    try {
      const res = await axiosInstance.get<Partner[]>(endpoint);
      return res.data;
    } catch (error) {
      console.error("❌ [getAll] Lỗi khi lấy danh sách partner:", error);
      throw error;
    }
  },

  /** 🔹 Tạo mới partner */
  async create(data: CreatePartner): Promise<Partner> {
    try {
      const res = await axiosInstance.post<Partner>(endpoint, data);
      return res.data;
    } catch (error) {
      console.error("❌ [create] Lỗi khi tạo partner:", error);
      throw error;
    }
  },
};
