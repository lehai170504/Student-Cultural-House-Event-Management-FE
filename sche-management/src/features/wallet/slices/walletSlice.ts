// src/features/wallet/slices/walletSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Wallet, WalletTransaction } from "../types/wallet";
import {
  fetchWalletById,
  fetchWalletTransactions,
  redeemCoins,
  rollbackTransaction,
  transferCoins,
} from "../thunks/walletThunks";

interface WalletState {
  wallet: Wallet | null;
  transactions: WalletTransaction[];
  loading: boolean;
  error: string | null;
  lastMessage?: string | null;
}

const initialState: WalletState = {
  wallet: null,
  transactions: [],
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
      .addCase(fetchWalletTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchWalletTransactions.fulfilled,
        (state, action: PayloadAction<WalletTransaction[]>) => {
          state.loading = false;
          state.transactions = action.payload;
        }
      )
      .addCase(fetchWalletTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Get transactions failed";
      })
      .addCase(transferCoins.fulfilled, (state, action) => {
        state.lastMessage = action.payload.message;
      })
      .addCase(transferCoins.rejected, (state, action) => {
        state.error = (action.payload as string) || "Transfer failed";
      })
      .addCase(rollbackTransaction.fulfilled, (state, action) => {
        state.lastMessage = action.payload.message;
      })
      .addCase(rollbackTransaction.rejected, (state, action) => {
        state.error = (action.payload as string) || "Rollback failed";
      })
      .addCase(redeemCoins.fulfilled, (state, action) => {
        state.lastMessage = action.payload.message;
      })
      .addCase(redeemCoins.rejected, (state, action) => {
        state.error = (action.payload as string) || "Redeem failed";
      });
  },
});

export const { clearWalletError, clearWalletMessage } = walletSlice.actions;
export default walletSlice.reducer;


