// Auth types
export type {
  User,
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from "./auth";

// Profile types
export type {
  UserProfile,
  UpdateProfileRequest as ProfileUpdateRequest,
  UploadAvatarResponse,
} from "./profile";

// Course types
export type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseFilters,
  CourseListResponse,
  InstitutionCoursesResponse,
} from "./course";

// Review types
export type {
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewFilters,
  ReviewListResponse,
  UserReviewsResponse,
} from "./review";

// Blog types
export type {
  Blog,
  CreateBlogRequest,
  UpdateBlogRequest,
  BlogFilters,
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  BlogLike,
  BlogComment,
  BlogListResponse,
} from "./blog";

// Institution types
export type {
  Institution,
  InstitutionDetail,
  CreateInstitutionRequest,
  UpdateInstitutionRequest,
  InstitutionFilters,
  InstitutionListResponse,
  InstitutionStats,
} from "./institution";

// Common types
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

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
}
