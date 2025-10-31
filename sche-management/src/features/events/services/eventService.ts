import axiosInstance from "@/config/axiosInstance";
import {
  CreateEvent,
  UpdateEvent,
  EventResponse,
  EventDetailResponse,
  EventRegistration,
  EventFeedbackRequest,
  EventFeedbackResponse,
  EventCheckinRequest,
  EventCheckinResponse,
  AttendeesResponse,
} from "../types/events";

const endpoint = "/events";

export const eventService = {
  /** 🔹 Lấy tất cả events với filter tùy chọn */
  async getAll(params?: Record<string, any>): Promise<EventResponse> {
    try {
      const res = await axiosInstance.get<EventResponse>(endpoint, { params });
      return res.data;
    } catch (error) {
      console.error("❌ [getAll] Lỗi khi lấy danh sách events:", error);
      throw error;
    }
  },

  /** 🔹 Lấy chi tiết event theo ID */
  async getById(id: number): Promise<EventDetailResponse> {
    try {
      const res = await axiosInstance.get<EventDetailResponse>(`${endpoint}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`❌ [getById] Lỗi khi lấy event ID ${id}:`, error);
      throw error;
    }
  },

  /** 🔹 Tạo mới event */
  async create(data: CreateEvent): Promise<EventDetailResponse> {
    try {
      const res = await axiosInstance.post<EventDetailResponse>(endpoint, data);
      return res.data;
    } catch (error) {
      console.error("❌ [create] Lỗi khi tạo event:", error);
      throw error;
    }
  },

  /** 🔹 Cập nhật event theo ID */
  async update(id: number, data: UpdateEvent): Promise<EventDetailResponse> {
    try {
      const res = await axiosInstance.put<EventDetailResponse>(`${endpoint}/${id}`, data);
      return res.data;
    } catch (error) {
      console.error(`❌ [update] Lỗi khi cập nhật event ID ${id}:`, error);
      throw error;
    }
  },

  /** 🔹 Xoá event theo ID */
  async delete(id: number): Promise<void> {
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
    } catch (error) {
      console.error(`❌ [delete] Lỗi khi xoá event ID ${id}:`, error);
      throw error;
    }
  },

  // ============================================================
  // 🔸 CÁC API MỚI
  // ============================================================

  /** 🔹 1. Đăng ký tham gia sự kiện */
  async register(eventId: number, studentId: number): Promise<EventRegistration> {
    try {
      const res = await axiosInstance.post<EventRegistration>(`${endpoint}/${eventId}/register`, { studentId });
      return res.data;
    } catch (error) {
      console.error(`❌ [register] Lỗi khi đăng ký event ID ${eventId}:`, error);
      throw error;
    }
  },

  /** 🔹 2. Gửi feedback cho sự kiện */
  async sendFeedback(eventId: number, data: EventFeedbackRequest): Promise<EventFeedbackResponse> {
    try {
      const res = await axiosInstance.post<EventFeedbackResponse>(`${endpoint}/${eventId}/feedback`, data);
      return res.data;
    } catch (error) {
      console.error(`❌ [sendFeedback] Lỗi khi gửi feedback cho event ID ${eventId}:`, error);
      throw error;
    }
  },

  /** 🔹 3. Check-in sự kiện */
  async checkin(data: EventCheckinRequest): Promise<EventCheckinResponse> {
    try {
      const res = await axiosInstance.post<EventCheckinResponse>(`${endpoint}/checkin`, data);
      return res.data;
    } catch (error) {
      console.error("❌ [checkin] Lỗi khi check-in sự kiện:", error);
      throw error;
    }
  },

  /** 🔹 4. Lấy danh sách người tham dự */
  async getAttendees(eventId: number, params?: Record<string, any>): Promise<AttendeesResponse> {
    try {
      const res = await axiosInstance.get<AttendeesResponse>(`${endpoint}/${eventId}/attendees`, { params });
      return res.data;
    } catch (error) {
      console.error(`❌ [getAttendees] Lỗi khi lấy danh sách attendees cho event ID ${eventId}:`, error);
      throw error;
    }
  },
};
