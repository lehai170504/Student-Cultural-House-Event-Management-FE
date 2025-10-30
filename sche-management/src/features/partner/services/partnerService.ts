import axiosInstance from "@/config/axiosInstance";
import type {
  Partner,
  CreatePartner,
  PartnerRepsonse,
} from "@/features/partner/types/partner";
import type { Wallet, WalletTransaction } from "@/features/wallet/types/wallet";

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

  /** 🔹 Partner nạp quỹ cho sự kiện */
  async fundEvent(
    partnerId: number | string,
    payload: { eventId: number | string; amount: number | string }
  ): Promise<{ message: string }> {
    const res = await axiosInstance.post(
      `${endpoint}/${partnerId}/fund-event`,
      payload
    );
    return res.data;
  },

  /** 🔹 Partner gửi broadcast đến người tham dự */
  async broadcast(
    partnerId: number | string,
    payload: Record<string, any>
  ): Promise<{ message: string }> {
    const res = await axiosInstance.post(
      `${endpoint}/${partnerId}/broadcast`,
      payload
    );
    return res.data;
  },

  /** 🔹 Lấy ví của partner */
  async getWallet(partnerId: number | string): Promise<Wallet> {
    const res = await axiosInstance.get(`${endpoint}/${partnerId}/wallet`);
    return res.data?.data ?? res.data;
  },

  /** 🔹 Lịch sử ví của partner */
  async getWalletHistory(
    partnerId: number | string,
    params?: Record<string, any>
  ): Promise<WalletTransaction[]> {
    const res = await axiosInstance.get(
      `${endpoint}/${partnerId}/wallet/history`,
      { params }
    );
    return res.data?.data ?? res.data;
  },

  /** 🔹 Sự kiện do partner tổ chức */
  async getEvents(
    partnerId: number | string,
    params?: Record<string, any>
  ): Promise<any[]> {
    const res = await axiosInstance.get(`${endpoint}/${partnerId}/events`, {
      params,
    });
    return res.data?.data ?? res.data;
  },

  /** 🔹 Lấy partner theo id */
  async getById(id: number | string): Promise<Partner> {
    const res = await axiosInstance.get(`${endpoint}/${id}`);
    return res.data?.data ?? res.data;
  },
};
