// Pagination types matching backend PaginationDto
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// API response wrapper
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// API error response
export interface ApiErrorResponse {
  success: false;
  message: string;
  error: string;
  errors?: Record<string, string[]>;
  statusCode: number;
  timestamp: string;
  path: string;
}

// Generic list response
export interface ListResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter options
export interface BaseFilter {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Date range filter
export interface DateRangeFilter {
  dateFrom?: string;
  dateTo?: string;
}

// Status filter
export interface StatusFilter {
  status?: string;
  isActive?: boolean;
}

// Search filter
export interface SearchFilter {
  search?: string;
  searchFields?: string[];
}

// Sort options
export interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

// File upload types
export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  uploadedAt: Date;
}

export interface FileUploadRequest {
  file: File;
  folder?: string;
  allowedTypes?: string[];
  maxSize?: number;
}

// Notification types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: Date;
  expiresAt?: Date;
}

// Activity log types
export interface ActivityLog {
  id: string;
  userId: number;
  username: string;
  action: string;
  resource: string;
  resourceId?: number;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// Audit trail types
export interface AuditTrail {
  id: string;
  userId: number;
  username: string;
  action: string;
  resource: string;
  resourceId?: number;
  oldValues?: any;
  newValues?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// Export/Import types
export interface ExportOptions {
  format: 'csv' | 'excel' | 'json' | 'pdf';
  includeHeaders?: boolean;
  dateFormat?: string;
  timezone?: string;
}

export interface ImportResult {
  success: boolean;
  totalRows: number;
  importedRows: number;
  failedRows: number;
  errors?: Array<{
    row: number;
    field: string;
    message: string;
  }>;
}

// System configuration types
export interface SystemConfig {
  key: string;
  value: any;
  description?: string;
  isPublic: boolean;
  updatedAt: Date;
}

// Feature flag types
export interface FeatureFlag {
  key: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  isPublic: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Maintenance mode types
export interface MaintenanceMode {
  isEnabled: boolean;
  message?: string;
  allowedIPs?: string[];
  allowedUsers?: number[];
  startTime?: Date;
  endTime?: Date;
  reason?: string;
}

// Health check types
export interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime: number;
  lastChecked: Date;
  details?: any;
}

// Performance metrics
export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: Date;
  tags?: Record<string, string>;
}

// Cache types
export interface CacheInfo {
  key: string;
  ttl: number;
  size: number;
  lastAccessed: Date;
  accessCount: number;
}

// Queue types
export interface QueueJob {
  id: string;
  name: string;
  data: any;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  attempts: number;
  maxAttempts: number;
}
