import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchUserProfile } from "../thunks/authThunks";
import type { AuthResponse } from "@/features/auth/types/auth";

export interface AuthState {
  user: AuthResponse["data"] | null;
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        fetchUserProfile.fulfilled,
        (state, action: PayloadAction<AuthResponse["data"]>) => {
          state.isLoading = false;
          state.user = action.payload;
          state.isAuthenticated = true;
          state.error = null;
        }
      )
      .addCase(
        fetchUserProfile.rejected,
        (state, action: PayloadAction<any>) => {
          state.isLoading = false;
          state.user = null;
          state.isAuthenticated = false;
          state.error = action.payload as string;
        }
      );
  },
});

export const { clearError, setLoading } = authSlice.actions;
export default authSlice.reducer;
