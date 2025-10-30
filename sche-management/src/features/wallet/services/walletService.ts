// src/features/wallet/services/walletService.ts
import axiosInstance from "@/config/axiosInstance";
import type {
  Wallet,
  WalletTransaction,
  TransferRequest,
  RollbackRequest,
  RedeemRequest,
} from "../types/wallet";

const endpoint = "/wallets"; // baseURL already contains /api/v1

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
};


