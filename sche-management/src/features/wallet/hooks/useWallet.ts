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
} from "../types/wallet";

export const useWallet = () => {
  const dispatch = useAppDispatch();
  const { wallet, transactions, loading, error, lastMessage } = useAppSelector(
    (s) => (s as any).wallet || {}
  );

  const loadWallet = useCallback(
    (id: number) => {
      return dispatch(fetchWalletById(id));
    },
    [dispatch]
  );

  const loadTransactions = useCallback(
    (id: number, params?: Record<string, any>) => {
      return dispatch(fetchWalletTransactions({ id, params }));
    },
    [dispatch]
  );

  const doTransfer = useCallback(
    (payload: TransferRequest) => {
      return dispatch(transferCoins(payload));
    },
    [dispatch]
  );

  const doRollback = useCallback(
    (payload: RollbackRequest) => {
      return dispatch(rollbackTransaction(payload));
    },
    [dispatch]
  );

  const doRedeem = useCallback(
    (payload: RedeemRequest) => {
      return dispatch(redeemCoins(payload));
    },
    [dispatch]
  );

  const doTopUpPartner = useCallback(
    (payload: RequestWalletTopUpPartner) => {
      return dispatch(topUpPartnerCoins(payload));
    },
    [dispatch]
  );

  return {
    wallet,
    transactions,
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
