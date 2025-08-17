import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { toast } from 'sonner';

// Get API base URL from environment
const getApiBaseUrl = (): string => {
  // Priority: .env.local > .env > default
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (envUrl) {
    return envUrl;
  }
  
  // Fallback URLs based on environment
  if (process.env.NODE_ENV === 'production') {
    return 'https://edu-review-hub.onrender.com';
  }
  
  return 'http://localhost:3001';
};

// Get API timeout from environment
const getApiTimeout = (): number => {
  const timeout = process.env.NEXT_PUBLIC_API_TIMEOUT || '15000';
  return parseInt(timeout, 10);
};

// Error message mapping
const getErrorMessage = (status: number, errorData: any): string => {
  switch (status) {
    case 400:
      return errorData.message || 'Yêu cầu không hợp lệ';
    case 401:
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    case 403:
      return 'Bạn không có quyền thực hiện hành động này';
    case 404:
      return 'Không tìm thấy tài nguyên yêu cầu';
    case 409:
      return 'Dữ liệu đã tồn tại';
    case 422:
      return errorData.message || 'Dữ liệu không hợp lệ';
    case 429:
      return 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
    case 500:
      return 'Lỗi máy chủ nội bộ';
    case 502:
      return 'Máy chủ không phản hồi';
    case 503:
      return 'Máy chủ đang bảo trì';
    case 504:
      return 'Máy chủ phản hồi quá thời gian';
    default:
      return errorData.message || 'Đã xảy ra lỗi không xác định';
  }
};

// Custom base query with authentication and error handling
export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseUrl = getApiBaseUrl();
  const timeout = getApiTimeout();
  
  // Debug log in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🌐 API Request:', {
      baseUrl,
      timeout,
      args: typeof args === 'string' ? args : args.url,
      method: typeof args === 'string' ? 'GET' : args.method || 'GET'
    });
  }
  
  // Prepare the request
  let url: string;
  let body: any;
  let method: string = 'GET';
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  if (typeof args === 'string') {
    url = `${baseUrl}${args}`;
  } else {
    url = `${baseUrl}${args.url}`;
    method = args.method || 'GET';
    
    if (args.body) {
      body = args.body;
    }
    
    if (args.headers) {
      // Convert Headers object to plain object if needed
      const headerObj: Record<string, string> = {};
      if (typeof args.headers === 'object' && args.headers !== null) {
        Object.entries(args.headers).forEach(([key, value]) => {
          if (typeof value === 'string') {
            headerObj[key] = value;
          }
        });
      }
      headers = { ...headers, ...headerObj };
    }
  }

  // Add authentication token if available
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('accessToken');
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Create fetch options
  const fetchOptions: RequestInit = {
    method,
    headers,
    body: undefined, // Initialize as undefined
  };

  // Handle body based on type
  if (body) {
    if (body instanceof FormData) {
      // For FormData, don't set Content-Type header and don't stringify
      fetchOptions.body = body;
      // Remove Content-Type header for FormData to let browser set it with boundary
      delete headers['Content-Type'];
    } else {
      // For regular objects, stringify and set JSON Content-Type
      fetchOptions.body = JSON.stringify(body);
    }
  }

  try {
    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    // Handle different response statuses
    if (response.ok) {
      const data = await response.json().catch(() => null);
      
      // Debug log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('✅ API Response:', { url, status: response.status, data });
      }
      
      return { data };
    }

    // Handle error responses
    let errorData: any;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: 'Unknown error occurred' };
    }

    const error: FetchBaseQueryError = {
      status: response.status,
      data: errorData,
      error: response.statusText,
    };

    // Get user-friendly error message
    const errorMessage = getErrorMessage(response.status, errorData);

    // Handle specific error cases
    if (response.status === 401) {
      // Unauthorized - clear tokens
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
      }
      
      // Only show toast if this is not a login request
      if (!url.includes('/auth/login')) {
        toast.error(errorMessage);
      }
    } else if (response.status === 403) {
      toast.error(errorMessage);
    } else if (response.status === 404) {
      toast.error(errorMessage);
    } else if (response.status === 422) {
      // Validation errors - show specific field errors if available
      if (errorData.errors && Array.isArray(errorData.errors)) {
        errorData.errors.forEach((err: any) => {
          toast.error(`${err.field}: ${err.message}`);
        });
      } else {
        toast.error(errorMessage);
      }
    } else if (response.status === 429) {
      toast.error(errorMessage);
    } else if (response.status >= 500) {
      toast.error(errorMessage);
    } else {
      toast.error(errorMessage);
    }

    // Debug log in development
    if (process.env.NODE_ENV === 'development') {
      console.error('❌ API Error:', { url, status: response.status, error: errorData });
    }

    return { error };

  } catch (error: any) {
    // Handle network errors
    if (error.name === 'AbortError') {
      const errorMessage = 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.';
      toast.error(errorMessage);
      
      if (process.env.NODE_ENV === 'development') {
        console.error('⏰ API Timeout:', { url, timeout });
      }
      
      return {
        error: {
          status: 'TIMEOUT' as any,
          error: 'Request timeout',
          data: { message: errorMessage },
        } as FetchBaseQueryError,
      };
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      const errorMessage = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
      toast.error(errorMessage);
      
      if (process.env.NODE_ENV === 'development') {
        console.error('🌐 Network Error:', { url, error: error.message });
      }
      
      return {
        error: {
          status: 'FETCH_ERROR' as any,
          error: 'Network error',
          data: { message: errorMessage },
        } as FetchBaseQueryError,
      };
    }

    const errorMessage = 'Đã xảy ra lỗi không xác định';
    toast.error(errorMessage);
    
    if (process.env.NODE_ENV === 'development') {
      console.error('❓ Unknown Error:', { url, error: error.message });
    }
    
    return {
      error: {
        status: 'UNKNOWN_ERROR' as any,
        error: 'Unknown error',
        data: { message: errorMessage },
      } as FetchBaseQueryError,
    };
  }
};

// Export environment helpers
export const apiConfig = {
  getBaseUrl: getApiBaseUrl,
  getTimeout: getApiTimeout,
  isDevelopment: process.env.NODE_ENV === 'development',
};

// Export error handling utilities
export const errorHandler = {
  getErrorMessage,
  isNetworkError: (error: any) => error?.status === 'FETCH_ERROR',
  isTimeoutError: (error: any) => error?.status === 'TIMEOUT',
  isAuthError: (error: any) => error?.status === 401,
  isForbiddenError: (error: any) => error?.status === 403,
  isValidationError: (error: any) => error?.status === 422,
  isServerError: (error: any) => error?.status >= 500,
};
