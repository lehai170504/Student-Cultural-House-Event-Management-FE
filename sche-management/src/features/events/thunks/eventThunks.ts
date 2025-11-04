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
  // 🌟 Import các type mới
  EventFinalizeResponse,
  EventCheckinDetail,
  RequestEventCheckin,
} from "@/features/events/types/events";
import type { PaginatedResponse, PaginationParams } from "@/utils/apiResponse";
import { getErrorMessage } from "@/utils/errorHandler";

export interface CheckinPayload {
  eventId: number;
  data: RequestEventCheckin;
}

// ============================================================
// 🔸 EVENT CRUD
// ============================================================

// 🔹 Lấy tất cả events với pagination (format mới)
export const fetchAllEvents = createAsyncThunk<
  PaginatedResponse<Event>,
  (PaginationParams & Record<string, any>) | undefined,
  { rejectValue: string }
>("events/fetchAll", async (params, { rejectWithValue }) => {
  try {
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
  Event,
  number,
  { rejectValue: string }
>("events/fetchById", async (id, { rejectWithValue }) => {
  try {
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

// 🌟 5️⃣ Finalize Event (Kết thúc và phân phối phần thưởng)
export const finalizeEvent = createAsyncThunk<
  EventFinalizeResponse, // Trả về đối tượng Event đã được finalize
  number, // Tham số là eventId
  { rejectValue: string }
>("events/finalize", async (eventId, { rejectWithValue }) => {
  try {
    return await eventService.finalizeEvent(eventId);
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi kết thúc và phân phối phần thưởng sự kiện")
    );
  }
});

// 🌟 6️⃣ Gửi chi tiết Checkin/Đăng ký
export const checkinByPhoneNumber = createAsyncThunk<
  EventCheckinDetail, // Kiểu dữ liệu trả về (Response)
  CheckinPayload, // Kiểu tham số đầu vào (Argument)
  { rejectValue: string }
>(
  // Đổi tên action type cho khớp với chức năng
  "events/checkinByPhoneNumber",
  async ({ eventId, data }, { rejectWithValue }) => {
    try {
      // Gọi hàm service mới, truyền eventId và data request
      return await eventService.checkinByPhoneNumber(eventId, data);
    } catch (err: any) {
      return rejectWithValue(
        getErrorMessage(err, "Lỗi khi thực hiện check-in")
      );
    }
  }
);
