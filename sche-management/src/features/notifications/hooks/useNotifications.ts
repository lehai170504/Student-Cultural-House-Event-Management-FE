import { useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchNotifications, fetchUnreadCount, markNotificationsRead } from "../thunks/notificationThunks";
import {
  clearNotifications as clearNotificationsAction,
} from "../slices/notificationSlice";
import type { FetchNotificationsParams } from "../types/notification";

export const useNotifications = () => {
  const dispatch = useAppDispatch();
  const notificationState = useAppSelector((state) => state.notification);

  const loadNotifications = useCallback(
    async (params?: FetchNotificationsParams) => {
      await dispatch(fetchNotifications(params));
      await dispatch(fetchUnreadCount());
    },
    [dispatch]
  );

  const clearNotifications = useCallback(() => {
    dispatch(clearNotificationsAction());
  }, [dispatch]);

  const setNotificationsRead = useCallback(
    async (deliveryIds: string[]) => {
      if (!deliveryIds.length) return;
      await dispatch(markNotificationsRead(deliveryIds));
      await dispatch(fetchUnreadCount());
    },
    [dispatch]
  );

  return {
    notifications: notificationState.items,
    loading: notificationState.loading,
    error: notificationState.error,
    lastFetchedAt: notificationState.lastFetchedAt,
    unreadCount: notificationState.unreadCount,
    loadingUnreadCount: notificationState.loadingUnreadCount,
    loadNotifications,
    clearNotifications,
    setNotificationsRead,
  };
};

