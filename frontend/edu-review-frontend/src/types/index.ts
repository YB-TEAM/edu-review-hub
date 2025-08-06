// Export all types from a single entry point
export * from "./auth";
export * from "./institution";
export * from "./blog";
export * from "./common";

// Re-export commonly used types for convenience
export type {
  User,
  UserProfile,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
} from "./auth";

export type {
  Institution,
  InstitutionDetail,
  CreateInstitutionRequest,
  UpdateInstitutionRequest,
  InstitutionFilters,
} from "./institution";

export type {
  Blog,
  CreateBlogRequest,
  UpdateBlogRequest,
  BlogFilters,
  Tag,
  BlogCategory,
  BlogStatus,
} from "./blog";

export type {
  PaginatedResponse,
  ApiResponse,
  ErrorResponse,
  ValidationErrorResponse,
  SearchFilters,
  DateRange,
  NumberRange,
} from "./common";
