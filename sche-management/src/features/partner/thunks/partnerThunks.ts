// src/features/partner/thunks/partnerThunks.ts

import { createAsyncThunk } from "@reduxjs/toolkit";
import { partnerService } from "../services/partnerService"; // Import service
import type { Partner, CreatePartner } from "@/features/partner/types/partner"; // Đảm bảo đúng đường dẫn types

// Thunk để LẤY TẤT CẢ danh sách đối tác
export const fetchAllPartners = createAsyncThunk<
  Partner[], // Kiểu dữ liệu trả về khi fulfilled (Partner[])
  void,      // Kiểu dữ liệu đầu vào (arg)
  { rejectValue: string } // Kiểu dữ liệu lỗi trả về
>("partner/fetchAllPartners", async (_, { rejectWithValue }) => {
  try {
    const data = await partnerService.getAll();
    return data;
  } catch (error: any) {
    // Trích xuất thông báo lỗi từ response hoặc trả về thông báo chung
    return rejectWithValue(error.response?.data?.message || "Lỗi tải danh sách đối tác.");
  }
});

// Thunk để TẠO MỚI đối tác
export const createPartner = createAsyncThunk<
  Partner,      // Kiểu dữ liệu trả về khi fulfilled (Partner)
  CreatePartner, // Kiểu dữ liệu đầu vào (newPartnerData)
  { rejectValue: string }
>("partner/createPartner", async (newPartnerData, { rejectWithValue }) => {
  try {
    const data = await partnerService.create(newPartnerData);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || "Lỗi tạo đối tác mới.");
  }
});

// 💡 THUNK MỚI: Lấy Đối tác theo ID
export const fetchPartnerById = createAsyncThunk<
  Partner,      // Kiểu dữ liệu trả về khi fulfilled
  string,       // Kiểu dữ liệu đầu vào (partnerId)
  { rejectValue: string }
>("partner/fetchPartnerById", async (partnerId, { rejectWithValue }) => {
  try {
    const data = await partnerService.getById(partnerId);
    return data;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || `Lỗi tải chi tiết đối tác ${partnerId}.`);
  }
});