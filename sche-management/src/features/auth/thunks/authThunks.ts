import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "@/features/auth/services/authService";
import type { AuthResponse, PartnerResponse } from "@/features/auth/types/auth";
import { getErrorMessage } from "@/utils/errorHandler";

export const fetchProfile = createAsyncThunk<
  AuthResponse["data"] | PartnerResponse,
  void, // không nhận input
  { rejectValue: string } // kiểu lỗi
>("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const result = await authService.getProfile();
    if (result.success) {
      return result.data;
    } else {
      return rejectWithValue(
        getErrorMessage(result.error, "Lỗi khi tải thông tin")
      );
    }
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi tải thông tin"));
  }
});
