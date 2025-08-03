// Common Types
export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ErrorResponse {
  statusCode: number;
  message: string;
  error: string;
  timestamp: string;
  path: string;
  details?: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

export interface ValidationErrorResponse extends ErrorResponse {
  details: Array<{
    field: string;
    message: string;
    value?: any;
  }>;
}

// File Upload Types
export interface FileUploadResponse {
  url: string;
  publicId: string;
  filename: string;
  size: number;
  format: string;
  width?: number;
  height?: number;
}

export interface ImageUploadResponse extends FileUploadResponse {
  urls: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
}

// Search and Filter Types
export interface SearchFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface DateRange {
  startDate?: string;
  endDate?: string;
}

export interface NumberRange {
  min?: number;
  max?: number;
}

// Status Types
export interface Status {
  id: number;
  name: string;
  color: string;
  description?: string;
}

// Notification Types
export interface Notification {
  id: number;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationRequest {
  title: string;
  message: string;
  type?: "info" | "success" | "warning" | "error";
  userId?: number;
}

// Activity Types
export interface Activity {
  id: number;
  type: string;
  description: string;
  metadata?: Record<string, any>;
  userId: number;
  userName: string;
  userAvatar?: string;
  createdAt: string;
}

// Settings Types
export interface UserSettings {
  id: number;
  userId: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  newsletter: boolean;
  privacyLevel: "public" | "private" | "friends";
  language: string;
  timezone: string;
  theme: "light" | "dark" | "auto";
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsRequest {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  newsletter?: boolean;
  privacyLevel?: "public" | "private" | "friends";
  language?: string;
  timezone?: string;
  theme?: "light" | "dark" | "auto";
}
