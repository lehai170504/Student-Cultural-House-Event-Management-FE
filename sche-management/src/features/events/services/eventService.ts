// src/features/events/services/eventService.ts
import axiosInstance from "@/config/axiosInstance";
import { Event, CreateEvent, UpdateEvent, EventDetail } from "../types/events";

const endpoint = "/events";

export const eventService = {
  /** 🔹 Lấy tất cả events với filter tùy chọn */
  async getAll(params?: Record<string, any>): Promise<Event[]> {
    try {
      const res = await axiosInstance.get<{ content: Event[] }>(endpoint, { params });
      return res.data.content;
    } catch (error) {
      console.error("❌ [getAll] Lỗi khi lấy danh sách events:", error);
      throw error;
    }
  },

  /** 🔹 Lấy chi tiết event theo ID */
  async getById(id: number): Promise<EventDetail> {
    try {
      const res = await axiosInstance.get<EventDetail>(`${endpoint}/${id}`);
      return res.data;
    } catch (error) {
      console.error(`❌ [getById] Lỗi khi lấy event ID ${id}:`, error);
      throw error;
    }
  },

  /** 🔹 Tạo mới event */
  async create(data: CreateEvent): Promise<EventDetail> {
    try {
      const res = await axiosInstance.post<EventDetail>(endpoint, data);
      return res.data;
    } catch (error) {
      console.error("❌ [create] Lỗi khi tạo event:", error);
      throw error;
    }
  },

  /** 🔹 Cập nhật event theo ID */
  async update(id: number, data: UpdateEvent): Promise<EventDetail> {
    try {
      const res = await axiosInstance.put<EventDetail>(`${endpoint}/${id}`, data);
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
};
