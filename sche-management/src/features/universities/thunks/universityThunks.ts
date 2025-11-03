// src/features/universities/thunks/universityThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import { universityService } from "../services/universityService";
import type {
  CreateUniversity,
  University,
  UpdateUniversity,
} from "../types/universities";
import type { PaginatedResponse, PaginationParams } from "@/utils/apiResponse";
import { getErrorMessage } from "@/utils/errorHandler";

// 🔹 Lấy tất cả universities với pagination (format mới)
export const fetchAllUniversities = createAsyncThunk<
  PaginatedResponse<University>,
  PaginationParams | void,
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

// 🔹 Tạo mới university
export const createUniversity = createAsyncThunk<
  University,
  CreateUniversity,
  { rejectValue: string }
>("universities/create", async (data, { rejectWithValue }) => {
  try {
    const res = await universityService.create(data);
    return res;
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi tạo university"));
  }
});

// 🔹 Cập nhật university
export const updateUniversity = createAsyncThunk<
  University,
  { id: number; data: UpdateUniversity },
  { rejectValue: string }
>("universities/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const res = await universityService.update(id, data);
    return res;
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, `Lỗi khi cập nhật university ID ${id}`)
    );
  }
});

// 🔹 Xoá university
export const deleteUniversity = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("universities/delete", async (id, { rejectWithValue }) => {
  try {
    await universityService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, `Lỗi khi xóa university ID ${id}`)
    );
  }
});
