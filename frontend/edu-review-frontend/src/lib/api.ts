import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";

// Custom error types
export interface ApiError {
  status: number;
  data: {
    message: string;
    errors?: Record<string, string[]>;
    code?: string;
  };
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

// Get API base URL from environment
const getApiBaseUrl = (): string => {
  // Priority: .env.local > .env > default
  const envUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  if (envUrl) {
    return envUrl;
  }

  // Fallback URLs based on environment
  if (process.env.NODE_ENV === "production") {
    return "https://edu-review-hub.onrender.com/api/v1";
  }

  return "http://localhost:3000/api/v1";
};

// Get API timeout from environment
const getApiTimeout = (): number => {
  const timeout = process.env.NEXT_PUBLIC_API_TIMEOUT || "15000";
  return parseInt(timeout, 10);
};

// Error message mapping
const getErrorMessage = (status: number, errorData: any): string => {
  switch (status) {
    case 400:
      return errorData.message || "Yêu cầu không hợp lệ";
    case 401:
      return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
    case 403:
      return "Bạn không có quyền thực hiện hành động này";
    case 404:
      return "Không tìm thấy tài nguyên yêu cầu";
    case 409:
      return "Dữ liệu đã tồn tại";
    case 422:
      return errorData.message || "Dữ liệu không hợp lệ";
    case 429:
      return "Quá nhiều yêu cầu. Vui lòng thử lại sau.";
    case 500:
      return "Lỗi máy chủ nội bộ";
    case 502:
      return "Máy chủ không phản hồi";
    case 503:
      return "Máy chủ đang bảo trì";
    case 504:
      return "Máy chủ phản hồi quá thời gian";
    default:
      return errorData.message || "Đã xảy ra lỗi không xác định";
  }
};

// Base query with error handling
const baseQuery = fetchBaseQuery({
  baseUrl: getApiBaseUrl(),
  prepareHeaders: (headers: Headers) => {
    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
    }

    // Don't set Content-Type here - let individual endpoints handle it
    // This allows FormData to work properly for file uploads
    return headers;
  },
});

// Custom base query with error handling
export const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args: any, api: any, extraOptions: any) => {
  const baseUrl = getApiBaseUrl();
  const timeout = getApiTimeout();

  // Debug log in development
  if (process.env.NODE_ENV === "development") {
    console.log("🌐 API Request:", {
      baseUrl,
      timeout,
      args: typeof args === "string" ? args : args.url,
      method: typeof args === "string" ? "GET" : args.method || "GET",
    });
  }

  const result = await baseQuery(args, api, extraOptions);

  // Handle errors
  if (result.error) {
    const { status } = result.error;
    console.log("🔐 API: Error response", { status, error: result.error });

    // Handle authentication errors
    if (status === 401) {
      console.log("🔐 API: 401 Unauthorized - Token may be invalid or expired");

      // Check if this is a logout request - don't handle 401 for logout
      const isLogoutRequest =
        typeof args === "object" && args.url === "/auth/logout";
      if (isLogoutRequest) {
        console.log(
          "🔐 API: 401 on logout request - this is expected behavior"
        );
        return result;
      }

      // Check if we have a refresh token
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        console.log("🔐 API: Attempting token refresh...");
        // You can implement token refresh logic here if needed
        // For now, just return the error and let components handle logout
      }
      // Don't clear tokens immediately, let the component handle it
      return result;
    }
  }

  return result;
};

// Create API slice
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["User", "Profile", "Review", "Course", "Institution", "Blog"],
  endpoints: () => ({}),
});

// Export hooks for use in components
export const { usePrefetch } = api;

// Export environment helpers
export const apiConfig = {
  getBaseUrl: getApiBaseUrl,
  getTimeout: getApiTimeout,
  isDevelopment: process.env.NODE_ENV === "development",
};

// Export error handling utilities
export const errorHandler = {
  getErrorMessage,
  isNetworkError: (error: any) => error?.status === "FETCH_ERROR",
  isTimeoutError: (error: any) => error?.status === "TIMEOUT",
  isAuthError: (error: any) => error?.status === 401,
  isForbiddenError: (error: any) => error?.status === 403,
  isValidationError: (error: any) => error?.status === 422,
  isServerError: (error: any) => error?.status >= 500,
};
