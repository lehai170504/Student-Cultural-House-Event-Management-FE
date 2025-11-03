export interface EventCategory {
  id: number;
  name: string;
  description: string;
}
export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface EventCategoryResponse {
  meta: PaginationMeta; 
  data: EventCategory[];
}

export interface CreateEventCategory {
  name: string;
  description: string;
}

export type UpdateEventCategory = CreateEventCategory;

export type EventCategoryDetail = EventCategory;
