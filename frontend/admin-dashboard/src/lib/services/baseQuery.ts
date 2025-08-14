import { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { toast } from 'sonner';

// Get API base URL from environment
const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: try to get from window.__NEXT_DATA__ or fallback
    return (window as any).__NEXT_DATA__?.props?.env?.NEXT_PUBLIC_API_URL || 
           process.env.NEXT_PUBLIC_API_URL || 
           'http://localhost:3001';
  }
  // Server-side: use process.env
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
};

// Get API timeout from environment
const getApiTimeout = (): number => {
  const timeout = process.env.NEXT_PUBLIC_API_TIMEOUT || '10000';
  return parseInt(timeout, 10);
};

// Custom base query with authentication and error handling
export const baseQuery: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  const baseUrl = getApiBaseUrl();
  const timeout = getApiTimeout();
  
  console.log('API Base URL:', baseUrl); // Debug log
  
  // Prepare the request
  let url: string;
  let body: any;
  let method: string = 'GET';
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
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
  const token = localStorage.getItem('accessToken');
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  // Create fetch options
  const fetchOptions: RequestInit = {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  };

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

    // Handle specific error cases
    if (response.status === 401) {
      // Unauthorized - clear tokens but don't redirect automatically
      // Let the component handle the redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      
      // Only show toast if this is not a login request
      if (!url.includes('/auth/login')) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
    } else if (response.status === 403) {
      toast.error('Bạn không có quyền thực hiện hành động này');
    } else if (response.status === 404) {
      toast.error('Không tìm thấy tài nguyên yêu cầu');
    } else if (response.status === 422) {
      toast.error('Dữ liệu không hợp lệ');
    } else if (response.status === 429) {
      toast.error('Quá nhiều yêu cầu. Vui lòng thử lại sau.');
    } else if (response.status >= 500) {
      toast.error('Lỗi máy chủ. Vui lòng thử lại sau.');
    } else {
      toast.error(errorData.message || 'Đã xảy ra lỗi');
    }

    return { error };

  } catch (error: any) {
    // Handle network errors
    if (error.name === 'AbortError') {
      toast.error('Yêu cầu quá thời gian chờ. Vui lòng thử lại.');
      return {
        error: {
          status: 'TIMEOUT' as any,
          error: 'Request timeout',
          data: { message: 'Request timeout' },
        } as FetchBaseQueryError,
      };
    }

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      toast.error('Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
      return {
        error: {
          status: 'FETCH_ERROR' as any,
          error: 'Network error',
          data: { message: 'Network error' },
        } as FetchBaseQueryError,
      };
    }

    toast.error('Đã xảy ra lỗi không xác định');
    return {
      error: {
        status: 'UNKNOWN_ERROR' as any,
        error: 'Unknown error',
        data: { message: error.message || 'Unknown error' },
      } as FetchBaseQueryError,
    };
  }
};

// Export environment helpers
export const apiConfig = {
  getBaseUrl: getApiBaseUrl,
  getTimeout: getApiTimeout,
};
