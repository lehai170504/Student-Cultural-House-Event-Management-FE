import { createAsyncThunk } from "@reduxjs/toolkit";
import { eventCategoryService } from "@/features/eventCategories/services/eventCategoryService";
import type {
  EventCategory,
  CreateEventCategory,
  UpdateEventCategory,
} from "@/features/eventCategories/types/eventCategories";
import type { PaginatedResponse, PaginationParams } from "@/utils/apiResponse";
import { getErrorMessage } from "@/utils/errorHandler";

export const fetchAllEventCategories = createAsyncThunk<
  EventCategory[],
  void,
  { rejectValue: string }
>("eventCategories/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const res = await eventCategoryService.getAll();

    return res;
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tải danh sách danh mục sự kiện")
    );
  }
});
export const fetchEventCategoryById = createAsyncThunk<
  EventCategory,
  number,
  { rejectValue: string }
>("eventCategories/fetchById", async (id, { rejectWithValue }) => {
  try {
    const category = await eventCategoryService.getById(id);
    return category;
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tải chi tiết danh mục sự kiện")
    );
  }
});

export const createEventCategory = createAsyncThunk<
  EventCategory,
  CreateEventCategory,
  { rejectValue: string }
>("eventCategories/create", async (data, { rejectWithValue }) => {
  try {
    const category = await eventCategoryService.create(data);
    return category;
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tạo danh mục sự kiện")
    );
  }
});

export const updateEventCategory = createAsyncThunk<
  EventCategory,
  { id: number; data: UpdateEventCategory },
  { rejectValue: string }
>("eventCategories/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    const category = await eventCategoryService.update(id, data);
    return category;
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi cập nhật danh mục sự kiện")
    );
  }
});

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
