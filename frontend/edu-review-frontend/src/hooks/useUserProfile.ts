import { useState } from "react";

export interface UserProfile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  coverImageUrl?: string | null;
  bio?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  country?: string | null;
  city?: string | null;
  address?: string | null;
  phone?: string | null;
  universityName?: string | null;
  major?: string | null;
  graduationYear?: string | number | null;
  studentId?: string | null;
  isStudentVerified?: boolean;
  status: "active" | "inactive";
  createdAt: string;
  updatedAt?: string;
  firstName?: string | null;
  lastName?: string | null;
  timezone?: string | null;
  language?: string | null;
  privacySettings?: any;
  notificationSettings?: any;
}

const MOCK_PROFILE: UserProfile = {
  id: "u123",
  userId: "u123",
  displayName: "Nguyễn Văn A",
  avatarUrl: "https://i.pravatar.cc/150?img=3",
  coverImageUrl: null,
  bio: "Sinh viên năm 3 ngành CNTT.",
  dateOfBirth: "2002-05-10",
  gender: "Nam",
  country: "Việt Nam",
  city: "Hà Nội",
  address: "123 Đường ABC",
  phone: "0123456789",
  universityName: "Đại học Quốc gia Hà Nội",
  major: "Công nghệ thông tin",
  graduationYear: "2025",
  studentId: "SV123456",
  isStudentVerified: true,
  status: "active",
  createdAt: "2023-01-01T12:00:00Z",
  updatedAt: "2023-01-01T12:00:00Z",
  firstName: "Nguyễn",
  lastName: "A",
  timezone: "Asia/Ho_Chi_Minh",
  language: "vi",
  privacySettings: { showEmail: false },
  notificationSettings: { email: true },
};

export function useUserProfile() {
  // Sau này thay bằng fetch API
  const [profile, setProfile] = useState<UserProfile | null>(MOCK_PROFILE);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Hàm cập nhật profile (mock)
  const updateProfile = async (data: Partial<UserProfile>) => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setProfile((prev) => (prev ? { ...prev, ...data } : prev));
    } catch {
      setError("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Hàm vô hiệu hóa tài khoản (mock)
  const deactivateAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setProfile((prev) => (prev ? { ...prev, status: "inactive" } : prev));
    } catch {
      setError("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa tài khoản (mock)
  const deleteAccount = async () => {
    setLoading(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setProfile(null);
    } catch {
      setError("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    deactivateAccount,
    deleteAccount,
  };
}
