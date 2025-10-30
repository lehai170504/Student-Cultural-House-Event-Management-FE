import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Partner } from "@/features/partner/types/partner";
import type { Wallet, WalletTransaction } from "@/features/wallet/types/wallet";
import {
  fetchAllPartners,
  createPartner,
  fetchPartnerById,
  fetchPartnerEvents,
  fetchPartnerWallet,
  fetchPartnerWalletHistory,
  fundEventByPartner,
  broadcastByPartner,
} from "../thunks/partnerThunks";

interface PartnerState {
  list: Partner[];
  loadingList: boolean;
  saving: boolean;
  error: string | null;
  partnerDetail: Partner | null;
  loadingDetail: boolean;
  wallet: Wallet | null;
  transactions: WalletTransaction[];
  loadingWallet: boolean;
  loadingTransactions: boolean;
  events: any[];
  loadingEvents: boolean;
  lastMessage: string | null;
}

const initialState: PartnerState = {
  list: [],
  loadingList: false,
  saving: false,
  error: null,
  partnerDetail: null,
  loadingDetail: false,
  wallet: null,
  transactions: [],
  loadingWallet: false,
  loadingTransactions: false,
  events: [],
  loadingEvents: false,
  lastMessage: null,
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all
      .addCase(fetchAllPartners.pending, (state) => {
        state.loadingList = true;
      })
      .addCase(fetchAllPartners.fulfilled, (state, action: PayloadAction<Partner[]>) => {
        state.loadingList = false;
        state.list = action.payload || [];
        state.error = null;
      })
      .addCase(fetchAllPartners.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload as string || null;
      })

      // create
      .addCase(createPartner.pending, (state) => {
        state.saving = true;
      })
      .addCase(createPartner.fulfilled, (state, action: PayloadAction<Partner>) => {
        state.saving = false;
        state.list = state.list ? [...state.list, action.payload] : [action.payload];
        state.error = null;
      })
      .addCase(createPartner.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string || null;
      })
      // get partner by id
      .addCase(fetchPartnerById.pending, (state) => {
        state.loadingDetail = true;
        state.error = null;
      })
      .addCase(fetchPartnerById.fulfilled, (state, action: PayloadAction<Partner>) => {
        state.loadingDetail = false;
        state.partnerDetail = action.payload;
      })
      .addCase(fetchPartnerById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload as string || null;
      })
      // wallet
      .addCase(fetchPartnerWallet.pending, (state) => {
        state.loadingWallet = true;
      })
      .addCase(fetchPartnerWallet.fulfilled, (state, action: PayloadAction<Wallet>) => {
        state.loadingWallet = false;
        state.wallet = action.payload;
      })
      .addCase(fetchPartnerWallet.rejected, (state, action) => {
        state.loadingWallet = false;
        state.error = action.payload as string || null;
      })
      // wallet history
      .addCase(fetchPartnerWalletHistory.pending, (state) => {
        state.loadingTransactions = true;
      })
      .addCase(fetchPartnerWalletHistory.fulfilled, (state, action: PayloadAction<WalletTransaction[]>) => {
        state.loadingTransactions = false;
        state.transactions = action.payload;
      })
      .addCase(fetchPartnerWalletHistory.rejected, (state, action) => {
        state.loadingTransactions = false;
        state.error = action.payload as string || null;
      })
      // events
      .addCase(fetchPartnerEvents.pending, (state) => {
        state.loadingEvents = true;
      })
      .addCase(fetchPartnerEvents.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loadingEvents = false;
        state.events = action.payload;
      })
      .addCase(fetchPartnerEvents.rejected, (state, action) => {
        state.loadingEvents = false;
        state.error = action.payload as string || null;
      })
      // actions result messages
      .addCase(fundEventByPartner.fulfilled, (state, action) => {
        state.lastMessage = action.payload.message;
      })
      .addCase(fundEventByPartner.rejected, (state, action) => {
        state.error = action.payload as string || null;
      })
      .addCase(broadcastByPartner.fulfilled, (state, action) => {
        state.lastMessage = action.payload.message;
      })
      .addCase(broadcastByPartner.rejected, (state, action) => {
        state.error = action.payload as string || null;
      });
  },
});

export const { clearError } = partnerSlice.actions;
export default partnerSlice.reducer;
