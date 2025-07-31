import { api } from "../api";

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

export const profileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query<UserProfile, void>({
      query: () => "/profile/me",
      providesTags: ["Profile"],
      keepUnusedDataFor: 300,
    }),
    updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (profileData) => ({
        url: "/profile/me",
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["Profile"],
    }),
    uploadAvatar: builder.mutation<{ avatarUrl: string }, FormData>({
      query: (formData) => ({
        url: "/profile/me/avatar",
        method: "POST",
        body: formData,
        prepareHeaders: (headers: Headers) => {
          const token = localStorage.getItem("token");
          if (token) {
            headers.set("authorization", `Bearer ${token}`);
          }
          return headers;
        },
      }),
      invalidatesTags: ["Profile"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
} = profileApi;
