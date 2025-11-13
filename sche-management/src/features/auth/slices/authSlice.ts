import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchProfile } from "../thunks/authThunks";

export interface AuthState {
  user: any | null; // có thể là AuthResponse.data hoặc PartnerResponse
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload; // nhận cả User hoặc Partner
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error =
          action.payload ?? action.error.message ?? "Lỗi không xác định";
      });
  },
});

export const { clearError, setLoading, logout } = authSlice.actions;
export default authSlice.reducer;
