// Authentication Types
export interface User {
  id: number;
  username: string;
  email: string;
  accountType:
    | "student"
    | "university_rep"
    | "admin"
    | "moderator"
    | "super_admin";
  status: "active" | "inactive" | "suspended" | "banned" | "deleted";
  isVerified: boolean;
  phone?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;

  // Profile fields
  firstName?: string;
  lastName?: string;
  displayName?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
  bio?: string;
  dateOfBirth?: string;
  gender?: string;
  city?: string;
  address?: string;
  universityName?: string;
  major?: string;
  graduationYear?: number;
  studentId?: string;
  isStudentVerified?: boolean;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatarUrl?: string;
  bio?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  location?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

// AuthResponse có thể có hoặc không có token (tùy theo endpoint)
export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  tokenType?: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
  user?: User & { profile?: UserProfile };
  session?: {
    sessionId: string;
    deviceId?: string;
    ipAddress?: string;
  };
  message?: string; // Cho register thành công
}

export interface LoginRequest {
  identifier: string; // email or username
  password: string;
  deviceId?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
  accountType?:
    | "student"
    | "university_rep"
    | "admin"
    | "moderator"
    | "super_admin";
  deviceId?: string;
}

export interface RefreshTokenRequest {
  refreshToken: string;
  deviceId?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
  email?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  university?: string;
  major?: string;
  graduationYear?: number;
  location?: string;
  website?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
  };
}

// Email verification types
export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email?: string; // Optional, can be inferred from current user
}
