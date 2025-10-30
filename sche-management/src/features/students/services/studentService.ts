import axiosInstance from "@/config/axiosInstance";
import { UniversityUser, StudentResponse } from "../types/student";

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
};