import { createAsyncThunk } from "@reduxjs/toolkit";
import { feedbackService } from "../services/feedbackService";
import type { FeedbackResponse } from "../types/feedback";
import type { PaginationParams } from "@/utils/apiResponse";
import { getErrorMessage } from "@/utils/errorHandler";

// 🔹 Mở rộng params để có thể include eventId
export interface FeedbackPaginationParams extends PaginationParams {
  eventId?: string;
}

// 🔹 Lấy tất cả feedback với pagination và filter theo eventId
export const fetchAllFeedbacks = createAsyncThunk<
  FeedbackResponse,
  FeedbackPaginationParams | undefined,
  { rejectValue: string }
>("feedback/fetchAll", async (params, { rejectWithValue }) => {
  try {
    return await feedbackService.getAll(params); // trả về { data: Feedback[], meta: FeedbackMeta }
  } catch (err: any) {
    return rejectWithValue(
      getErrorMessage(err, "Lỗi khi tải danh sách feedback")
    );
  }
});
