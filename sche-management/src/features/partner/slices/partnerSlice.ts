import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Partner, CreatePartner } from "@/features/partner/types/partner";
import { fetchAllPartners, createPartner } from "../thunks/partnerThunks";

interface PartnerState {
  list: Partner[];
  loadingList: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: PartnerState = {
  list: [],
  loadingList: false,
  saving: false,
  error: null,
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
      });
  },
});

export const { clearError } = partnerSlice.actions;
export default partnerSlice.reducer;
