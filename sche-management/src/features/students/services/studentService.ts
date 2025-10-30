import axiosInstance from "@/config/axiosInstance";
import { 
  UniversityUser, 
  StudentResponse,
  StudentProfile,
  CompleteProfileRequest,
  UpdateProfileRequest
} from "../types/student";

const endpoint = "/admin/students";

export interface FetchUniversityUsersParams {
  page?: number;
  size?: number;
  sort?: string;
  universityId?: number;
  search?: string;
}

export const studentService = {
  /** 🔹 Lấy danh sách University Users theo paging */
  async getAll(
    params?: FetchUniversityUsersParams
  ): Promise<UniversityUser[]> {
    try {
      const res = await axiosInstance.get<StudentResponse>(endpoint, {
        params,
      });

      return res.data.data.content;
    } catch (error) {
      console.error(
        "❌ [getAll] Error fetching university users:",
        error
      );
      throw error;
    }
  },

  /** 🔹 Cập nhật trạng thái University User (Sinh viên) */
  async updateStatus(
    id: number,
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
      const res = await axiosInstance.get<{ data: StudentProfile }>("/me");
      return res.data.data;
    } catch (error) {
      console.error("❌ [getProfile] Lỗi khi lấy thông tin profile:", error);
      throw error;
    }
  },

  /** 🔹 Hoàn thiện thông tin profile của student */
  async completeProfile(data: CompleteProfileRequest): Promise<StudentProfile> {
    try {
      const res = await axiosInstance.post<{ data: StudentProfile }>(
        "/students/me/complete-profile",
        data
      );
      return res.data.data;
    } catch (error) {
      console.error("❌ [completeProfile] Lỗi khi hoàn thiện profile:", error);
      throw error;
    }
  },

  /** 🔹 Cập nhật thông tin profile của student */
  async updateProfile(data: UpdateProfileRequest): Promise<StudentProfile> {
    try {
      const res = await axiosInstance.put<{ data: StudentProfile }>(
        "/students/me",
        data
      );
      return res.data.data;
    } catch (error) {
      console.error("❌ [updateProfile] Lỗi khi cập nhật profile:", error);
      throw error;
    }
  },
};