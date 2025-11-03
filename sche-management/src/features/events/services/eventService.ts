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
  Event,
  EventCheckinDetail,
  EventFinalizeResponse,
  RequestEventCheckin,
} from "../types/events";
import type { PaginatedResponse, PaginationParams } from "@/utils/apiResponse";

const endpoint = "/events";

export const eventService = {
  /** 🔹 Lấy tất cả events với pagination (format mới: { data: [...], meta: {...} }) */
  async getAll(
    params?: PaginationParams & Record<string, any>
  ): Promise<PaginatedResponse<Event>> {
    try {
      // Mặc định: page=1, size=10, không có sort
      const queryParams: Record<string, any> = {
        page: params?.page ?? 1,
        size: params?.size ?? 10,
        // sort không được include theo yêu cầu
      };

      // Copy các params khác nếu có (nhưng không copy sort)
      if (params) {
        Object.keys(params).forEach((key) => {
          if (key !== "sort" && key !== "page" && key !== "size") {
            queryParams[key] = params[key];
          }
        });
      }

      const res = await axiosInstance.get<any>(endpoint, {
        params: queryParams,
      });

      // Format mới: { data: [...], meta: { currentPage, pageSize, totalPages, totalItems } }
      const responseData = res.data;

      // Nếu có wrap trong { status, message, data } thì lấy data
      if (
        responseData?.data &&
        Array.isArray(responseData.data) &&
        responseData.meta
      ) {
        return responseData as PaginatedResponse<Event>;
      }

      // Nếu trả về trực tiếp { data, meta }
      if (responseData?.data && responseData?.meta) {
        return responseData as PaginatedResponse<Event>;
      }

      // Fallback: nếu là format cũ PagedEventResponse, convert sang format mới
      if (responseData?.content && Array.isArray(responseData.content)) {
        return {
          data: responseData.content,
          meta: {
            currentPage: (responseData.number ?? 0) + 1, // convert 0-indexed to 1-indexed
            pageSize: responseData.size ?? 10,
            totalPages: responseData.totalPages ?? 0,
            totalItems: responseData.totalElements ?? 0,
          },
        };
      }

      // Fallback cuối cùng: giả sử responseData là PaginatedResponse trực tiếp
      return responseData as PaginatedResponse<Event>;
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

  /** 🔹 5. Finalize Event (POST /api/v1/events/{eventId}/finalize) */
  async finalizeEvent(eventId: number): Promise<EventFinalizeResponse> {
    try {
      // POST request, không có body
      const res = await axiosInstance.post<EventFinalizeResponse>(
        `${endpoint}/${eventId}/finalize`
      );

      // Response trả về đối tượng Event đã finalized
      return res.data;
    } catch (error) {
      console.error(
        `❌ [finalizeEvent] Lỗi khi finalize event ID ${eventId}:`,
        error
      );
      throw error;
    }
  },

  /** 🔹 6. Submit Checkin/Registration Detail */
  async checkinByPhoneNumber(
    eventId: number,
    data: RequestEventCheckin
  ): Promise<EventCheckinDetail> {
    try {
      const res = await axiosInstance.post<EventCheckinDetail>(
        `${endpoint}/${eventId}/checkin`,
        data
      );

      // Trả về đối tượng EventCheckinDetail chi tiết
      return res.data;
    } catch (error) {
      console.error(
        `❌ [checkinByPhoneNumber] Lỗi khi checkin cho event ID ${eventId}:`,
        error
      );
      throw error;
    }
  },
};
