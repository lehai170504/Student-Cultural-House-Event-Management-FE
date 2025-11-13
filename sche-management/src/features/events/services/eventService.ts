import axiosInstance from "@/config/axiosInstance";
import {
  CreateEvent,
  UpdateEvent,
  EventRegistration,
  EventFeedbackRequest,
  EventFeedbackResponse,
  EventCheckinRequest,
  EventCheckinResponse,
  AttendeesResponse,
  Event,
  EventCheckinDetail,
  EventFinalizeResponse,
  RequestEventCheckin,
  EventApproveResponse,
  GetAllEventsResponse,
  EventMeta,
} from "../types/events";

const endpoint = "/events";
const endpoint2 = "/admin/events";

export const eventService = {
  /** 🔹 Lấy tất cả events với pagination */
  async getAll(params?: Record<string, any>): Promise<GetAllEventsResponse> {
    try {
      const queryParams: Record<string, any> = {
        page: params?.page ?? 1,
        size: params?.size ?? 10,
      };

      if (params) {
        Object.keys(params).forEach((key) => {
          if (key !== "page" && key !== "size") {
            queryParams[key] = params[key];
          }
        });
      }

      const res = await axiosInstance.get<{ data: Event[]; meta: EventMeta }>(
        endpoint,
        {
          params: queryParams,
        }
      );

      const { data, meta } = res.data;

      // Trả về đúng type GetAllEventsResponse
      return { data, meta };
    } catch (error) {
      console.error("❌ [getAll] Lỗi khi lấy danh sách events:", error);
      throw error;
    }
  },

  /** 🔹 Lấy chi tiết event theo ID (id kiểu string) */
  async getById(id: string): Promise<Event> {
    try {
      const res = await axiosInstance.get<any>(`${endpoint}/${id}`);
      return res.data?.data || res.data;
    } catch (error) {
      console.error(`❌ [getById] Lỗi khi lấy event ID ${id}:`, error);
      throw error;
    }
  },

  /** 🔹 Tạo mới event */
  async create(data: CreateEvent): Promise<Event> {
    try {
      const res = await axiosInstance.post<any>(endpoint, data);
      return res.data?.data || res.data;
    } catch (error) {
      console.error("❌ [create] Lỗi khi tạo event:", error);
      throw error;
    }
  },

  /** 🔹 Cập nhật event theo ID */
  async update(id: string, data: UpdateEvent): Promise<Event> {
    try {
      const res = await axiosInstance.put<any>(`${endpoint}/${id}`, data);
      return res.data?.data || res.data;
    } catch (error) {
      console.error(`❌ [update] Lỗi khi cập nhật event ID ${id}:`, error);
      throw error;
    }
  },

  /** 🔹 Xoá event theo ID */
  async delete(id: string): Promise<void> {
    try {
      await axiosInstance.delete(`${endpoint}/${id}`);
    } catch (error) {
      console.error(`❌ [delete] Lỗi khi xoá event ID ${id}:`, error);
      throw error;
    }
  },

  /** 🔹 Đăng ký tham gia sự kiện */
  async register(
    eventId: string,
    studentId: string
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

  /** 🔹 Gửi feedback cho sự kiện */
  async sendFeedback(
    eventId: string,
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

  /** 🔹 Lấy danh sách feedback của sự kiện */
  async getFeedbacks(eventId: string): Promise<EventFeedbackResponse[]> {
    try {
      const res = await axiosInstance.get<any>(`${endpoint}/${eventId}/feedback`);
      const payload = res?.data?.data ?? res?.data ?? [];
      if (Array.isArray(payload)) {
        return payload;
      }
      if (Array.isArray(payload?.data)) {
        return payload.data;
      }
      return [];
    } catch (error) {
      console.error(
        `❌ [getFeedbacks] Lỗi khi lấy feedback cho event ID ${eventId}:`,
        error
      );
      return [];
    }
  },

  /** 🔹 Check-in sự kiện */
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

  /** 🔹 Lấy danh sách người tham dự */
  async getAttendees(
    eventId: string,
    params?: Record<string, any>
  ): Promise<AttendeesResponse> {
    try {
      const res = await axiosInstance.get<AttendeesResponse>(
        `${endpoint}/${eventId}/attendees`,
        { params }
      );

      // ✅ Đảm bảo dữ liệu trả về đúng định dạng
      return {
        data: res.data.data || [],
        meta: res.data.meta || {
          currentPage: 1,
          pageSize: 0,
          totalPages: 0,
          totalItems: 0,
        },
      };
    } catch (error) {
      console.error(
        `❌ [getAttendees] Lỗi khi lấy attendees cho event ID ${eventId}:`,
        error
      );
      throw error;
    }
  },

  /** 🔹 Finalize Event */
  async finalizeEvent(eventId: string): Promise<EventFinalizeResponse> {
    try {
      const res = await axiosInstance.post<EventFinalizeResponse>(
        `${endpoint}/${eventId}/finalize`
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ [finalizeEvent] Lỗi khi finalize event ID ${eventId}:`,
        error
      );
      throw error;
    }
  },

  /** 🔹 Checkin bằng số điện thoại */
  async checkinByPhoneNumber(
    eventId: string,
    data: RequestEventCheckin
  ): Promise<EventCheckinDetail> {
    try {
      const res = await axiosInstance.post<EventCheckinDetail>(
        `${endpoint}/${eventId}/checkin`,
        data
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ [checkinByPhoneNumber] Lỗi khi checkin event ID ${eventId}:`,
        error
      );
      throw error;
    }
  },

  /** ✅ 🔹 Duyệt sự kiện (approve) */
  async approveEvent(eventId: string): Promise<EventApproveResponse> {
    try {
      const res = await axiosInstance.patch<EventApproveResponse>(
        `${endpoint2}/${eventId}/approve`
      );
      return res.data;
    } catch (error) {
      console.error(
        `❌ [approveEvent] Lỗi khi duyệt event ID ${eventId}:`,
        error
      );
      throw error;
    }
  },
};
