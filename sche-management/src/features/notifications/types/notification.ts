export type NotificationStatus = "UNREAD" | "READ" | "DELIVERED" | string;

export interface NotificationMessage {
  deliveryId: string;
  messageContent: string;
  sentAt: string;
  status: NotificationStatus;
  eventId?: string | null;
  eventTitle?: string | null;
}

export interface NotificationListResponse {
  data: NotificationMessage[];
}

export interface FetchNotificationsParams {
  status?: NotificationStatus;
  eventId?: string;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkReadPayload {
  deliveryIds: string[];
}

