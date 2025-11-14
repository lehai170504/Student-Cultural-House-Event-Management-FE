import axiosInstance from "@/config/axiosInstance";
import type {
  FetchNotificationsParams,
  NotificationListResponse,
  NotificationMessage,
  UnreadCountResponse,
} from "../types/notification";

const endpoint = "/me/broadcasts";

export const notificationService = {
  async getMyBroadcasts(
    params?: FetchNotificationsParams
  ): Promise<NotificationMessage[]> {
    const res = await axiosInstance.get<NotificationListResponse | NotificationMessage[]>(
      endpoint,
      {
        params,
      }
    );

    const payload = res.data;

    if (Array.isArray(payload)) {
      return payload;
    }

    const data = payload?.data;
    if (Array.isArray(data)) {
      return data;
    }

    return [];
  },

  async getUnreadCount(): Promise<number> {
    const res = await axiosInstance.get<UnreadCountResponse | { count: number }>(
      `${endpoint}/unread-count`
    );
    const payload = res.data;
    if (typeof payload?.count === "number") {
      return payload.count;
    }
    return 0;
  },

  async markAsRead(deliveryIds: string[]): Promise<void> {
    if (!deliveryIds || deliveryIds.length === 0) return;

    await Promise.all(
      deliveryIds.map((id) =>
        axiosInstance.patch(`${endpoint}/${id}/read`)
      )
    );
  },
};

