import { createAsyncThunk } from "@reduxjs/toolkit";
import { eventService } from "@/features/events/services/eventService";
import type {
  Event,
  CreateEvent,
  UpdateEvent,
  EventRegistration,
  EventFeedbackRequest,
  EventFeedbackResponse,
  EventCheckinRequest,
  EventCheckinResponse,
  AttendeesResponse,
  PagedEventResponse,
} from "@/features/events/types/events";
import { getErrorMessage } from "@/utils/errorHandler";

// ============================================================
// 🔸 EVENT CRUD
// ============================================================

// 🔹 Lấy tất cả events với filter tùy chọn
export const fetchAllEvents = createAsyncThunk<
  PagedEventResponse,
  Record<string, any> | undefined,
  { rejectValue: string }
>("events/fetchAll", async (params, { rejectWithValue }) => {
  try {
    // eventService.getAll() đã trả về PagedEventResponse trực tiếp
    const res = await eventService.getAll(params);
    return res;
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tải danh sách events")
    );
  }
});

// 🔹 Lấy chi tiết event theo ID
export const fetchEventById = createAsyncThunk<
  Event, // trả về thẳng Event
  number,
  { rejectValue: string }
>("events/fetchById", async (id, { rejectWithValue }) => {
  try {
    // eventService.getById() đã trả về Event trực tiếp
    const res = await eventService.getById(id);
    return res;
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi tải chi tiết event"));
  }
});

// 🔹 Tạo mới event
export const createEvent = createAsyncThunk<
  Event,
  CreateEvent,
  { rejectValue: string }
>("events/create", async (data, { rejectWithValue }) => {
  try {
    // eventService.create() đã trả về Event trực tiếp
    const res = await eventService.create(data);
    return res;
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi tạo event"));
  }
});

// 🔹 Cập nhật event theo ID
export const updateEvent = createAsyncThunk<
  Event,
  { id: number; data: UpdateEvent },
  { rejectValue: string }
>("events/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    // eventService.update() đã trả về Event trực tiếp
    const res = await eventService.update(id, data);
    return res;
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

// ============================================================
// 🔸 EVENT EXTENDED ACTIONS
// ============================================================

// 🔹 1️⃣ Đăng ký sự kiện
export const registerForEvent = createAsyncThunk<
  EventRegistration,
  { eventId: number; studentId: number },
  { rejectValue: string }
>("events/register", async ({ eventId, studentId }, { rejectWithValue }) => {
  try {
    return await eventService.register(eventId, studentId);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi đăng ký sự kiện"));
  }
});

// 🔹 2️⃣ Gửi feedback
export const sendEventFeedback = createAsyncThunk<
  EventFeedbackResponse,
  { eventId: number; data: EventFeedbackRequest },
  { rejectValue: string }
>("events/sendFeedback", async ({ eventId, data }, { rejectWithValue }) => {
  try {
    return await eventService.sendFeedback(eventId, data);
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi gửi phản hồi sự kiện")
    );
  }
});

// 🔹 3️⃣ Check-in sự kiện
export const checkinEvent = createAsyncThunk<
  EventCheckinResponse,
  EventCheckinRequest,
  { rejectValue: string }
>("events/checkin", async (data, { rejectWithValue }) => {
  try {
    return await eventService.checkin(data);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi check-in sự kiện"));
  }
});

// 🔹 4️⃣ Lấy danh sách người tham dự
export const fetchEventAttendees = createAsyncThunk<
  AttendeesResponse,
  { eventId: number; params?: Record<string, any> },
  { rejectValue: string }
>("events/fetchAttendees", async ({ eventId, params }, { rejectWithValue }) => {
  try {
    return await eventService.getAttendees(eventId, params);
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tải danh sách người tham dự")
    );
  }
});
