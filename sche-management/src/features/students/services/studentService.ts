import axiosInstance from "@/config/axiosInstance";
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
      console.error("❌ [getAll] Error fetching university users:", error);
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
      console.error(
        `❌ [updateStatus] Error updating University User status id=${id}:`,
        error
      );
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
        status: apiData.status || "ACTIVE",
        createdAt: apiData.createdAt || null,
      };

      return profile;
    } catch (error) {
      console.error("❌ [getProfile] Lỗi khi lấy thông tin profile:", error);
      throw error;
    }
  },

  /** 🔹 Hoàn thiện thông tin profile của student */
  async completeProfile(data: CompleteProfileRequest): Promise<StudentProfile> {
    try {
      const formData = new FormData();
      formData.append("phoneNumber", data.phoneNumber);

      if (data.avatarUrl && data.avatarUrl.trim()) {
        formData.append("avatarUrl", data.avatarUrl.trim());
      }

      const res = await axiosInstance.post<any>(
        "/students/me/complete-profile",
        formData
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
        status: apiData.status || "ACTIVE",
        createdAt: apiData.createdAt || null,
      };
    } catch (error) {
      console.error("❌ [completeProfile] Lỗi khi hoàn thiện profile:", error);
      throw error;
    }
  },

  /** 🔹 Cập nhật thông tin profile của student */
  async updateProfile(data: UpdateProfileRequest): Promise<StudentProfile> {
    try {
      const res = await axiosInstance.put<any>("/students/me", data);
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
        status: apiData.status || "ACTIVE",
        createdAt: apiData.createdAt || null,
      };
    } catch (error) {
      console.error("❌ [updateProfile] Lỗi khi cập nhật profile:", error);
      throw error;
    }
  },
};
