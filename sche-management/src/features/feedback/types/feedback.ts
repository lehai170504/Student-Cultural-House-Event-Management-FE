export interface Feedback {
  id: string;
  studentId: string;
  studentName: string;
  eventId: string;
  eventTitle: string;
  rating: number;
  comments: string;
  sentimentLabel: string;
  createdAt: string;
}

export interface FeedbackMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface FeedbackResponse {
  data: Feedback[];
  meta: FeedbackMeta;
}
