import { createAsyncThunk } from "@reduxjs/toolkit";
import { partnerService } from "@/features/partner/services/partnerService";
import type { Partner, CreatePartner } from "@/features/partner/types/partner";
import { getErrorMessage } from "@/utils/errorHandler";

// 🔹 Lấy tất cả partner
export const fetchAllPartners = createAsyncThunk<
  Partner[],
  void,
  { rejectValue: string }
>("partners/fetchAll", async (_, { rejectWithValue }) => {
  try {
    return await partnerService.getAll(); // trả về Partner[]
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tải danh sách partner")
    );
  }
});

// 🔹 Tạo mới partner
export const createPartner = createAsyncThunk<
  Partner,
  CreatePartner,
  { rejectValue: string }
>("partners/create", async (data, { rejectWithValue }) => {
  try {
    return await partnerService.create(data); // trả về Partner
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi tạo partner"));
  }
});

export const updatePartnerStatus = createAsyncThunk<
  Partner,
  { id: number; status: "ACTIVE" | "INACTIVE" },
  { rejectValue: string }
>("partners/updateStatus", async ({ id, status }, { rejectWithValue }) => {
  try {
    return await partnerService.updateStatus(id, status); // trả về Partner
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, `Lỗi khi cập nhật trạng thái partner id=${id}`)
    );
  }
});
