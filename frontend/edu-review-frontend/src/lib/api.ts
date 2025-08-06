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
  baseUrl: "http://localhost:3000/api/v1",
  prepareHeaders: (headers) => {
    // Add auth token if available
    const token = localStorage.getItem("accessToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
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

  // Chỉ chạy trên client side và khi có data
  if (typeof window !== "undefined" && result.data) {
    const token = localStorage.getItem("accessToken");
  }

  if (result.error) {
    const { status } = result.error;

    // Handle authentication errors
    if (status === 401) {
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
