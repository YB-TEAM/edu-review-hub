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

// Base query with error handling
const baseQuery = fetchBaseQuery({
  baseUrl: "http://localhost:3000/api/v1", // Fixed: Changed from 3000 to 3001 to match backend
  prepareHeaders: (headers: Headers) => {
    // Add auth token if available
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
    }

    // Add content type
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

// Custom base query with error handling
export const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQuery(args, api, extraOptions);

  // Chỉ log khi có lỗi
  if (result.error) {
    const { status } = result.error;
    console.log("🔐 API: Error response", { status, error: result.error });

    // Handle authentication errors
    if (status === 401) {
      console.log("🔐 API: 401 Unauthorized - Token may be invalid or expired");
      
      // Check if this is a logout request - don't handle 401 for logout
      const isLogoutRequest = typeof args === 'object' && args.url === '/auth/logout';
      if (isLogoutRequest) {
        console.log("🔐 API: 401 on logout request - this is expected behavior");
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
