import { createAsyncThunk } from "@reduxjs/toolkit";
import { partnerService } from "@/features/partner/services/partnerService";
import type { Partner, CreatePartner } from "@/features/partner/types/partner";
import type { Wallet, WalletTransaction } from "@/features/wallet/types/wallet";
import type { PaginatedResponse, PaginationParams } from "@/utils/apiResponse";
import { getErrorMessage } from "@/utils/errorHandler";

// 🔹 Lấy tất cả partner với pagination (format mới)
export const fetchAllPartners = createAsyncThunk<
  PaginatedResponse<Partner>,
  PaginationParams | undefined,
  { rejectValue: string }
>("partners/fetchAll", async (params, { rejectWithValue }) => {
  try {
    return await partnerService.getAll(params); // trả về PaginatedResponse<Partner>
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

export const fundEventByPartner = createAsyncThunk<
  { message: string },
  {
    partnerId: number | string;
    eventId: number | string;
    amount: number | string;
  },
  { rejectValue: string }
>(
  "partners/fundEvent",
  async ({ partnerId, eventId, amount }, { rejectWithValue }) => {
    try {
      return await partnerService.fundEvent(partnerId, { eventId, amount });
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err, "Lỗi khi nạp quỹ sự kiện"));
    }
  }
);

// 🔹 Partner broadcast attendees
export const broadcastByPartner = createAsyncThunk<
  { message: string },
  { partnerId: number | string; payload: Record<string, any> },
  { rejectValue: string }
>("partners/broadcast", async ({ partnerId, payload }, { rejectWithValue }) => {
  try {
    return await partnerService.broadcast(partnerId, payload);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi gửi broadcast"));
  }
});

// 🔹 Get partner wallet
export const fetchPartnerWallet = createAsyncThunk<
  Wallet,
  number | string,
  { rejectValue: string }
>("partners/getWallet", async (partnerId, { rejectWithValue }) => {
  try {
    return await partnerService.getWallet(partnerId);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi lấy ví đối tác"));
  }
});

// 🔹 Get partner wallet history
export const fetchPartnerWalletHistory = createAsyncThunk<
  WalletTransaction[],
  { partnerId: number | string; params?: Record<string, any> },
  { rejectValue: string }
>(
  "partners/getWalletHistory",
  async ({ partnerId, params }, { rejectWithValue }) => {
    try {
      return await partnerService.getWalletHistory(partnerId, params);
    } catch (err: any) {
      return rejectWithValue(getErrorMessage(err, "Lỗi khi lấy lịch sử ví"));
    }
  }
);

// 🔹 Get partner's events
export const fetchPartnerEvents = createAsyncThunk<
  any[],
  { partnerId: number | string; params?: Record<string, any> },
  { rejectValue: string }
>("partners/getEvents", async ({ partnerId, params }, { rejectWithValue }) => {
  try {
    return await partnerService.getEvents(partnerId, params);
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi lấy danh sách sự kiện của đối tác")
    );
  }
});

// 🔹 Get partner by id
export const fetchPartnerById = createAsyncThunk<
  Partner,
  number | string,
  { rejectValue: string }
>("partners/getById", async (id, { rejectWithValue }) => {
  try {
    return await partnerService.getById(id);
  } catch (err: any) {
    return rejectWithValue(getErrorMessage(err, "Lỗi khi lấy đối tác"));
  }
});
