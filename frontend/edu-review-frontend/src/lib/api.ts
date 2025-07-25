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
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1",
  prepareHeaders: (headers) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }

    // Add content type
    headers.set("Content-Type", "application/json");

    return headers;
  },
});

// Custom base query with error handling
const baseQueryWithErrorHandling: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const result = await baseQuery(args, api, extraOptions);

  // Handle different error scenarios
  if (result.error) {
    const { status, data } = result.error;

    // Handle authentication errors
    if (status === 401) {
      // Clear auth token and redirect to login
      localStorage.removeItem("authToken");
      window.location.href = "/login";
      return result;
    }

    // Handle forbidden errors
    if (status === 403) {
      console.error("Access forbidden:", data);
      return result;
    }

    // Handle server errors
    if (typeof status === "number" && status >= 500) {
      console.error("Server error:", data);
      return result;
    }

    // Handle validation errors
    if (status === 422) {
      console.error("Validation error:", data);
      return result;
    }

    // Handle not found errors
    if (status === 404) {
      console.error("Resource not found:", data);
      return result;
    }
  }

  return result;
};

// Create API slice
export const api = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["User", "Review", "Course", "Institution", "Blog"],
  endpoints: () => ({}),
});

// Export hooks for use in components
export const { usePrefetch } = api;
