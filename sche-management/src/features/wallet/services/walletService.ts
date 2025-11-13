// src/features/wallet/services/walletService.ts
import axiosInstance from "@/config/axiosInstance";
import type {
  Wallet,
  TransferRequest,
  RollbackRequest,
  RedeemRequest,
  RequestWalletTopUpPartner,
  ResponseWalletTopUpPartner,
  WalletTransactionResponse,
} from "../types/wallet";

const endpoint = "/wallets";
const endpoint2 = "/admin/wallets";

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

  async getById(id: string): Promise<Wallet> {
    const res = await axiosInstance.get(`${endpoint}/${id}`);
    return res.data?.data ?? res.data;
  },

  async getTransactions(
    params?: Record<string, any>
  ): Promise<WalletTransactionResponse> {
    const res = await axiosInstance.get<WalletTransactionResponse>(
      `${endpoint2}/transactions`,
      { params }
    );

    const response: WalletTransactionResponse = {
      data: Array.isArray(res.data?.data) ? res.data.data : [],
      meta: res.data?.meta ?? {
        currentPage: 1,
        pageSize: 10,
        totalPages: 1,
        totalItems: 0,
      },
    };

    return response;
  },

  async topUpPartner(
    payload: RequestWalletTopUpPartner
  ): Promise<ResponseWalletTopUpPartner> {
    const res = await axiosInstance.post<ResponseWalletTopUpPartner>(
      `${endpoint2}/topup`,
      payload
    );
    return res.data;
  },
};
