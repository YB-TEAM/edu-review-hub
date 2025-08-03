import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  User,
  UserProfile,
  UpdateProfileRequest,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
} from "@/types";
import { baseQueryWithErrorHandling } from "../api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Auth", "User", "Profile"],
  endpoints: (builder) => ({
    // Authentication
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["Auth"],
    }),

    refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
      query: (refreshData) => ({
        url: "/auth/refresh",
        method: "POST",
        body: refreshData,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth", "User", "Profile"],
    }),

    // Password Management
    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (data) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation<void, ResetPasswordRequest>({
      query: (data) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    changePassword: builder.mutation<void, ChangePasswordRequest>({
      query: (data) => ({
        url: "/auth/change-password",
        method: "POST",
        body: data,
      }),
    }),

    // User Profile
    getCurrentUser: builder.query<User, void>({
      query: () => "/profile/me",
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<User, UpdateProfileRequest>({
      query: (profileData) => ({
        url: "/profile/me",
        method: "PATCH",
        body: profileData,
      }),
      invalidatesTags: ["User", "Profile"],
    }),

    uploadAvatar: builder.mutation<{ avatarUrl: string }, FormData>({
      query: (formData) => ({
        url: "/profile/me/avatar",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["User", "Profile"],
    }),

    // Email Verification
    verifyEmail: builder.mutation<void, { token: string }>({
      query: (data) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["User"],
    }),

    resendVerificationEmail: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/resend-verification",
        method: "POST",
      }),
    }),

    // Admin User Management
    getAllUsers: builder.query<User[], void>({
      query: () => "/profile/admin/users",
      providesTags: ["User"],
    }),

    updateUser: builder.mutation<User, { userId: number; data: Partial<User> }>(
      {
        query: ({ userId, data }) => ({
          url: `/profile/admin/user/${userId}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: ["User"],
      }
    ),

    deleteUser: builder.mutation<void, number>({
      query: (userId) => ({
        url: `/profile/admin/user/${userId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useGetCurrentUserQuery,
  useUpdateProfileMutation,
  useUploadAvatarMutation,
  useVerifyEmailMutation,
  useResendVerificationEmailMutation,
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = authApi;
