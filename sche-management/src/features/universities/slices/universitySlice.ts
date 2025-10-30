// src/features/universities/slices/universitySlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { University } from "../types/universities";
import { fetchAllUniversities } from "../thunks/universityThunks";

interface UniversityState {
  list: University[];
  loading: boolean;
  error: string | null;
}

const initialState: UniversityState = {
  list: [],
  loading: false,
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
      // fetch all universities
      .addCase(fetchAllUniversities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAllUniversities.fulfilled,
        (state, action: PayloadAction<University[]>) => {
          state.loading = false;
          state.list = action.payload;
        }
      )
      .addCase(fetchAllUniversities.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Lỗi khi tải danh sách universities";
      });
  },
});

export const { clearError } = universitySlice.actions;
export default universitySlice.reducer;
