import { UserRole, UserStatus } from './auth';

// User list item for admin dashboard
export interface UserListItem {
  id: number;
  username: string;
  email: string;
  accountType: UserRole;
  status: UserStatus;
  isVerified: boolean;
  lastLoginAt?: string;
  loginCount?: number;
  createdAt: string;
  updatedAt: string;
}

// Extended user for detailed view
export interface ExtendedUser {
  id: number;
  username: string;
  email: string;
  accountType: UserRole;
  status: UserStatus;
  isVerified: boolean;
  profile?: UserProfile;
  permissions?: string[];
  lastLoginAt?: string;
  loginCount?: number;
  createdAt: string;
  updatedAt: string;
}

// User profile (re-export from auth types)
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

// User creation request for admin
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  accountType: UserRole;
  firstName?: string;
  lastName?: string;
  displayName?: string;
}

// User update request for admin
export interface UpdateUserRequest {
  username?: string;
  email?: string;
  accountType?: UserRole;
  status?: UserStatus;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  bio?: string;
  avatarUrl?: string;
  coverImageUrl?: string;
}

// Admin update user request (matching backend AdminUpdateUserDto)
export interface AdminUpdateUserRequest {
  username?: string;
  email?: string;
  accountType?: UserRole;
  status?: UserStatus;
  profile?: {
    firstName?: string;
    lastName?: string;
    displayName?: string;
    bio?: string;
    avatarUrl?: string;
    coverImageUrl?: string;
    country?: string;
    city?: string;
    universityName?: string;
    major?: string;
    graduationYear?: number;
    studentId?: string;
    isStudentVerified?: boolean;
  };
}

// User list response
export interface UserListResponse {
  users: UserListItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// User filter options
export interface UserFilter {
  search?: string;
  accountType?: UserRole;
  status?: UserStatus;
  isVerified?: boolean;
  dateFrom?: string;
  dateTo?: string;
}

// User query parameters
export interface UserQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: UserFilter;
}

// User statistics
export interface UserStats {
  total: number;
  byRole: Record<UserRole, number>;
  byStatus: Record<UserStatus, number>;
  verified: number;
  unverified: number;
  activeToday: number;
  activeThisWeek: number;
  activeThisMonth: number;
}

// User analytics
export interface UserAnalytics {
  totalUsers: number;
  newUsersThisMonth: number;
  activeUsersThisMonth: number;
  roleDistribution: Record<UserRole, number>;
  statusDistribution: Record<UserStatus, number>;
  registrationTrend: Array<{
    date: string;
    newUsers: number;
    totalUsers: number;
  }>;
  loginTrend: Array<{
    date: string;
    activeUsers: number;
    totalLogins: number;
  }>;
  topUsers: Array<{
    id: number;
    username: string;
    accountType: UserRole;
    loginCount: number;
    lastLoginAt: string;
  }>;
}

// User activity log
export interface UserActivity {
  id: number;
  userId: number;
  username: string;
  action: string;
  details?: any;
  ipAddress?: string;
  userAgent?: string;
  timestamp: Date;
}

// User permissions
export interface UserPermission {
  id: number;
  name: string;
  description?: string;
  resource: string;
  action: string;
  isActive: boolean;
}

// User role permissions
export interface RolePermissions {
  role: UserRole;
  permissions: UserPermission[];
}

// Bulk user operations
export interface BulkUserOperation {
  userIds: number[];
  operation: 'activate' | 'deactivate' | 'suspend' | 'ban' | 'delete';
  reason?: string;
}

// User import/export
export interface UserImportData {
  username: string;
  email: string;
  accountType: UserRole;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  password?: string;
}

export interface UserExportOptions {
  format: 'csv' | 'excel' | 'json';
  includeProfile?: boolean;
  includeActivity?: boolean;
  dateRange?: {
    from: string;
    to: string;
  };
}
