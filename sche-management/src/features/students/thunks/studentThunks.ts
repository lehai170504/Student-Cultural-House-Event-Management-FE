import { createAsyncThunk } from "@reduxjs/toolkit";
import {
  studentService,
  FetchUniversityUsersParams,
} from "../services/studentService";
import { UniversityUser } from "../types/student";
import { getErrorMessage } from "@/utils/errorHandler";

/** 🔹 Lấy danh sách sinh viên / users */
export const fetchStudents = createAsyncThunk<
  UniversityUser[],
  FetchUniversityUsersParams | void,
  { rejectValue: string }
>("university/fetchAllUsers", async (params, { rejectWithValue }) => {
  try {
    return await studentService.getAll(params ?? undefined);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Error fetching student list"));
  }
});

/** 🔹 Cập nhật trạng thái sinh viên / users */
export const updateStudentStatus = createAsyncThunk<
  UniversityUser,
  { id: number; status: "ACTIVE" | "INACTIVE" },
  { rejectValue: string }
>("university/updateStudentStatus", async (data, { rejectWithValue }) => {
  try {
    const { id, status } = data;
    return await studentService.updateStatus(id, status);
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Error updating student status")
    );
  }
});
