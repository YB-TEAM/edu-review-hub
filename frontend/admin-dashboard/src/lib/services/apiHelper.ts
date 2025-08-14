import { toast } from 'sonner';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export class ApiHelper {
  // Get environment variables with fallbacks
  private static getEnvVar(key: string, fallback: string): string {
    if (typeof window !== 'undefined') {
      return (window as any).__NEXT_DATA__?.props?.env?.[key] || fallback;
    }
    return process.env[key] || fallback;
  }

  // Get API base URL
  static getApiBaseUrl(): string {
    return this.getEnvVar('NEXT_PUBLIC_API_URL', 'http://localhost:3001');
  }

  // Get API timeout
  static getApiTimeout(): number {
    return parseInt(this.getEnvVar('NEXT_PUBLIC_API_TIMEOUT', '10000'));
  }

  static async handleRequest<T>(
    requestFn: () => Promise<T>,
    options?: {
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
      showLoading?: boolean;
      showSuccess?: boolean;
      showError?: boolean;
    }
  ): Promise<ApiResponse<T>> {
    const {
      loadingMessage = 'Đang xử lý...',
      successMessage = 'Thao tác thành công!',
      errorMessage = 'Đã xảy ra lỗi',
      showLoading = true,
      showSuccess = true,
      showError = true,
    } = options || {};

    let loadingToast: string | number | undefined;

    try {
      if (showLoading) {
        loadingToast = toast.loading(loadingMessage);
      }

      const result = await requestFn();

      if (showLoading && loadingToast) {
        toast.dismiss(loadingToast);
      }

      if (showSuccess) {
        toast.success(successMessage);
      }

      return {
        success: true,
        data: result,
        message: successMessage,
      };
    } catch (error: any) {
      if (showLoading && loadingToast) {
        toast.dismiss(loadingToast);
      }

      const errorMsg = errorMessage || error?.message || 'Đã xảy ra lỗi không xác định';

      if (showError) {
        toast.error(errorMsg);
      }

      return {
        success: false,
        error: errorMsg,
        message: errorMsg,
      };
    }
  }

  // Helper function to handle RTK Query mutations with toast
  static handleMutation<T>(
    mutationFn: () => Promise<T>,
    options?: {
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
      showLoading?: boolean;
      showSuccess?: boolean;
      showError?: boolean;
    }
  ) {
    return this.handleRequest(mutationFn, options);
  }

  // Helper function to handle RTK Query queries with toast
  static handleQuery<T>(
    queryFn: () => Promise<T>,
    options?: {
      loadingMessage?: string;
      successMessage?: string;
      errorMessage?: string;
      showLoading?: boolean;
      showSuccess?: boolean;
      showError?: boolean;
    }
  ) {
    return this.handleRequest(queryFn, options);
  }

  // Toast utility functions
  static showSuccess(message: string) {
    toast.success(message);
  }

  static showError(message: string) {
    toast.error(message);
  }

  static showWarning(message: string) {
    toast.warning(message);
  }

  static showInfo(message: string) {
    toast.info(message);
  }

  static showLoading(message: string) {
    return toast.loading(message);
  }

  static dismiss(toastId?: string | number) {
    toast.dismiss(toastId);
  }

  // Handle common API error patterns for RTK Query
  static handleApiError(error: any, defaultMessage = 'Đã xảy ra lỗi') {
    let message = defaultMessage;

    // Handle RTK Query error structure
    if (error?.data?.message) {
      message = error.data.message;
    } else if (error?.message) {
      message = error.message;
    } else if (error?.error) {
      message = error.error;
    } else if (error?.status === 'FETCH_ERROR') {
      message = 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
    } else if (error?.status === 'PARSING_ERROR') {
      message = 'Lỗi xử lý dữ liệu từ máy chủ.';
    } else if (error?.status === 'TIMEOUT_ERROR') {
      message = 'Yêu cầu quá thời gian chờ. Vui lòng thử lại.';
    }

    // Handle specific error status codes
    if (error?.status === 401 || error?.originalStatus === 401) {
      message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      // Redirect to login page
      if (typeof window !== 'undefined') {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/';
      }
    } else if (error?.status === 403 || error?.originalStatus === 403) {
      message = 'Bạn không có quyền thực hiện hành động này';
    } else if (error?.status === 404 || error?.originalStatus === 404) {
      message = 'Không tìm thấy tài nguyên yêu cầu';
    } else if (error?.status === 422 || error?.originalStatus === 422) {
      message = 'Dữ liệu không hợp lệ';
    } else if (error?.status === 429 || error?.originalStatus === 429) {
      message = 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
    } else if (error?.status === 500 || error?.originalStatus === 500) {
      message = 'Lỗi máy chủ. Vui lòng thử lại sau.';
    }

    toast.error(message);
    return message;
  }

  // Handle success messages for common operations
  static handleSuccess(operation: string, resource?: string) {
    const message = resource 
      ? `${operation} ${resource} thành công!`
      : `${operation} thành công!`;
    
    toast.success(message);
    return message;
  }

  // Handle RTK Query mutation results
  static handleMutationResult(
    result: any,
    operation: string,
    resource?: string,
    showSuccess = true
  ) {
    if (result?.data) {
      if (showSuccess) {
        this.handleSuccess(operation, resource);
      }
      return { success: true, data: result.data };
    } else if (result?.error) {
      this.handleApiError(result.error);
      return { success: false, error: result.error };
    }
    return { success: false, error: 'Không xác định kết quả' };
  }

  // Handle RTK Query query results
  static handleQueryResult(
    result: any,
    showError = true
  ) {
    if (result?.data) {
      return { success: true, data: result.data };
    } else if (result?.error && showError) {
      this.handleApiError(result.error);
      return { success: false, error: result.error };
    }
    return { success: false, error: 'Không xác định kết quả' };
  }
}
