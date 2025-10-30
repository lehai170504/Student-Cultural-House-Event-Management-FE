// src/features/wallet/thunks/walletThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { walletService } from "../services/walletService";
import type {
  Wallet,
  WalletTransaction,
  TransferRequest,
  RollbackRequest,
  RedeemRequest,
  RequestWalletTopUpPartner,
  ResponseWalletTopUpPartner,
} from "../types/wallet";

export const transferCoins = createAsyncThunk<
  { message: string },
  TransferRequest,
  { rejectValue: string }
>("wallet/transfer", async (payload, { rejectWithValue }) => {
  try {
    return await walletService.transfer(payload);
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || "Transfer failed");
  }
});

export const rollbackTransaction = createAsyncThunk<
  { message: string },
  RollbackRequest,
  { rejectValue: string }
>("wallet/rollback", async (payload, { rejectWithValue }) => {
  try {
    return await walletService.rollback(payload);
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || "Rollback failed");
  }
});

export const redeemCoins = createAsyncThunk<
  { message: string },
  RedeemRequest,
  { rejectValue: string }
>("wallet/redeem", async (payload, { rejectWithValue }) => {
  try {
    return await walletService.redeem(payload);
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || "Redeem failed");
  }
});

/** 🔹 Admin Top Up Coin for Partner */
export const topUpPartnerCoins = createAsyncThunk<
  ResponseWalletTopUpPartner,
  RequestWalletTopUpPartner,
  { rejectValue: string }
>("wallet/topUpPartner", async (payload, { rejectWithValue }) => {
  try {
    return await walletService.topUpPartner(payload);
  } catch (e: any) {
    return rejectWithValue(
      e?.response?.data?.message || "Top up partner failed"
    );
  }
});

export const fetchWalletById = createAsyncThunk<
  Wallet,
  number,
  { rejectValue: string }
>("wallet/getById", async (id, { rejectWithValue }) => {
  try {
    return await walletService.getById(id);
  } catch (e: any) {
    return rejectWithValue(e?.response?.data?.message || "Get wallet failed");
  }
});

export const fetchWalletTransactions = createAsyncThunk<
  WalletTransaction[],
  { id: number; params?: Record<string, any> },
  { rejectValue: string }
>("wallet/getTransactions", async ({ id, params }, { rejectWithValue }) => {
  try {
    return await walletService.getTransactions(id, params);
  } catch (e: any) {
    return rejectWithValue(
      e?.response?.data?.message || "Get transactions failed"
    );
  }
});
