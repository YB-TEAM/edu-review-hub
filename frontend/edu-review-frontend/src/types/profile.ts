export interface UserProfile {
  id: number;
  userId: string;
  firstName: string;
  lastName: string;
  displayName: string;
  avatarUrl: string | null;
  coverImageUrl: string | null;
  bio: string | null;
  dateOfBirth: string | null;
  gender: string | null;
  country: string | null;
  city: string | null;
  address: string | null;
  timezone: string;
  language: string;
  universityName: string | null;
  major: string | null;
  graduationYear: number | null;
  studentId: string | null;
  isStudentVerified: boolean;
  privacySettings: any | null;
  notificationSettings: any | null;
  createdAt: string;
  updatedAt: string;
  accountType: "student" | "university_rep" | "admin" | "moderator" | "super_admin";
}

export interface UpdateProfileRequest {
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
}

export interface UploadAvatarResponse {
  avatarUrl: string;
}
