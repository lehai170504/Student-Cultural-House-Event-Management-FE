// src/features/wallet/services/walletService.ts
import axiosInstance from "@/config/axiosInstance";
import type {
  Wallet,
  WalletTransaction,
  TransferRequest,
  RollbackRequest,
  RedeemRequest,
  RequestWalletTopUpPartner,
  ResponseWalletTopUpPartner,
} from "../types/wallet";

const endpoint = "/wallets";
const adminTopupEndpoint = "/admin/wallets/topup";

export const walletService = {
  async transfer(payload: TransferRequest): Promise<{ message: string }> {
    const res = await axiosInstance.post(`${endpoint}/transfer`, payload);
    return res.data;
  },

  async rollback(payload: RollbackRequest): Promise<{ message: string }> {
    const res = await axiosInstance.post(`${endpoint}/rollback`, payload);
    return res.data;
  },

  async redeem(payload: RedeemRequest): Promise<{ message: string }> {
    const res = await axiosInstance.post(`${endpoint}/redeem`, payload);
    return res.data;
  },

  async getById(id: number): Promise<Wallet> {
    const res = await axiosInstance.get(`${endpoint}/${id}`);
    return res.data?.data ?? res.data;
  },

  async getTransactions(
    id: number,
    params?: Record<string, any>
  ): Promise<WalletTransaction[]> {
    const res = await axiosInstance.get(`${endpoint}/${id}/transactions`, {
      params,
    });
    return res.data?.data ?? res.data;
  },

  async topUpPartner(
    payload: RequestWalletTopUpPartner // Sử dụng RequestWalletTopUpPartner mới
  ): Promise<ResponseWalletTopUpPartner> {
    const res = await axiosInstance.post<ResponseWalletTopUpPartner>(
      adminTopupEndpoint,
      payload
    );
    return res.data;
  },
};
