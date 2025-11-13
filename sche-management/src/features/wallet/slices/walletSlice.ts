// src/features/wallet/slices/walletSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Wallet,
  WalletTransaction,
  ResponseWalletTopUpPartner,
  WalletTransactionResponse,
  PaginationMeta,
} from "../types/wallet";
import {
  fetchWalletById,
  fetchWalletTransactions,
  redeemCoins,
  rollbackTransaction,
  transferCoins,
  topUpPartnerCoins,
} from "../thunks/walletThunks";

interface WalletState {
  wallet: Wallet | null;
  transactions: WalletTransaction[];
  meta?: PaginationMeta; // thêm meta cho phân trang
  loading: boolean;
  error: string | null;
  lastMessage?: string | null;
}

const initialState: WalletState = {
  wallet: null,
  transactions: [],
  meta: undefined,
  loading: false,
  error: null,
  lastMessage: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    clearWalletError(state) {
      state.error = null;
    },
    clearWalletMessage(state) {
      state.lastMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---------------- Wallet ----------------
      .addCase(fetchWalletById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWalletById.fulfilled,
        (state, action: PayloadAction<Wallet>) => {
          state.loading = false;
          state.wallet = action.payload;
        }
      )
      .addCase(fetchWalletById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Get wallet failed";
      })

      // -------------- Transactions ----------------
      .addCase(fetchWalletTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWalletTransactions.fulfilled,
        (state, action: PayloadAction<WalletTransactionResponse>) => {
          state.loading = false;
          state.transactions = action.payload.data; // mảng transactions
          state.meta = action.payload.meta; // thông tin phân trang
        }
      )
      .addCase(fetchWalletTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Get transactions failed";
      })

      // ---------------- Transfer ----------------
      .addCase(
        transferCoins.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.lastMessage = action.payload.message;
        }
      )
      .addCase(transferCoins.rejected, (state, action) => {
        state.error = (action.payload as string) || "Transfer failed";
      })

      // ---------------- Rollback ----------------
      .addCase(
        rollbackTransaction.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.lastMessage = action.payload.message;
        }
      )
      .addCase(rollbackTransaction.rejected, (state, action) => {
        state.error = (action.payload as string) || "Rollback failed";
      })

      // ---------------- Redeem ----------------
      .addCase(
        redeemCoins.fulfilled,
        (state, action: PayloadAction<{ message: string }>) => {
          state.lastMessage = action.payload.message;
        }
      )
      .addCase(redeemCoins.rejected, (state, action) => {
        state.error = (action.payload as string) || "Redeem failed";
      })

      // ---------------- Top Up Partner ----------------
      .addCase(
        topUpPartnerCoins.fulfilled,
        (state, action: PayloadAction<ResponseWalletTopUpPartner>) => {
          const { amount } = action.payload;
          state.lastMessage = `Top up thành công: ${amount} coins đã được nạp.`;
        }
      )
      .addCase(topUpPartnerCoins.rejected, (state, action) => {
        state.error = (action.payload as string) || "Top up partner failed";
      });
  },
});

export const { clearWalletError, clearWalletMessage } = walletSlice.actions;
export default walletSlice.reducer;
