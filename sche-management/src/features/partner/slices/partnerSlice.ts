// src/features/partner/slices/partnerSlice.ts

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Partner, CreatePartner } from "@/features/partner/types/partner";
// ✅ Import thunk mới
import { fetchAllPartners, createPartner, fetchPartnerById } from "../thunks/partnerThunks";

interface PartnerState {
  list: Partner[];
  loadingList: boolean;
  saving: boolean;
  error: string | null;
  // 💡 STATE MỚI
  selectedPartner: Partner | null;
  loadingDetail: boolean;
}

const initialState: PartnerState = {
  list: [],
  loadingList: false,
  saving: false,
  error: null,
  // 💡 KHỞI TẠO STATE MỚI
  selectedPartner: null,
  loadingDetail: false,
};

const partnerSlice = createSlice({
  name: "partner",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    // 💡 REDUCER MỚI: Xóa chi tiết khi chuyển trang/đóng modal
    clearSelectedPartner: (state) => {
      state.selectedPartner = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // 🔹 Lấy danh sách partner (fetchAllPartners)
      .addCase(fetchAllPartners.pending, (state) => {
        state.loadingList = true;
        state.error = null; // Xóa lỗi cũ khi bắt đầu tải
      })
      .addCase(fetchAllPartners.fulfilled, (state, action: PayloadAction<Partner[]>) => {
        state.loadingList = false;
        state.list = action.payload || [];
      })
      .addCase(fetchAllPartners.rejected, (state, action) => {
        state.loadingList = false;
        // Lấy giá trị lỗi từ rejectValue
        state.error = (action.payload as string) || action.error.message || "Không thể tải dữ liệu đối tác.";
      })

      // 🔹 Tạo mới partner (createPartner)
      .addCase(createPartner.pending, (state) => {
        state.saving = true;
        state.error = null; // Xóa lỗi cũ khi bắt đầu lưu
      })
      .addCase(createPartner.fulfilled, (state, action: PayloadAction<Partner>) => {
        state.saving = false;
        // Thêm đối tác mới vào đầu danh sách
        state.list.unshift(action.payload); 
      })
      .addCase(createPartner.rejected, (state, action) => {
        state.saving = false;
        // Lấy giá trị lỗi từ rejectValue
        state.error = (action.payload as string) || action.error.message || "Không thể tạo đối tác mới.";
      })
      
      // 💡 Xử lý Lấy chi tiết partner (fetchPartnerById)
      .addCase(fetchPartnerById.pending, (state) => {
          state.loadingDetail = true;
          state.selectedPartner = null; 
          state.error = null;
      })
      .addCase(fetchPartnerById.fulfilled, (state, action: PayloadAction<Partner>) => {
          state.loadingDetail = false;
          state.selectedPartner = action.payload; // Lưu chi tiết đối tác
      })
      .addCase(fetchPartnerById.rejected, (state, action) => {
          state.loadingDetail = false;
          state.selectedPartner = null;
          state.error = (action.payload as string) || action.error.message || "Không thể tải chi tiết đối tác.";
      });
  },
});

export const { clearError, clearSelectedPartner } = partnerSlice.actions; // ✅ Export action mới
export default partnerSlice.reducer;