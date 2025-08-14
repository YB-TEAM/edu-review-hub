// User roles and status from backend
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  USER = 'user',
  STUDENT = 'student',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
  PENDING = 'pending',
}

// Login request matching backend LoginDto
export interface LoginRequest {
  identifier: string; // email or username
  password: string;
  deviceId?: string;
  rememberMe?: boolean;
}

// Refresh token request matching backend RefreshTokenDto
export interface RefreshTokenRequest {
  refreshToken: string;
  deviceId?: string;
}

// Auth response matching backend AuthResponseDto
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: {
    id: number;
    username: string;
    email: string;
    accountType: UserRole;
    status: UserStatus;
    isVerified: boolean;
  };
}

// User profile interface
export interface User {
  id: number;
  username: string;
  email: string;
  accountType: UserRole;
  status: UserStatus;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// Extended user profile with additional details
export interface ExtendedUser extends User {
  profile?: UserProfile;
  permissions?: string[];
  lastLoginAt?: string;
  loginCount?: number;
}

// User profile matching backend ProfileResponseDto
export interface UserProfile {
  id: number;
  userId: number;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  country?: string;
  city?: string;
  address?: string;
  timezone?: string;
  language?: string;
  universityName?: string;
  major?: string;
  graduationYear?: number;
  studentId?: string;
  isStudentVerified?: boolean;
  privacySettings?: any;
  notificationSettings?: any;
  createdAt: string;
  updatedAt: string;
}

// Authentication state
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

// Login form data
export interface LoginFormData {
  identifier: string;
  password: string;
  rememberMe: boolean;
}

// Change password request
export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Forgot password request
export interface ForgotPasswordRequest {
  email: string;
}

// Reset password request
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
  confirmPassword: string;
}

// Email verification request
export interface EmailVerificationRequest {
  token: string;
}

// Resend verification request
export interface ResendVerificationRequest {
  email: string;
}
