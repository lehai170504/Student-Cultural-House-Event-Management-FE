import axiosInstance from "@/config/axiosInstance";
import type {
  Partner,
  CreatePartner,
  PartnerRepsonse,
} from "@/features/partner/types/partner";

const endpoint = "/admin/partners";

export const partnerService = {
  /** 🔹 Lấy tất cả partner */
  async getAll(): Promise<Partner[]> {
    try {
      const res = await axiosInstance.get<PartnerRepsonse>(endpoint);
      return res.data.data;
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

  /** 🔹 Cập nhật trạng thái partner */
  async updateStatus(
    id: number,
    status: "ACTIVE" | "INACTIVE"
  ): Promise<Partner> {
    try {
      const res = await axiosInstance.patch<Partner>(
        `${endpoint}/${id}/status`,
        { status }
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ [updateStatus] Lỗi khi cập nhật trạng thái partner id=${id}:`,
        error
      );
      throw error;
    }
  },
};
