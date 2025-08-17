import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';

export interface UserProfile {
  id: number;
  displayName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  studentId?: string;
  major?: string;
  university?: string;
  graduationYear?: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female' | 'other';
  bio?: string;
  address?: string;
  city?: string;
  country?: string;
  studentId?: string;
  major?: string;
  university?: string;
  graduationYear?: number;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface UserSettings {
  id: number;
  userId: number;
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  privacyLevel: 'public' | 'friends' | 'private';
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSettingsRequest {
  emailNotifications?: boolean;
  pushNotifications?: boolean;
  marketingEmails?: boolean;
  privacyLevel?: 'public' | 'friends' | 'private';
}

// User Profile API service using RTK Query
export const userProfileApi = createApi({
  reducerPath: 'userProfileApi',
  baseQuery,
  tagTypes: ['UserProfile', 'UserSettings'],
  endpoints: (builder) => ({
    // Get user profile - GET /profile/me
    getProfile: builder.query<UserProfile, void>({
      query: () => '/api/v1/profile/me',
      providesTags: ['UserProfile'],
    }),

    // Update user profile - PATCH /profile/me
    updateProfile: builder.mutation<UserProfile, UpdateProfileRequest>({
      query: (profileData) => ({
        url: '/api/v1/profile/me',
        method: 'PATCH',
        body: profileData,
      }),
      invalidatesTags: ['UserProfile'],
    }),

    // Upload avatar - POST /profile/me/avatar
    uploadAvatar: builder.mutation<{ avatarUrl: string }, FormData>({
      query: (formData) => ({
        url: '/api/v1/profile/me/avatar',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['UserProfile'],
    }),

    // Change password (using auth endpoint)
    changePassword: builder.mutation<{ message: string }, ChangePasswordRequest>({
      query: (passwordData) => ({
        url: '/api/v1/auth/change-password',
        method: 'POST',
        body: passwordData,
      }),
    }),

    // Get user settings (if available)
    getSettings: builder.query<UserSettings, void>({
      query: () => '/api/v1/profile/me/settings',
      providesTags: ['UserSettings'],
    }),

    // Update user settings (if available)
    updateSettings: builder.mutation<UserSettings, UpdateSettingsRequest>({
      query: (settingsData) => ({
        url: '/api/v1/profile/me/settings',
        method: 'PATCH',
        body: settingsData,
      }),
      invalidatesTags: ['UserSettings'],
    }),

    // Delete account - POST /account/delete
    deleteAccount: builder.mutation<{ message: string }, { password: string }>({
      query: (data) => ({
        url: '/api/v1/account/delete',
        method: 'POST',
        body: data,
      }),
    }),

    // Deactivate account - POST /account/deactivate
    deactivateAccount: builder.mutation<{ message: string }, { reason: string }>({
      query: (data) => ({
        url: '/api/v1/account/deactivate',
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

// Export hooks
export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useChangePasswordMutation,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useDeleteAccountMutation,
  useDeactivateAccountMutation,
} = userProfileApi;
