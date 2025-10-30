import { createAsyncThunk } from "@reduxjs/toolkit";
import authService from "@/features/auth/services/authService";
import type { AuthResponse } from "@/features/auth/types/auth";
import { getErrorMessage } from "@/utils/errorHandler";

// 🔹 Thunk lấy thông tin user hiện tại
export const fetchUserProfile = createAsyncThunk<
  AuthResponse["data"], // dữ liệu trả về khi thành công
  void, // không nhận input
  { rejectValue: string } // kiểu lỗi
>("auth/fetchProfile", async (_, { rejectWithValue }) => {
  try {
    const result = await authService.getProfile();
    if (result.success) {
      return result.data;
    } else {
      // trả về rejectValue nếu service báo lỗi
      return rejectWithValue(
        getErrorMessage(result.error, "Lỗi khi tải thông tin người dùng")
      );
    }
  } catch (err: any) {
    // bắt các lỗi bất ngờ
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tải thông tin người dùng")
    );
  }
});
