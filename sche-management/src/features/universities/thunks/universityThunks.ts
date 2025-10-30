// src/features/universities/thunks/universityThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { universityService } from "../services/universityService";
import type { University } from "../types/universities";
import { getErrorMessage } from "@/utils/errorHandler";

// 🔹 Lấy tất cả universities với filter tùy chọn
export const fetchAllUniversities = createAsyncThunk<
  University[],
  Record<string, any> | undefined,
  { rejectValue: string }
>("universities/fetchAll", async (params, { rejectWithValue }) => {
  try {
    const data = await universityService.getAll(params);
    console.log("📡 [fetchAllUniversities] data from API:", data); // debug
    return data;
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tải danh sách universities")
    );
  }
});
