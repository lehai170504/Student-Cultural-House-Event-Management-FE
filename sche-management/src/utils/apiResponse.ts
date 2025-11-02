export interface apiResponse {
  status: "success" | "fail";
  message: string;
  data: string[];
  error: string;
}

// 🔹 Format mới cho tất cả API get all/get list: { data: [...], meta: {...} }
export interface PaginatedResponseMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginatedResponseMeta;
}

// 🔹 Parameters cho pagination (mặc định: page=1, size=10, không có sort)
export interface PaginationParams {
  page?: number; // mặc định 1
  size?: number; // mặc định 10
  // sort không được include theo yêu cầu
}