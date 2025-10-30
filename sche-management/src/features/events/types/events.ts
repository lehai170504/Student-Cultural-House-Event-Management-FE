// src/features/events/types/events.ts
import { EventCategory } from "@/features/eventCategories/types/eventCategories";

export interface Event {
  id: number;
  partnerId: number;
  partnerName: string;
  title: string;
  description: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  location: string;
  category: EventCategory;
  rewardPerCheckin: number;
  totalBudgetCoin: number;
  status: string;
  createdAt: string; // ISO string
}

export interface CreateEvent {
  partnerId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  categoryId: number;
  rewardPerCheckin: number;
  totalBudgetCoin: number;
}

export interface UpdateEvent {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  categoryId: number;
  rewardPerCheckin: number;
  status: string;
}

export type EventDetail = Event;

export interface PagedResponse<T> {
  content: T[];
  number: number; // Trang hiện tại (0-indexed)
  size: number; // Kích thước trang
  totalElements: number; // Tổng số phần tử
  totalPages: number; // Tổng số trang
  last: boolean; // Có phải trang cuối không
}

export interface EventRegistration {
  id: number;
  studentId: number;
  studentName: string;
  eventId: number;
  eventTitle: string;
  registeredAt: string; // ISO string
}

// ✅ 2. Gửi feedback
export interface EventFeedbackRequest {
  rating: number; // 1–5
  comments: string;
}

export interface EventFeedbackResponse {
  id: number;
  studentId: number;
  eventId: number;
  eventTitle: string;
  rating: number;
  comments: string;
  sentimentLabel: string;
  createdAt: string; // ISO
}

// ✅ 3. Check-in sự kiện
export interface EventCheckinRequest {
  eventId: number;
  phoneNumber: string;
}

export interface EventCheckinResponse {
  checkinId: number;
  studentName: string;
  eventTitle: string;
  rewardGranted: boolean;
  rewardAmount: number;
}

// ✅ 4. Danh sách người tham dự
export interface Attendee {
  id: number;
  universityId: number;
  universityName: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string;
  createdAt: string; // ISO string
}

// ✅ Paged Attendees response
export interface AttendeesResponse {
  totalElements: number;
  totalPages: number;
  size: number;
  content: Attendee[];
  number: number;
  sort: {
    direction: string;
    nullHandling: string;
    ascending: boolean;
    property: string;
    ignoreCase: boolean;
  }[];
  numberOfElements: number;
  pageable: {
    offset: number;
    sort: {
      direction: string;
      nullHandling: string;
      ascending: boolean;
      property: string;
      ignoreCase: boolean;
    }[];
    pageNumber: number;
    pageSize: number;
    paged: boolean;
    unpaged: boolean;
  };
  first: boolean;
  last: boolean;
  empty: boolean;
}
