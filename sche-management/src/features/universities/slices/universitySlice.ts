// src/features/universities/slices/universitySlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { University } from "../types/universities";
import type { PaginatedResponseMeta, PaginatedResponse } from "@/utils/apiResponse";
import {
  fetchAllUniversities,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} from "../thunks/universityThunks";

interface UniversityState {
  list: University[];
  loadingList: boolean;
  pagination: PaginatedResponseMeta | null; // metadata cho pagination
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: UniversityState = {
  list: [],
  loadingList: false,
  pagination: null,
  saving: false,
  deleting: false,
  error: null,
};

const universitySlice = createSlice({
  name: "university",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all universities (format mới: PaginatedResponse)
      .addCase(fetchAllUniversities.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(
        fetchAllUniversities.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<University>>) => {
          state.loadingList = false;
          state.list = action.payload?.data || [];
          state.pagination = action.payload?.meta || null;
        }
      )
      .addCase(fetchAllUniversities.rejected, (state, action) => {
        state.loadingList = false;
        state.error =
          (action.payload as string) || "Lỗi khi tải danh sách universities";
      })

      // create university
      .addCase(createUniversity.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(
        createUniversity.fulfilled,
        (state, action: PayloadAction<University>) => {
          state.saving = false;
          state.list.push(action.payload);
        }
      )
      .addCase(createUniversity.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) || "Lỗi khi tạo university";
      })

      // update university
      .addCase(updateUniversity.pending, (state) => {
        state.saving = true;
        state.error = null;
      })
      .addCase(
        updateUniversity.fulfilled,
        (state, action: PayloadAction<University>) => {
          state.saving = false;
          const idx = state.list.findIndex((u) => u.id === action.payload.id);
          if (idx !== -1) {
            state.list[idx] = action.payload;
          } else {
            state.list.push(action.payload);
          }
        }
      )
      .addCase(updateUniversity.rejected, (state, action) => {
        state.saving = false;
        state.error =
          (action.payload as string) || "Lỗi khi cập nhật university";
      })

      // delete university
      .addCase(deleteUniversity.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(
        deleteUniversity.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.deleting = false;
          state.list = state.list.filter((u) => u.id !== action.payload);
        }
      )
      .addCase(deleteUniversity.rejected, (state, action) => {
        state.deleting = false;
        state.error = (action.payload as string) || "Lỗi khi xóa university";
      });
  },
});

export const { clearError } = universitySlice.actions;
export default universitySlice.reducer;
