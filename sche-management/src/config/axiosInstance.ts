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
 * Helper: Lấy id_token để BE có thể decode lấy email và user info
 */
const getIdToken = (): string | null => {
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
    return user?.id_token || null;
  } catch (err) {
    console.error("❌ Error reading id token:", err);
    return null;
  }
};

/**
 * Tạo Axios instance mặc định
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  timeout: 30000, // Tăng timeout từ 10s lên 30s
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 🟢 Request Interceptor: Gắn token vào header Authorization
 * - access_token: dùng để authorize API calls
 * - id_token: gửi kèm để BE có thể decode lấy email và user info đầy đủ
 */
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const accessToken = getAccessToken();
      const idToken = getIdToken();
      
      // Ensure headers object exists
      config.headers = config.headers ?? {};
      
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      
      // Gửi id_token trong custom header để BE decode lấy email và user info
      if (idToken) {
        config.headers["X-ID-Token"] = idToken;
      }

      // Headers để xử lý ngrok và CORS
      config.headers["ngrok-skip-browser-warning"] = "true";
      config.headers["Accept"] = "application/json";

      // Nếu body là FormData, để browser tự set boundary
      if (config.data instanceof FormData) {
        delete (config.headers as Record<string, any>)["Content-Type"];
      }
      
      // Chỉ log request nếu không phải preflight
      if (config.method?.toLowerCase() !== "options") {
        // Optional: log only in development
        if (process.env.NODE_ENV === "development") {
          console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
        }
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

/**
 * 🔴 Response Interceptor: Xử lý lỗi 401, 403, network, CORS
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    // Suppress CORS errors trong console - đây là vấn đề backend cần fix
    if (!error.response && error.message.includes("CORS")) {
      // CORS error: chỉ log nhẹ, không spam console
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ CORS Error - Backend cần config CORS headers");
      }
      return Promise.reject(error);
    }

    if (error.response) {
      const status = error.response.status;

      if (status === 401 && typeof window !== "undefined") {
        // Chỉ redirect nếu không phải public route (homepage, login, etc.)
        const currentPath = window.location.pathname;
        const publicRoutes = ["/", "/login", "/events", "/contact", "/gifts"];
        const isPublicRoute = publicRoutes.some(route => 
          currentPath === route || currentPath.startsWith(route + "/")
        );

        if (!isPublicRoute) {
          console.warn("⚠️ Token expired or invalid, redirecting to login");
          sessionStorage.clear();
          window.location.href = "/login";
        } else {
          // Public route: chỉ log error, không redirect
          if (process.env.NODE_ENV === "development") {
            console.warn("⚠️ 401 on public route, API may require authentication");
          }
        }
      }

      // Chỉ log detailed error trong development
      if (process.env.NODE_ENV === "development") {
        console.error("API Error:", error.response.data);
      }
    } else {
      // Network error: chỉ log trong development, suppress CORS messages
      if (process.env.NODE_ENV === "development" && !error.message.includes("CORS")) {
        console.error("Network Error:", error.message);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
