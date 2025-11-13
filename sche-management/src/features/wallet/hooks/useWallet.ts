"use client";

import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchWalletById,
  fetchWalletTransactions,
  redeemCoins,
  rollbackTransaction,
  transferCoins,
  topUpPartnerCoins,
} from "../thunks/walletThunks";
import type {
  RedeemRequest,
  RollbackRequest,
  TransferRequest,
  RequestWalletTopUpPartner,
  WalletTransactionResponse,
} from "../types/wallet";

export const useWallet = () => {
  const dispatch = useAppDispatch();
  const {
    wallet,
    transactions = [],
    meta,
    loading,
    error,
    lastMessage,
  } = useAppSelector((s) => (s as any).wallet || {});

  // ---------------- Wallet ----------------
  const loadWallet = useCallback(
    (id: string) => {
      return dispatch(fetchWalletById(id));
    },
    [dispatch]
  );

  // ---------------- Transactions ----------------
  const loadTransactions = useCallback(
    async (
      params?: Record<string, any>
    ): Promise<WalletTransactionResponse & { error?: string }> => {
      try {
        const result: WalletTransactionResponse = await dispatch(
          fetchWalletTransactions({ params })
        ).unwrap();

        return result;
      } catch (err: any) {
        console.error("Load transactions failed:", err);
        // fallback data
        return {
          data: [],
          meta: { currentPage: 1, pageSize: 10, totalPages: 0, totalItems: 0 },
          error: err?.message || "Unknown error",
        };
      }
    },
    [dispatch]
  );

  // ---------------- Transfer ----------------
  const doTransfer = useCallback(
    (payload: TransferRequest) => {
      return dispatch(transferCoins(payload));
    },
    [dispatch]
  );

  // ---------------- Rollback ----------------
  const doRollback = useCallback(
    (payload: RollbackRequest) => {
      return dispatch(rollbackTransaction(payload));
    },
    [dispatch]
  );

  // ---------------- Redeem ----------------
  const doRedeem = useCallback(
    (payload: RedeemRequest) => {
      return dispatch(redeemCoins(payload));
    },
    [dispatch]
  );

  // ---------------- Top Up Partner ----------------
  const doTopUpPartner = useCallback(
    (payload: RequestWalletTopUpPartner) => {
      return dispatch(topUpPartnerCoins(payload));
    },
    [dispatch]
  );

  return {
    wallet,
    transactions,
    meta, // ✅ thêm meta
    loading,
    error,
    lastMessage,
    loadWallet,
    loadTransactions,
    doTransfer,
    doRollback,
    doRedeem,
    doTopUpPartner,
  };
};
