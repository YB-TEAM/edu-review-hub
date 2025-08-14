// Export all types from their respective modules

// Auth and user types
export * from './auth';
export * from './user';

// Content types
export * from './blog';
export * from './university';
export * from './tag';

// Dashboard and system types
export * from './dashboard';
export * from './system';

// Common and utility types
export * from './common';
export * from './upload';

// Re-export commonly used types for convenience
export type {
  UserRole,
  UserStatus,
  User,
  ExtendedUser,
  UserProfile,
  AuthResponse,
  LoginRequest,
  RefreshTokenRequest,
  Blog,
  BlogStatus,
  BlogCategory,
  University,
  Tag,
  Overview,
  DashboardOverviewResponse,
  SystemHealthSummary,
  PaginationMeta,
  ApiResponse,
  UploadResponse,
} from './auth';
