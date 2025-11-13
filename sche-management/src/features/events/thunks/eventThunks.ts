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
  EventFinalizeResponse,
  EventApproveResponse,
  EventCheckinDetail,
  RequestEventCheckin,
  GetAllEventsResponse,
} from "@/features/events/types/events";
import { getErrorMessage } from "@/utils/errorHandler";

export interface CheckinPayload {
  eventId: string;
  data: RequestEventCheckin;
}

// 🔹 CRUD
export const fetchAllEvents = createAsyncThunk<
  GetAllEventsResponse,
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

export const fetchEventById = createAsyncThunk<
  Event,
  string,
  { rejectValue: string }
>("events/fetchById", async (id, { rejectWithValue }) => {
  try {
    return await eventService.getById(id);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi tải chi tiết event"));
  }
});

export const createEvent = createAsyncThunk<
  Event,
  CreateEvent,
  { rejectValue: string }
>("events/create", async (data, { rejectWithValue }) => {
  try {
    return await eventService.create(data);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi tạo event"));
  }
});

export const updateEvent = createAsyncThunk<
  Event,
  { id: string; data: UpdateEvent },
  { rejectValue: string }
>("events/update", async ({ id, data }, { rejectWithValue }) => {
  try {
    return await eventService.update(id, data);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi cập nhật event"));
  }
});

export const deleteEvent = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("events/delete", async (id, { rejectWithValue }) => {
  try {
    await eventService.delete(id);
    return id;
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi xoá event"));
  }
});

// 🔹 Extended Actions
export const registerForEvent = createAsyncThunk<
  EventRegistration,
  { eventId: string; studentId: string },
  { rejectValue: string }
>("events/register", async ({ eventId, studentId }, { rejectWithValue }) => {
  try {
    return await eventService.register(eventId, studentId);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi đăng ký sự kiện"));
  }
});

export const sendEventFeedback = createAsyncThunk<
  EventFeedbackResponse,
  { eventId: string; data: EventFeedbackRequest },
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

export const updateEventFeedback = createAsyncThunk<
  EventFeedbackResponse,
  { feedbackId: string; data: EventFeedbackRequest },
  { rejectValue: string }
>("events/updateFeedback", async ({ feedbackId, data }, { rejectWithValue }) => {
  try {
    return await eventService.updateFeedback(feedbackId, data);
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi cập nhật phản hồi sự kiện")
    );
  }
});

export const deleteEventFeedback = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("events/deleteFeedback", async (feedbackId, { rejectWithValue }) => {
  try {
    await eventService.deleteFeedback(feedbackId);
    return;
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi xóa phản hồi sự kiện")
    );
  }
});

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

export const fetchEventAttendees = createAsyncThunk<
  AttendeesResponse,
  { eventId: string; params?: Record<string, any> },
  { rejectValue: string }
>("events/fetchAttendees", async ({ eventId, params }, { rejectWithValue }) => {
  try {
    const res = await eventService.getAttendees(eventId, params);
    return {
      data: res.data || [],
      meta: res.meta || {
        currentPage: 1,
        pageSize: 0,
        totalPages: 0,
        totalItems: 0,
      },
    };
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tải danh sách người tham dự")
    );
  }
});

export const finalizeEvent = createAsyncThunk<
  EventFinalizeResponse,
  string,
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

export const approveEvent = createAsyncThunk<
  EventApproveResponse,
  string,
  { rejectValue: string }
>("events/approve", async (eventId, { rejectWithValue }) => {
  try {
    return await eventService.approveEvent(eventId);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi duyệt sự kiện"));
  }
});

export const checkinByPhoneNumber = createAsyncThunk<
  EventCheckinDetail,
  CheckinPayload,
  { rejectValue: string }
>(
  "events/checkinByPhoneNumber",
  async ({ eventId, data }, { rejectWithValue }) => {
    try {
      return await eventService.checkinByPhoneNumber(eventId, data);
    } catch (err: any) {
      return rejectWithValue(
        getErrorMessage(err, "Lỗi khi thực hiện check-in")
      );
    }
  }
);
