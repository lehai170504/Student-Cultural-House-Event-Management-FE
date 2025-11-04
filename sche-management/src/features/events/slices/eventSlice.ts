import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type {
  Event,
  EventRegistration,
  EventFeedbackResponse,
  EventCheckinResponse,
  AttendeesResponse,
  EventFinalizeResponse,
  EventCheckinDetail,
} from "@/features/events/types/events";
import type {
  PaginatedResponseMeta,
  PaginatedResponse,
} from "@/utils/apiResponse";
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
  submittingCheckin: boolean;

  pagination: PaginatedResponseMeta | null;
  currentPage: number;
  totalElements: number;
  totalPages: number;
  pageSize: number;
  isLastPage: boolean;
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
  submittingCheckin: false,

  pagination: null,
  currentPage: 0,
  totalElements: 0,
  totalPages: 0,
  pageSize: 10,
  isLastPage: true,
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
      state.currentPage = 0;
      state.totalElements = 0;
      state.totalPages = 0;
      state.isLastPage = true;
    },
    updateEventDetail: (state, action: PayloadAction<Event>) => {
      if (state.detail?.id === action.payload.id) {
        state.detail = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllEvents.pending, (state) => {
        state.loadingList = true;
      })
      .addCase(
        fetchAllEvents.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Event>>) => {
          state.loadingList = false;
          if (action.payload) {
            state.list = action.payload?.data || [];
            state.pagination = action.payload?.meta || null;

            if (action.payload?.meta) {
              state.currentPage = action.payload.meta.currentPage - 1;
              state.pageSize = action.payload.meta.pageSize;
              state.totalElements = action.payload.meta.totalItems;
              state.totalPages = action.payload.meta.totalPages;
              state.isLastPage =
                action.payload.meta.currentPage >=
                action.payload.meta.totalPages;
            }
          } else {
            state.list = [];
            state.pagination = null;
          }
          state.error = null;
        }
      )
      .addCase(fetchAllEvents.rejected, (state, action) => {
        state.loadingList = false;
        state.error = (action.payload as string) || null;
      })

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
        state.error = (action.payload as string) || null;
      })

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
        state.error = (action.payload as string) || null;
      })

      .addCase(updateEvent.pending, (state) => {
        state.saving = true;
      })
      .addCase(updateEvent.fulfilled, (state, action: PayloadAction<Event>) => {
        state.saving = false;
        const idx = state.list.findIndex((e) => e.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
        if (state.detail?.id === action.payload.id)
          state.detail = action.payload;
        state.error = null;
      })
      .addCase(updateEvent.rejected, (state, action) => {
        state.saving = false;
        state.error = (action.payload as string) || null;
      })

      .addCase(deleteEvent.pending, (state) => {
        state.deleting = true;
      })
      .addCase(
        deleteEvent.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.deleting = false;
          state.list = state.list.filter((e) => e.id !== action.payload);
          state.error = null;
        }
      )
      .addCase(deleteEvent.rejected, (state, action) => {
        state.deleting = false;
        state.error = (action.payload as string) || null;
      })

      .addCase(registerForEvent.pending, (state) => {
        state.registering = true;
      })
      .addCase(registerForEvent.fulfilled, (state) => {
        state.registering = false;
        state.error = null;
      })
      .addCase(registerForEvent.rejected, (state, action) => {
        state.registering = false;
        state.error = (action.payload as string) || null;
      })

      .addCase(sendEventFeedback.pending, (state) => {
        state.sendingFeedback = true;
      })
      .addCase(sendEventFeedback.fulfilled, (state) => {
        state.sendingFeedback = false;
        state.error = null;
      })
      .addCase(sendEventFeedback.rejected, (state, action) => {
        state.sendingFeedback = false;
        state.error = (action.payload as string) || null;
      })

      .addCase(checkinEvent.pending, (state) => {
        state.checkingIn = true;
      })
      .addCase(checkinEvent.fulfilled, (state) => {
        state.checkingIn = false;
        state.error = null;
      })
      .addCase(checkinEvent.rejected, (state, action) => {
        state.checkingIn = false;
        state.error = (action.payload as string) || null;
      })

      .addCase(fetchEventAttendees.pending, (state) => {
        state.loadingAttendees = true;
      })
      .addCase(
        fetchEventAttendees.fulfilled,
        (state, action: PayloadAction<AttendeesResponse>) => {
          state.loadingAttendees = false;
          state.attendees = action.payload;
          state.error = null;
        }
      )
      .addCase(fetchEventAttendees.rejected, (state, action) => {
        state.loadingAttendees = false;
        state.error = (action.payload as string) || null;
      })

      .addCase(finalizeEvent.pending, (state) => {
        state.finalizing = true;
        state.error = null;
      })
      .addCase(
        finalizeEvent.fulfilled,
        (state, action: PayloadAction<EventFinalizeResponse>) => {
          state.finalizing = false;
          const finalizedEvent = action.payload;

          const idx = state.list.findIndex((e) => e.id === finalizedEvent.id);
          if (idx !== -1) {
            state.list[idx] = finalizedEvent;
          }

          if (state.detail?.id === finalizedEvent.id) {
            state.detail = finalizedEvent;
          }
          state.error = null;
        }
      )
      .addCase(finalizeEvent.rejected, (state, action) => {
        state.finalizing = false;
        state.error = (action.payload as string) || null;
      })

      .addCase(checkinByPhoneNumber.pending, (state) => {
        state.submittingCheckin = true;
        state.error = null;
      })
      .addCase(
        checkinByPhoneNumber.fulfilled,
        (state, action: PayloadAction<EventCheckinDetail>) => {
          state.submittingCheckin = false;
          state.error = null;
        }
      )
      .addCase(checkinByPhoneNumber.rejected, (state, action) => {
        state.submittingCheckin = false;
        state.error = (action.payload as string) || null;
      });
  },
});

export const { resetDetail, clearError, resetPagination, updateEventDetail } =
  eventSlice.actions;
export default eventSlice.reducer;
