import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { NotificationMessage } from "@/features/notifications/types/notification";
import { fetchNotifications, fetchUnreadCount, markNotificationsRead } from "../thunks/notificationThunks";

interface NotificationState {
  items: NotificationMessage[];
  loading: boolean;
  error: string | null;
  lastFetchedAt: string | null;
  unreadCount: number;
  loadingUnreadCount: boolean;
}

const initialState: NotificationState = {
  items: [],
  loading: false,
  error: null,
  lastFetchedAt: null,
  unreadCount: 0,
  loadingUnreadCount: false,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    clearNotifications: (state) => {
      state.items = [];
      state.error = null;
      state.lastFetchedAt = null;
      state.unreadCount = 0;
    },
    markNotificationsAsRead: (
      state,
      action: PayloadAction<{ deliveryIds: string[] }>
    ) => {
      const { deliveryIds } = action.payload;
      state.items = state.items.map((item) =>
        deliveryIds.includes(item.deliveryId)
          ? { ...item, status: "READ" }
          : item
      );
      state.unreadCount = Math.max(
        0,
        state.unreadCount - deliveryIds.length
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchNotifications.fulfilled,
        (state, action: PayloadAction<NotificationMessage[]>) => {
          state.loading = false;
          state.items = action.payload;
          state.lastFetchedAt = new Date().toISOString();
          state.unreadCount = action.payload.filter(
            (item) => (item.status || "").toUpperCase() === "UNREAD"
          ).length;
        }
      )
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Không thể tải thông báo";
      })
      .addCase(fetchUnreadCount.pending, (state) => {
        state.loadingUnreadCount = true;
      })
      .addCase(
        fetchUnreadCount.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loadingUnreadCount = false;
          state.unreadCount = action.payload;
        }
      )
      .addCase(fetchUnreadCount.rejected, (state) => {
        state.loadingUnreadCount = false;
      })
      .addCase(
        markNotificationsRead.fulfilled,
        (state, action: PayloadAction<string[]>) => {
          const deliveryIds = action.payload;
          state.items = state.items.map((item) =>
            deliveryIds.includes(item.deliveryId)
              ? { ...item, status: "READ" }
              : item
          );
          state.unreadCount = Math.max(
            0,
            state.unreadCount - deliveryIds.length
          );
        }
      )
      .addCase(markNotificationsRead.rejected, (state, action) => {
        state.error = action.payload ?? state.error;
      });
  },
});

export const { clearNotifications, markNotificationsAsRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;

