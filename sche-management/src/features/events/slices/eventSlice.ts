import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Event, EventDetail } from "@/features/events/types/events";
import {
  fetchAllEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
} from "../thunks/eventThunks";

interface EventState {
  list: Event[];
  detail: EventDetail | null;
  loadingList: boolean;
  loadingDetail: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

const initialState: EventState = {
  list: [],
  detail: null,
  loadingList: false,
  loadingDetail: false,
  saving: false,
  deleting: false,
  error: null,
};

const eventSlice = createSlice({
  name: "event",
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
      .addCase(fetchAllEvents.pending, (state) => {
        state.loadingList = true;
      })
      .addCase(fetchAllEvents.fulfilled, (state, action: PayloadAction<Event[]>) => {
        state.loadingList = false;
        state.list = action.payload || [];
      })
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload as string || null;
      })

      // fetch by id
      .addCase(fetchEventById.pending, (state) => {
        state.loadingDetail = true;
      })
      .addCase(fetchEventById.fulfilled, (state, action: PayloadAction<EventDetail>) => {
        state.loadingDetail = false;
        state.detail = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload as string || null;
      })

      // create
      .addCase(createEvent.pending, (state) => {
        state.saving = true;
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<EventDetail>) => {
        state.saving = false;
        state.list = state.list ? [...state.list, action.payload] : [action.payload];
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string || null;
      })

      // update
      .addCase(updateEvent.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<EventDetail>) => {
        state.saving = false;
        const idx = state.list.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) {
          state.list[idx] = action.payload;
        } else {
          state.list = [...state.list, action.payload];
        }
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string || null;
      })

      // delete
      .addCase(deleteEvent.pending, (state) => {
        state.deleting = true;
      })
      .addCase(deleteEvent.fulfilled, (state, action: PayloadAction<number>) => {
        state.deleting = false;
        state.list = state.list.filter((e) => e.id !== action.payload);
      })
      .addCase(deleteEvent.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload as string || null;
      });
  },
});

export const { resetDetail, clearError } = eventSlice.actions;
export default eventSlice.reducer;
