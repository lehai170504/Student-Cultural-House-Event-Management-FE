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
  PagedEventResponse,
} from "../types/events";

const endpoint = "/events";

export const eventService = {
  /** 🔹 Lấy tất cả events với filter tùy chọn */
  async getAll(params?: Record<string, any>): Promise<PagedEventResponse> {
    try {
      const res = await axiosInstance.get<any>(endpoint, { params });
      // BE giờ trả về PagedEventResponse trực tiếp hoặc wrap trong { data: {...} }
      // Nếu có { status, message, data } thì lấy data, nếu không thì lấy trực tiếp
      const responseData = res.data;
      if (responseData?.data && responseData?.status !== undefined) {
        // Format: { status, message, data: PagedEventResponse }
        return responseData.data;
      }
      // Format: PagedEventResponse trực tiếp
      return responseData;
    } catch (error) {
      console.error("❌ [getAll] Lỗi khi lấy danh sách events:", error);
      throw error;
    }
  },

  /** 🔹 Lấy chi tiết event theo ID */
  async getById(id: number): Promise<Event> {
    try {
      const res = await axiosInstance.get<any>(`${endpoint}/${id}`);
      // BE giờ trả về Event trực tiếp hoặc wrap trong { data: {...} }
      const responseData = res.data;
      if (responseData?.data && responseData?.status !== undefined) {
        return responseData.data;
      }
      return responseData;
    } catch (error) {
      console.error(`❌ [getById] Lỗi khi lấy event ID ${id}:`, error);
      throw error;
    }
  },

  /** 🔹 Tạo mới event */
  async create(data: CreateEvent): Promise<Event> {
    try {
      const res = await axiosInstance.post<any>(endpoint, data);
      // BE giờ trả về Event trực tiếp hoặc wrap trong { data: {...} }
      const responseData = res.data;
      if (responseData?.data && responseData?.status !== undefined) {
        return responseData.data;
      }
      return responseData;
    } catch (error) {
      console.error("❌ [create] Lỗi khi tạo event:", error);
      throw error;
    }
  },

  /** 🔹 Cập nhật event theo ID */
  async update(id: number, data: UpdateEvent): Promise<Event> {
    try {
      const res = await axiosInstance.put<any>(`${endpoint}/${id}`, data);
      // BE giờ trả về Event trực tiếp hoặc wrap trong { data: {...} }
      const responseData = res.data;
      if (responseData?.data && responseData?.status !== undefined) {
        return responseData.data;
      }
      return responseData;
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
  async register(
    eventId: number,
    studentId: number
  ): Promise<EventRegistration> {
    try {
      const res = await axiosInstance.post<EventRegistration>(
        `${endpoint}/${eventId}/register`,
        { studentId }
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ [register] Lỗi khi đăng ký event ID ${eventId}:`,
        error
      );
      throw error;
    }
  },

  /** 🔹 2. Gửi feedback cho sự kiện */
  async sendFeedback(
    eventId: number,
    data: EventFeedbackRequest
  ): Promise<EventFeedbackResponse> {
    try {
      const res = await axiosInstance.post<EventFeedbackResponse>(
        `${endpoint}/${eventId}/feedback`,
        data
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ [sendFeedback] Lỗi khi gửi feedback cho event ID ${eventId}:`,
        error
      );
      throw error;
    }
  },

  /** 🔹 3. Check-in sự kiện */
  async checkin(data: EventCheckinRequest): Promise<EventCheckinResponse> {
    try {
      const res = await axiosInstance.post<EventCheckinResponse>(
        `${endpoint}/checkin`,
        data
      );
      return res.data;
    } catch (error) {
      console.error("❌ [checkin] Lỗi khi check-in sự kiện:", error);
      throw error;
    }
  },

  /** 🔹 4. Lấy danh sách người tham dự */
  async getAttendees(
    eventId: number,
    params?: Record<string, any>
  ): Promise<AttendeesResponse> {
    try {
      const res = await axiosInstance.get<AttendeesResponse>(
        `${endpoint}/${eventId}/attendees`,
        { params }
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ [getAttendees] Lỗi khi lấy danh sách attendees cho event ID ${eventId}:`,
        error
      );
      throw error;
    }
  },
};
