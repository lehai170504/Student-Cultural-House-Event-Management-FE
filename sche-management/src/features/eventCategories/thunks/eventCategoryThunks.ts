import { createAsyncThunk } from "@reduxjs/toolkit";
import { eventCategoryService } from "@/features/eventCategories/services/eventCategoryService";
import type {
  EventCategory,
  EventCategoryDetail,
  CreateEventCategory,
  UpdateEventCategory,
} from "@/features/eventCategories/types/eventCategories";
import { getErrorMessage } from "@/utils/errorHandler";

// 🔹 Lấy tất cả danh mục sự kiện
export const fetchAllEventCategories = createAsyncThunk<
  EventCategory[],
  void,
  { rejectValue: string }
>("eventCategories/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await eventCategoryService.getAll();
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tải danh sách danh mục sự kiện")
    );
  }
});

// 🔹 Lấy chi tiết danh mục
export const fetchEventCategoryById = createAsyncThunk<
  EventCategoryDetail,
  number,
  { rejectValue: string }
>("eventCategories/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await eventCategoryService.getById(id);
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tải chi tiết danh mục sự kiện")
    );
  }
});

// 🔹 Tạo mới danh mục
export const createEventCategory = createAsyncThunk<
  EventCategoryDetail,
  CreateEventCategory,
  { rejectValue: string }
>("eventCategories/create", async (data, { rejectWithValue }) => {
  try {
    return await eventCategoryService.create(data);
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tạo danh mục sự kiện")
    );
  }
});

// 🔹 Cập nhật danh mục
export const updateEventCategory = createAsyncThunk<
  EventCategoryDetail,
  { id: number; data: UpdateEventCategory },
  { rejectValue: string }
>("eventCategories/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await eventCategoryService.update(id, data);
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi cập nhật danh mục sự kiện")
    );
  }
});

// 🔹 Xoá danh mục
export const deleteEventCategory = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("eventCategories/delete", async (id, { rejectWithValue }) => {
  try {
    await eventCategoryService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi xoá danh mục sự kiện")
    );
  }
});
