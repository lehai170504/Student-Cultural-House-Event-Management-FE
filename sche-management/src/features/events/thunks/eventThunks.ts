import { createAsyncThunk } from "@reduxjs/toolkit";
import { eventService } from "@/features/events/services/eventService";
import type {
  Event,
  EventDetail,
  CreateEvent,
  UpdateEvent,
  PagedResponse,
} from "@/features/events/types/events";
import { getErrorMessage } from "@/utils/errorHandler";

// 🔹 Lấy tất cả events với filter tùy chọn
export const fetchAllEvents = createAsyncThunk<
  PagedResponse<Event>,
  Record<string, any> | undefined,
  { rejectValue: string }
>("events/fetchAll", async (params, { rejectWithValue }) => {
  try {
    return await eventService.getAll(params);
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tải danh sách events")
    );
  }
});

// 🔹 Lấy chi tiết event theo ID
export const fetchEventById = createAsyncThunk<
  EventDetail,
  number,
  { rejectValue: string }
>("events/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await eventService.getById(id);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi tải chi tiết event"));
  }
});

// 🔹 Tạo mới event
export const createEvent = createAsyncThunk<
  EventDetail,
  CreateEvent,
  { rejectValue: string }
>("events/create", async (data, { rejectWithValue }) => {
  try {
    return await eventService.create(data);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi tạo event"));
  }
});

// 🔹 Cập nhật event theo ID
export const updateEvent = createAsyncThunk<
  EventDetail,
  { id: number; data: UpdateEvent },
  { rejectValue: string }
>("events/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await eventService.update(id, data);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi cập nhật event"));
  }
});

// 🔹 Xoá event theo ID
export const deleteEvent = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("events/delete", async (id, { rejectWithValue }) => {
  try {
    await eventService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi xoá event"));
  }
});
