export interface apiResponse {
  status: "success" | "fail";
  message: string;
  data: string[];
  error: string;
}
