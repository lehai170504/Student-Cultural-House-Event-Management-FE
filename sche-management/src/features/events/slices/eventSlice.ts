import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Event,
  AttendeesResponse,
  EventFinalizeResponse,
  EventApproveResponse,
  GetAllEventsResponse,
} from "@/features/events/types/events";
import {
  fetchAllEvents,
  fetchEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  registerForEvent,
  sendEventFeedback,
  checkinEvent,
  fetchEventAttendees,
  finalizeEvent,
  approveEvent,
  checkinByPhoneNumber,
} from "../thunks/eventThunks";

interface EventState {
  list: Event[];
  detail: Event | null;
  loadingList: boolean;
  loadingDetail: boolean;
  saving: boolean;
  deleting: boolean;
  error: string | null;

  registering: boolean;
  sendingFeedback: boolean;
  checkingIn: boolean;
  loadingAttendees: boolean;
  attendees: AttendeesResponse | null;

  finalizing: boolean;
  approving: boolean;
  submittingCheckin: boolean;

  pagination: {
    currentPage: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    isLastPage: boolean;
  } | null;
}

const initialState: EventState = {
  list: [],
  detail: null,
  loadingList: false,
  loadingDetail: false,
  saving: false,
  deleting: false,
  error: null,

  registering: false,
  sendingFeedback: false,
  checkingIn: false,
  loadingAttendees: false,
  attendees: null,

  finalizing: false,
  approving: false,
  submittingCheckin: false,

  pagination: null,
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
    resetPagination: (state) => {
      state.list = [];
      state.pagination = null;
    },
    updateEventDetail: (state, action: PayloadAction<Event>) => {
      const updated = action.payload;
      const idx = state.list.findIndex((e) => e.id === updated.id);
      if (idx !== -1) state.list[idx] = updated;
      if (state.detail?.id === updated.id) state.detail = updated;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all events
      .addCase(fetchAllEvents.pending, (state) => {
        state.loadingList = true;
      })
      .addCase(
        fetchAllEvents.fulfilled,
        (state, action: PayloadAction<GetAllEventsResponse>) => {
          state.loadingList = false;
          const payload = action.payload;
          state.list = payload.data || [];
          state.pagination = {
            currentPage: payload.meta.currentPage,
            pageSize: payload.meta.pageSize,
            totalElements: payload.meta.totalItems,
            totalPages: payload.meta.totalPages,
            isLastPage: payload.meta.currentPage >= payload.meta.totalPages,
          };
          state.error = null;
        }
      )

      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loadingList = false;
        state.error = action.payload || null;
      })

      // Fetch event detail
      .addCase(fetchEventById.pending, (state) => {
        state.loadingDetail = true;
      })
      .addCase(
        fetchEventById.fulfilled,
        (state, action: PayloadAction<Event>) => {
          state.loadingDetail = false;
          state.detail = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchEventById.rejected, (state, action) => {
        state.loadingDetail = false;
        state.error = action.payload || null;
      })

      // Create event
      .addCase(createEvent.pending, (state) => {
        state.saving = true;
      })
      .addCase(createEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.saving = false;
        state.list = [action.payload, ...state.list];
        state.error = null;
      })
      .addCase(createEvent.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || null;
      })

      // Update event
      .addCase(updateEvent.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.saving = false;
        const updated = action.payload;
        const idx = state.list.findIndex((e) => e.id === updated.id);
        if (idx !== -1) state.list[idx] = updated;
        if (state.detail?.id === updated.id) state.detail = updated;
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload || null;
      })

      // Delete event
      .addCase(deleteEvent.pending, (state) => {
        state.deleting = true;
      })
      .addCase(
        deleteEvent.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.deleting = false;
          state.list = state.list.filter((e) => e.id !== action.payload);
          state.error = null;
        }
      )
      .addCase(deleteEvent.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload || null;
      })

      // Register / Feedback / Check-in
      .addCase(registerForEvent.pending, (state) => {
        state.registering = true;
      })
      .addCase(registerForEvent.fulfilled, (state) => {
        state.registering = false;
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.registering = false;
        state.error = action.payload || null;
      })
      .addCase(sendEventFeedback.pending, (state) => {
        state.sendingFeedback = true;
      })
      .addCase(sendEventFeedback.fulfilled, (state) => {
        state.sendingFeedback = false;
      })
      .addCase(sendEventFeedback.rejected, (state, action) => {
        state.sendingFeedback = false;
        state.error = action.payload || null;
      })
      .addCase(checkinEvent.pending, (state) => {
        state.checkingIn = true;
      })
      .addCase(checkinEvent.fulfilled, (state) => {
        state.checkingIn = false;
      })
      .addCase(checkinEvent.rejected, (state, action) => {
        state.checkingIn = false;
        state.error = action.payload || null;
      })

      // Fetch attendees
      .addCase(fetchEventAttendees.pending, (state) => {
        state.loadingAttendees = true;
      })
      .addCase(
        fetchEventAttendees.fulfilled,
        (state, action: PayloadAction<AttendeesResponse>) => {
          state.loadingAttendees = false;
          state.attendees = action.payload;
        }
      )
      .addCase(fetchEventAttendees.rejected, (state, action) => {
        state.loadingAttendees = false;
        state.error = action.payload || null;
      })

      // Finalize event
      .addCase(finalizeEvent.pending, (state) => {
        state.finalizing = true;
      })
      .addCase(
        finalizeEvent.fulfilled,
        (state, action: PayloadAction<EventFinalizeResponse>) => {
          state.finalizing = false;
          const updated = action.payload;
          const idx = state.list.findIndex((e) => e.id === updated.id);
          if (idx !== -1) state.list[idx] = updated;
          if (state.detail?.id === updated.id) state.detail = updated;
        }
      )
      .addCase(finalizeEvent.rejected, (state, action) => {
        state.finalizing = false;
        state.error = action.payload || null;
      })

      // Approve event
      .addCase(approveEvent.pending, (state) => {
        state.approving = true;
      })
      .addCase(
        approveEvent.fulfilled,
        (state, action: PayloadAction<EventApproveResponse>) => {
          state.approving = false;
          const approved = action.payload;
          const idx = state.list.findIndex((e) => e.id === approved.id);
          if (idx !== -1) state.list[idx] = approved;
          if (state.detail?.id === approved.id) state.detail = approved;
          state.error = null;
        }
      )
      .addCase(approveEvent.rejected, (state, action) => {
        state.approving = false;
        state.error = action.payload || null;
      })

      // Check-in by phone
      .addCase(checkinByPhoneNumber.pending, (state) => {
        state.submittingCheckin = true;
      })
      .addCase(checkinByPhoneNumber.fulfilled, (state) => {
        state.submittingCheckin = false;
      })
      .addCase(checkinByPhoneNumber.rejected, (state, action) => {
        state.submittingCheckin = false;
        state.error = action.payload || null;
      });
  },
});

export const { resetDetail, clearError, resetPagination, updateEventDetail } =
  eventSlice.actions;
export default eventSlice.reducer;
