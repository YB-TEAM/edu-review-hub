import { FetchBaseQueryError } from "@reduxjs/toolkit/query";

// Error handling utilities
export const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError => {
  return typeof error === "object" && error != null && "status" in error;
};

export const getErrorMessage = (error: unknown): string => {
  if (isFetchBaseQueryError(error)) {
    // Handle different error types
    if (error.status === "FETCH_ERROR") {
      return "Network error. Please check your connection.";
    }

    if (error.status === "TIMEOUT_ERROR") {
      return "Request timeout. Please try again.";
    }

    if (error.status === "PARSING_ERROR") {
      return "Invalid response format.";
    }

    // Handle HTTP status errors
    if (typeof error.status === "number") {
      switch (error.status) {
        case 400:
          return "Bad request. Please check your input.";
        case 401:
          return "Unauthorized. Please log in again.";
        case 403:
          return "Access forbidden.";
        case 404:
          return "Resource not found.";
        case 422:
          return "Validation error. Please check your input.";
        case 429:
          return "Too many requests. Please try again later.";
        case 500:
          return "Server error. Please try again later.";
        case 502:
          return "Bad gateway. Please try again later.";
        case 503:
          return "Service unavailable. Please try again later.";
        default:
          return "An error occurred. Please try again.";
      }
    }

    // Handle error data
    if (
      error.data &&
      typeof error.data === "object" &&
      "message" in error.data
    ) {
      return String(error.data.message);
    }
  }

  // Handle generic errors
  if (error instanceof Error) {
    return error.message;
  }

  return "An unexpected error occurred.";
};

// API response utilities
export const createApiResponse = <T>(
  data: T,
  message?: string
): { data: T; message?: string; success: boolean } => {
  return {
    data,
    message,
    success: true,
  };
};

export const createApiError = (
  message: string,
  code?: string
): { message: string; code?: string; success: false } => {
  return {
    message,
    code,
    success: false,
  };
};

// Request utilities
export const createQueryParams = (params: Record<string, unknown>): string => {
  const searchParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((item) => searchParams.append(key, String(item)));
      } else {
        searchParams.append(key, String(value));
      }
    }
  });

  return searchParams.toString();
};

// Pagination utilities
export const createPaginationParams = (
  page: number = 1,
  limit: number = 10
) => {
  return {
    page,
    limit,
    offset: (page - 1) * limit,
  };
};

// Cache utilities
export const createCacheKey = (
  endpoint: string,
  params?: Record<string, unknown>
): string => {
  if (!params) return endpoint;

  const sortedParams = Object.keys(params)
    .sort()
    .reduce((result, key) => {
      result[key] = params[key];
      return result;
    }, {} as Record<string, unknown>);

  return `${endpoint}?${JSON.stringify(sortedParams)}`;
};

// Retry utilities
export const createRetryConfig = (
  maxRetries: number = 3,
  delay: number = 1000
) => {
  return {
    maxRetries,
    delay,
    shouldRetry: (error: FetchBaseQueryError, retryCount: number) => {
      if (retryCount >= maxRetries) return false;

      // Retry on network errors and 5xx server errors
      if (error.status === "FETCH_ERROR" || error.status === "TIMEOUT_ERROR") {
        return true;
      }

      if (typeof error.status === "number" && error.status >= 500) {
        return true;
      }

      return false;
    },
  };
};

// Loading state utilities
export const createLoadingState = () => ({
  isLoading: false,
  isFetching: false,
  isError: false,
  error: null as unknown,
});

// Success/Error toast utilities
export const showSuccessToast = (message: string) => {
  // You can integrate with your preferred toast library here
};

export const showErrorToast = (message: string) => {
  // You can integrate with your preferred toast library here
  console.error("Error:", message);
};

// Form validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (
  password: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters long");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (!/\d/.test(password)) {
    errors.push("Password must contain at least one number");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
