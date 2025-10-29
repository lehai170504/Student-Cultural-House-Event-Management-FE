import { createSlice } from "@reduxjs/toolkit";
import type {
  EventCategory,
  EventCategoryDetail,
} from "@/features/eventCategories/types/eventCategories";
import {
  fetchAllEventCategories,
  fetchEventCategoryById,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
} from "../thunks/eventCategoryThunks";

interface EventCategoryState {
  list: EventCategory[];
  detail: EventCategoryDetail | null;
  loadingList: boolean;
  loadingDetail: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: EventCategoryState = {
  list: [],
  detail: null,
  loadingList: false,
  loadingDetail: false,
  saving: false,
  deleting: false,
  error: null,
};

const eventCategorySlice = createSlice({
  name: "eventCategory",
  initialState,
  reducers: {
    resetDetail: (state) => {
      state.detail = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchAll
      .addCase(fetchAllEventCategories.pending, (state) => {
        state.loadingList = true;
      })
      .addCase(fetchAllEventCategories.fulfilled, (state, action) => {
        state.loadingList = false;
        state.list = action.payload;
      })
      .addCase(fetchAllEventCategories.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload || null;
      })
      // fetchById
      .addCase(fetchEventCategoryById.fulfilled, (state, action) => {
        state.detail = action.payload;
      })
      // create
      .addCase(createEventCategory.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      // update
      .addCase(updateEventCategory.fulfilled, (state, action) => {
        const idx = state.list.findIndex((c) => c.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      // delete
      .addCase(deleteEventCategory.fulfilled, (state, action) => {
        state.list = state.list.filter((c) => c.id !== action.payload);
      });
  },
});

export const { resetDetail, clearError } = eventCategorySlice.actions;
export default eventCategorySlice.reducer;
