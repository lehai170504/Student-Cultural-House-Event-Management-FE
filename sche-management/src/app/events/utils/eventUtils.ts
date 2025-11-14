import type { Event } from "@/features/events/types/events";

export const getEventStatus = (event: Event): string => {
  return event.status || "DRAFT";
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "DRAFT":
      return "bg-blue-100 text-blue-700";
    case "ACTIVE":
      return "bg-green-100 text-green-700";
    case "FINALIZED":
      return "bg-orange-100 text-orange-700";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-200 text-gray-700";
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case "DRAFT":
      return "NHÁP";
    case "ACTIVE":
      return "ĐANG DIỄN RA";
    case "FINALIZED":
      return "ĐÃ KẾT THÚC";
    case "FINISHED":
      return "ĐÃ KẾT THÚC";
    case "CANCELLED":
      return "ĐÃ HỦY";
    default:
      return "KHÔNG XÁC ĐỊNH";
  }
};

export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

export const formatTime = (dateString: string): string =>
  new Date(dateString).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
  });

