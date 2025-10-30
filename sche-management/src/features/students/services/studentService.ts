import axiosInstance from "@/config/axiosInstance";
import type { StudentProfile, CompleteProfileRequest } from "../types/student";

export const studentService = {
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
};
