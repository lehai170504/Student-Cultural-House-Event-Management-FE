import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

/**
 * Helper: Lấy access_token ưu tiên từ localStorage (giữ được giữa tabs),
 * fallback sang sessionStorage nếu không có.
 */
const getAccessToken = (): string | null => {
  try {
    const authority = process.env.NEXT_PUBLIC_COGNITO_AUTHORITY!;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
    const key = `oidc.user:${authority}:${clientId}`;

    // Ưu tiên localStorage để giữ đăng nhập giữa tabs
    const userJson =
      (typeof window !== "undefined" && window.localStorage.getItem(key)) ||
      (typeof window !== "undefined" && window.sessionStorage.getItem(key));
    if (!userJson) return null;

    const user = JSON.parse(userJson);
    return user?.access_token || null;
  } catch (err) {
    console.error("❌ Error reading access token:", err);
    return null;
  }
};

/**
 * Tạo Axios instance mặc định
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 🟢 Request Interceptor: Gắn token vào header Authorization
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = getAccessToken();
      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      config.headers["ngrok-skip-browser-warning"] = "true";
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * 🔴 Response Interceptor: Xử lý lỗi 401, 403, network
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;

      if (status === 401 && typeof window !== "undefined") {
        console.warn("⚠️ Token expired or invalid, redirecting to login");
        sessionStorage.clear();
        window.location.href = "/login";
      }

      console.error("API Error:", error.response.data);
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
