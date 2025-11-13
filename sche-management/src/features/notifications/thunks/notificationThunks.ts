import { createAsyncThunk } from "@reduxjs/toolkit";
import { notificationService } from "@/features/notifications/services/notificationService";
import type {
  FetchNotificationsParams,
  NotificationMessage,
} from "@/features/notifications/types/notification";
import { getErrorMessage } from "@/utils/errorHandler";

export const fetchNotifications = createAsyncThunk<
  NotificationMessage[],
  FetchNotificationsParams | undefined,
  { rejectValue: string }
>("notifications/fetchAll", async (params, { rejectWithValue }) => {
  try {
    return await notificationService.getMyBroadcasts(params);
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Không thể tải danh sách thông báo")
    );
  }
});

export const fetchUnreadCount = createAsyncThunk<
  number,
  void,
  { rejectValue: string }
>("notifications/fetchUnreadCount", async (_, { rejectWithValue }) => {
  try {
    return await notificationService.getUnreadCount();
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Không thể tải số thông báo chưa đọc")
    );
  }
});

export const markNotificationsRead = createAsyncThunk<
  string[],
  string[],
  { rejectValue: string }
>("notifications/markRead", async (deliveryIds, { rejectWithValue }) => {
  try {
    await notificationService.markAsRead(deliveryIds);
    return deliveryIds;
  } catch (error) {
    return rejectWithValue(
      getErrorMessage(error, "Không thể cập nhật trạng thái thông báo")
    );
  }
});

