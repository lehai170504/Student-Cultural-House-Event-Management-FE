import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Feedback, FeedbackResponse } from "../types/feedback";
import { fetchAllFeedbacks } from "../thunks/feedbackThunks";

interface FeedbackState {
  list: Feedback[];
  loadingList: boolean;
  pagination: FeedbackResponse["meta"] | null;
  error: string | null;
  filterEventId?: string; 
}

const initialState: FeedbackState = {
  list: [],
  loadingList: false,
  pagination: null,
  error: null,
  filterEventId: undefined,
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilterEventId: (state, action: PayloadAction<string | undefined>) => {
      state.filterEventId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFeedbacks.pending, (state) => {
        state.loadingList = true;
        state.error = null;
      })
      .addCase(
        fetchAllFeedbacks.fulfilled,
        (state, action: PayloadAction<FeedbackResponse>) => {
          state.loadingList = false;
          state.list = action.payload.data || [];
          state.pagination = action.payload.meta || null;
        }
      )
      .addCase(fetchAllFeedbacks.rejected, (state, action) => {
        state.loadingList = false;
        state.error = (action.payload as string) || null;
      });
  },
});

export const { clearError, setFilterEventId } = feedbackSlice.actions;
export default feedbackSlice.reducer;
