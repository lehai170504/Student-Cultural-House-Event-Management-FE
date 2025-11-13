import axiosInstance from "@/config/axiosInstance";
import type { Event } from "@/features/events/types/events";
import {
  UniversityUser,
  StudentResponse,
  StudentProfile,
  CompleteProfileRequest,
  UpdateProfileRequest,
} from "../types/student";
import type { PaginatedResponse, PaginationParams } from "@/utils/apiResponse";

const endpoint = "/admin/students";

export interface FetchUniversityUsersParams extends PaginationParams {
  universityId?: number;
  search?: string;
  // sort không được include theo yêu cầu
}

export const studentService = {
  /** 🔹 Lấy danh sách University Users với pagination (format mới: { data: [...], meta: {...} }) */
  async getAll(
    params?: FetchUniversityUsersParams
  ): Promise<PaginatedResponse<UniversityUser>> {
    try {
      // Mặc định: page=1, size=10, không có sort
      const queryParams: Record<string, any> = {
        page: params?.page ?? 1,
        size: params?.size ?? 10,
        // sort không được include theo yêu cầu
      };

      // Thêm các filter tùy chọn
      if (params?.universityId) {
        queryParams.universityId = params.universityId;
      }
      if (params?.search) {
        queryParams.search = params.search;
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
        return responseData as PaginatedResponse<UniversityUser>;
      }

      // Nếu trả về trực tiếp { data, meta }
      if (responseData?.data && responseData?.meta) {
        return responseData as PaginatedResponse<UniversityUser>;
      }

      // Fallback: giả sử responseData là PaginatedResponse trực tiếp
      return responseData as PaginatedResponse<UniversityUser>;
    } catch (error) {
      throw error;
    }
  },

  /** 🔹 Cập nhật trạng thái University User (Sinh viên) */
  async updateStatus(
    id: string,
    status: "ACTIVE" | "INACTIVE"
  ): Promise<UniversityUser> {
    try {
      const res = await axiosInstance.patch<UniversityUser>(
        `${endpoint}/${id}/status`,
        { status }
      );
      return res.data;
    } catch (error) {
      throw error;
    }
  },

  /** 🔹 Lấy thông tin profile của student hiện tại */
  async getProfile(): Promise<StudentProfile> {
    try {
      // API endpoint: /me (baseURL đã có /api/v1)
      // Response có thể là { data: {...} } hoặc {...} trực tiếp
      const res = await axiosInstance.get<any>("/me");

      // Xử lý cả 2 trường hợp response format
      const apiData = res?.data?.data ?? res?.data;

      // Map response to StudentProfile type
      const profile: StudentProfile = {
        id: apiData.id,
        universityId: apiData.universityId,
        universityName: apiData.universityName,
        fullName: apiData.fullName,
        phoneNumber: apiData.phoneNumber,
        email: apiData.email || null,
        avatarUrl: apiData.avatarUrl || null,
        walletId: apiData.walletId ?? null,
        status: apiData.status || "ACTIVE",
        createdAt: apiData.createdAt || null,
      };

      return profile;
    } catch (error) {
      throw error;
    }
  },

  /** 🔹 Hoàn thiện thông tin profile của student */
  async completeProfile(data: CompleteProfileRequest): Promise<StudentProfile> {
    try {
      const formData = new FormData();

      const payload: Record<string, string> = {
        phoneNumber: data.phoneNumber,
      };

      if (data.avatarPath && data.avatarPath.trim()) {
        payload.avatarPath = data.avatarPath.trim();
      }

      formData.append("data", JSON.stringify(payload));

      if (data.avatarFile instanceof File) {
        formData.append("image", data.avatarFile, data.avatarFile.name);
      }

      const res = await axiosInstance.post<any>(
        "/students/me/complete-profile",
        formData,
        { timeout: 60000 }
      );

      // BE trả về data trực tiếp hoặc wrap trong { data: {...} }
      const apiData = res.data?.data ?? res.data;

      return {
        id: apiData.id,
        universityId: apiData.universityId,
        universityName: apiData.universityName,
        fullName: apiData.fullName,
        phoneNumber: apiData.phoneNumber,
        email: apiData.email || null,
        avatarUrl: apiData.avatarUrl || null,
        walletId: apiData.walletId ?? null,
        status: apiData.status || "ACTIVE",
        createdAt: apiData.createdAt || null,
      };
    } catch (error) {
      throw error;
    }
  },

  /** 🔹 Cập nhật thông tin profile của student */
  async updateProfile(data: UpdateProfileRequest): Promise<StudentProfile> {
    try {
      // Validate file size nếu có
      if (data.avatarFile) {
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (data.avatarFile.size > maxSize) {
          throw new Error("Kích thước file không được vượt quá 5MB");
        }
      }

      // Tạo FormData để gửi file + JSON data
      const formData = new FormData();

      const payload: Record<string, string> = {};

      if (data.fullName !== undefined) {
        payload.fullName = data.fullName;
      }

      if (data.phoneNumber !== undefined) {
        payload.phoneNumber = data.phoneNumber;
      }

      formData.append("data", JSON.stringify(payload));

      if (data.avatarFile) {
        formData.append("image", data.avatarFile);
      }

      const res = await axiosInstance.put<any>("/students/me", formData);
      
      // BE trả về data trực tiếp hoặc wrap trong { data: {...} }
      const apiData = res.data?.data ?? res.data;

      return {
        id: apiData.id,
        universityId: apiData.universityId,
        universityName: apiData.universityName,
        fullName: apiData.fullName,
        phoneNumber: apiData.phoneNumber,
        email: apiData.email || null,
        avatarUrl: apiData.avatarUrl || null,
        walletId: apiData.walletId ?? null,
        status: apiData.status || "ACTIVE",
        createdAt: apiData.createdAt || null,
      };
    } catch (error: any) {
      throw error;
    }
  },

  /** 🔹 Lấy danh sách sự kiện của student hiện tại */
  async getMyEvents(params?: {
    page?: number;
    size?: number;
  }): Promise<Event[]> {
    try {
      const queryParams: Record<string, any> = {
        page: params?.page ?? 1,
        size: params?.size ?? 10,
      };

      const res = await axiosInstance.get<any>("/students/me/events", {
        params: queryParams,
      });

      const payload = res?.data?.data ?? res?.data;

      if (Array.isArray(payload)) {
        return payload as Event[];
      }

      if (Array.isArray(payload?.data)) {
        return payload.data as Event[];
      }

      return [];
    } catch (error) {
      return [];
    }
  },
};
