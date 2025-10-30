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
