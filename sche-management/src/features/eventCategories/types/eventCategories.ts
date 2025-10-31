export interface EventCategory {
  id: number;
  name: string;
  description: string;
}

export interface EventCategoryResponse {
  status: number;
  message: string;
  data: EventCategory[];
}

export interface CreateEventCategory {
  name: string;
  description: string;
}

export type UpdateEventCategory = CreateEventCategory;

export type EventCategoryDetail = EventCategory;
