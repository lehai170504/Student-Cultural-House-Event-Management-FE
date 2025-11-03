import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UniversityUser } from "../types/student";
import type { PaginatedResponseMeta, PaginatedResponse } from "@/utils/apiResponse";
import { fetchStudents, updateStudentStatus } from "../thunks/studentThunks";

interface UniversityState {
  list: UniversityUser[];
  loadingList: boolean;
  pagination: PaginatedResponseMeta | null; // metadata cho pagination
  loadingStatus: boolean;
  error: string | null;
}

const initialState: UniversityState = {
  list: [],
  loadingList: false,
  pagination: null,
  loadingStatus: false,
  error: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetList: (state) => {
      state.list = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchStudents cases (format mới: PaginatedResponse)
      .addCase(fetchStudents.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(
        fetchStudents.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<UniversityUser>>) => {
          state.loadingList = false;
          state.list = action.payload?.data || [];
          state.pagination = action.payload?.meta || null;
        }
      )
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loadingList = false;
        state.error = (action.payload as string) || null;
      })

      // updateStudentStatus cases
      .addCase(updateStudentStatus.pending, (state) => {
        state.loadingStatus = true;
        state.error = null;
      })
      .addCase(
        updateStudentStatus.fulfilled,
        (state, action: PayloadAction<UniversityUser>) => {
          state.loadingStatus = false;
          const updatedUser = action.payload;

          const index = state.list.findIndex(
            (user) => user.id === updatedUser.id
          );
          if (index !== -1) {
            state.list[index] = updatedUser;
          }
        }
      )
      .addCase(updateStudentStatus.rejected, (state, action) => {
        state.loadingStatus = false;
        state.error = (action.payload as string) || null;
      });
  },
});

export const { clearError, resetList } = studentSlice.actions;
export default studentSlice.reducer;
