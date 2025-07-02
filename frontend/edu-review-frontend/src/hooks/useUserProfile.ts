import { useState } from "react";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  phone?: string;
  status: "active" | "inactive";
  createdAt: string;
}

const MOCK_PROFILE: UserProfile = {
  id: "u123",
  name: "Nguyễn Văn A",
  email: "nguyenvana@email.com",
  avatarUrl: "https://i.pravatar.cc/150?img=3",
  phone: "0123456789",
  status: "active",
  createdAt: "2023-01-01T12:00:00Z",
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
