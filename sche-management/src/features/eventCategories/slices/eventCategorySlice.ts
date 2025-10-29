import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
      // fetch all
      .addCase(fetchAllEventCategories.pending, (state) => {
        state.loadingList = true;
      })
      .addCase(fetchAllEventCategories.fulfilled, (state, action: PayloadAction<EventCategory[]>) => {
        state.loadingList = false;
        state.list = action.payload || [];
      })
      .addCase(fetchAllEventCategories.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload as string || null;
      })

      // fetch by id
      .addCase(fetchEventCategoryById.pending, (state) => {
        state.loadingDetail = true;
      })
      .addCase(fetchEventCategoryById.fulfilled, (state, action: PayloadAction<EventCategoryDetail>) => {
        state.loadingDetail = false;
        state.detail = action.payload;
      })
      .addCase(fetchEventCategoryById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload as string || null;
      })

      // create
      .addCase(createEventCategory.pending, (state) => {
        state.saving = true;
      })
      .addCase(createEventCategory.fulfilled, (state, action: PayloadAction<EventCategoryDetail>) => {
        state.saving = false;
        if (state.list && Array.isArray(state.list)) {
          state.list = [...state.list, action.payload]; // merge vào mảng
        } else {
          state.list = [action.payload]; // fallback
        }
      })
      .addCase(createEventCategory.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string || null;
      })

      // update
      .addCase(updateEventCategory.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateEventCategory.fulfilled, (state, action: PayloadAction<EventCategoryDetail>) => {
        state.saving = false;
        if (state.list && Array.isArray(state.list)) {
          const idx = state.list.findIndex((c) => c.id === action.payload.id);
          if (idx !== -1) {
            state.list[idx] = action.payload;
          } else {
            state.list = [...state.list, action.payload]; 
          }
        } else {
          state.list = [action.payload];
        }
      })
      .addCase(updateEventCategory.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string || null;
      })

      // delete
      .addCase(deleteEventCategory.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteEventCategory.fulfilled, (state, action: PayloadAction<number>) => {
        state.deleting = false;
        state.list = state.list.filter((c) => c.id !== action.payload);
      })
      .addCase(deleteEventCategory.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string || null;
      });
  },
});

export const { resetDetail, clearError } = eventCategorySlice.actions;
export default eventCategorySlice.reducer;
