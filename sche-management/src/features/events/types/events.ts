// src/features/events/types/events.ts
import type { ChangeEvent, FormEvent } from "react";
import type { EventCategory } from "@/features/eventCategories/types/eventCategories";

export interface Event {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  description: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  location: string;
  category: EventCategory;
  pointCostToRegister: number;
  totalRewardPoints: number;
  totalBudgetCoin: number;
  status: string;
  createdAt: string; // ISO string
  maxAttendees?: number; // mới
}
export interface CreateEvent {
  partnerId: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  categoryId: string;
  pointCostToRegister: number;
  totalRewardPoints: number;
  totalBudgetCoin: number;
}

export interface UpdateEvent {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  categoryId: string;
  pointCostToRegister: number;
  totalRewardPoints: number;
  totalBudgetCoin: number;
  status?: string;
}

export interface EventMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface GetAllEventsResponse {
  data: Event[];
  meta: EventMeta;
}

// Response tổng

export interface EventDetailResponse {
  status: number;
  message: string;
  data: Event;
}

export interface PagedResponse<T> {
  content: T[];
  number: number; // Trang hiện tại (0-indexed)
  size: number; // Kích thước trang
  totalElements: number; // Tổng số phần tử
  totalPages: number; // Tổng số trang
  last: boolean; // Có phải trang cuối không
}

export interface EventRegistration {
  id: string;
  studentId: string;
  studentName: string;
  eventId: string;
  eventTitle: string;
  registeredAt: string; // ISO string
}

// ✅ 2. Gửi feedback
export interface EventFeedbackRequest {
  rating: number; // 1–5
  comments: string;
}

export interface EventFeedbackResponse {
  id: string;
  studentId: string;
  eventId: string;
  eventTitle: string;
  rating: number;
  comments: string;
  sentimentLabel: string;
  createdAt: string; // ISO
}

// ✅ 3. Check-in sự kiện
export interface EventCheckinRequest {
  eventId: string;
  phoneNumber: string;
}

export interface EventCheckinResponse {
  checkinId: number;
  studentName: string;
  eventTitle: string;
  rewardGranted: boolean;
  rewardAmount: number;
}

// ✅ Attendee (theo JSON mới)
export interface Attendee {
  id: string;
  fullName: string;
  phoneNumber: string;
  email: string;
  avatarUrl: string;
  createdAt: string | null;
  status: "ACTIVE" | "INACTIVE" | string;
  universityId: string;
  universityName: string;
  walletId: string;
  balance: number;
  currency: string;
}

// ✅ Meta info (theo meta trong JSON)
export interface AttendeeMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

// ✅ Full API response
export interface AttendeesResponse {
  data: Attendee[];
  meta: AttendeeMeta;
}

export interface EventFinalizeResponse {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  pointCostToRegister: number;
  totalRewardPoints: number;
  totalBudgetCoin: number;
  status: string;
  createdAt: string;
  maxAttendees: number;
}

export interface RequestEventCheckin {
  phoneNumber: string;
}

export interface EventCheckinDetail {
  checkinId: string;
  eventId: string;
  eventTitle: string;
  studentId: number;
  studentName: string;
  registrationTime: string;
  verified: boolean;
  depositPaid: number;
}

export interface EventApproveResponse {
  id: string;
  partnerId: string;
  partnerName: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
  pointCostToRegister: number;
  totalRewardPoints: number;
  totalBudgetCoin: number;
  status: "APPROVED" | "REJECTED" | "PENDING" | "ACTIVE";
  createdAt: string;
  maxAttendees?: number;
}

export interface EventForCheckin {
  id: string;
  title: string;
  studentId: string;
  studentName: string;
}

// UI specific props
export interface EventsSearchBarProps {
  searchTerm: string;
  onSearchChange: (event: ChangeEvent<HTMLInputElement>) => void;
  selectedStatus: null | "ACTIVE" | "FINISHED";
  onStatusFilter: (status: null | "ACTIVE" | "FINISHED") => void;
}

export interface CategoryFiltersProps {
  categories: EventCategory[];
  selectedCategory: string | null;
  categoryIdToCount: Record<string, number>;
  totalCount: number;
  onCategoryFilter: (categoryId: string | null) => void;
}

export interface EventCardProps {
  event: Event;
  index: number;
}

export interface EventCardSkeletonProps {
  index: number;
}

export interface EventsGridProps {
  events: Event[];
  loading: boolean;
  skeletonCount: number;
  queryKey: string;
}

export interface EventsPaginationProps {
  currentPage: number;
  totalPages: number;
  isLastPage: boolean;
  loadingList: boolean;
  onPageChange: (page: number) => void;
  getPageNumbers: () => number[];
}

export interface EventDetailHeaderProps {
  status: string;
  hasRegistered: boolean;
  registering: boolean;
  onRegister: () => void;
  onGoToFeedback: () => void;
  onGoBack: () => void;
}

export interface EventDetailInfoProps {
  event: Event;
}

export interface EventBudgetCardsProps {
  event: Event;
}

export interface EventInfoCardsProps {
  event: Event;
  startDate: string;
  endDate: string;
  maxAttendees: number;
}

export interface EventFeedbackFormProps {
  rating: string;
  comments: string;
  sendingFeedback: boolean;
  onRatingChange: (rating: string) => void;
  onCommentsChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (event: FormEvent) => void;
}

export interface EventFeedbackListProps {
  feedbacks: EventFeedbackResponse[];
  loadingFeedbacks: boolean;
  currentStudentId: string | null;
}
