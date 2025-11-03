import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { EventCategory } from "@/features/eventCategories/types/eventCategories";
import type { PaginatedResponseMeta, PaginatedResponse } from "@/utils/apiResponse";
import {
  fetchAllEventCategories,
  fetchEventCategoryById,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
} from "../thunks/eventCategoryThunks";

interface EventCategoryState {
  list: EventCategory[];
  pagination: PaginatedResponseMeta | null; // metadata cho pagination
  detailCategory: EventCategory | null; // chi tiết
  loadingList: boolean;
  loadingDetail: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: EventCategoryState = {
  list: [],
  pagination: null,
  detailCategory: null,
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
      state.detailCategory = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetch all (format mới: PaginatedResponse)
      .addCase(fetchAllEventCategories.pending, (state) => {
        state.loadingList = true;
      })
      .addCase(
        fetchAllEventCategories.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<EventCategory>>) => {
          state.loadingList = false;
          state.list = action.payload?.data || [];
          state.pagination = action.payload?.meta || null;
        }
      )
      .addCase(fetchAllEventCategories.rejected, (state, action) => {
        state.loadingList = false;
        state.error = (action.payload as string) || null;
      })

      // fetch by id
      .addCase(fetchEventCategoryById.pending, (state) => {
        state.loadingDetail = true;
      })
      .addCase(
        fetchEventCategoryById.fulfilled,
        (state, action: PayloadAction<EventCategory>) => {
          state.loadingDetail = false;
          state.detailCategory = action.payload;
        }
      )
      .addCase(fetchEventCategoryById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = (action.payload as string) || null;
      })

      // create
      .addCase(createEventCategory.pending, (state) => {
        state.saving = true;
      })
      .addCase(
        createEventCategory.fulfilled,
        (state, action: PayloadAction<EventCategory>) => {
          state.saving = false;
          state.list = [...state.list, action.payload];
        }
      )
      .addCase(createEventCategory.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) || null;
      })

      // update
      .addCase(updateEventCategory.pending, (state) => {
        state.saving = true;
      })
      .addCase(
        updateEventCategory.fulfilled,
        (state, action: PayloadAction<EventCategory>) => {
          state.saving = false;
          const idx = state.list.findIndex((c) => c.id === action.payload.id);
          if (idx !== -1) {
            state.list[idx] = action.payload;
          } else {
            state.list = [...state.list, action.payload];
          }
        }
      )
      .addCase(updateEventCategory.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) || null;
      })

      // delete
      .addCase(deleteEventCategory.pending, (state) => {
        state.deleting = true;
      })
      .addCase(
        deleteEventCategory.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.deleting = false;
          state.list = state.list.filter((c) => c.id !== action.payload);
        }
      )
      .addCase(deleteEventCategory.rejected, (state, action) => {
        state.deleting = false;
        state.error = (action.payload as string) || null;
      });
  },
});

export const { resetDetail, clearError } = eventCategorySlice.actions;
export default eventCategorySlice.reducer;
