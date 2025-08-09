import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/lib/store";
import { useGetCurrentUserQuery } from "@/lib/services";

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

export function useUserProfile() {
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );

  // Fetch current user data if authenticated
  const {
    data: currentUser,
    isLoading,
    error,
  } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Update profile when user data changes
  useEffect(() => {
    if (currentUser) {
      // Convert user data to profile format
      setProfile({
        id: currentUser.id.toString(),
        userId: currentUser.id.toString(),
        displayName: currentUser.username, // Fallback to username
        avatarUrl: null,
        coverImageUrl: null,
        bio: null,
        dateOfBirth: null,
        gender: null,
        country: null,
        city: null,
        address: null,
        phone: null,
        universityName: null,
        major: null,
        graduationYear: null,
        studentId: null,
        isStudentVerified: false,
        status: currentUser.status as "active" | "inactive",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        firstName: null,
        lastName: null,
        timezone: "UTC",
        language: "vi",
        privacySettings: null,
        notificationSettings: null,
      });
    } else if (!isAuthenticated) {
      setProfile(null);
    }
  }, [currentUser, isAuthenticated]);

  // Hàm cập nhật profile (mock)
  const updateProfile = async (data: Partial<UserProfile>) => {
    setLoading(true);
    setProfileError(null);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setProfile((prev) => (prev ? { ...prev, ...data } : prev));
    } catch {
      setProfileError("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Hàm vô hiệu hóa tài khoản (mock)
  const deactivateAccount = async () => {
    setLoading(true);
    setProfileError(null);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setProfile((prev) => (prev ? { ...prev, status: "inactive" } : prev));
    } catch {
      setProfileError("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Hàm xóa tài khoản (mock)
  const deleteAccount = async () => {
    setLoading(true);
    setProfileError(null);
    try {
      await new Promise((r) => setTimeout(r, 1000));
      setProfile(null);
    } catch {
      setProfileError("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading: loading || isLoading,
    error: profileError || (error as string),
    updateProfile,
    deactivateAccount,
    deleteAccount,
  };
}
