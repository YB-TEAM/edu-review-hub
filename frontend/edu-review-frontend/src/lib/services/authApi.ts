import { api } from "../api";

export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  phone?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),

    getProfile: builder.query<User, void>({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),

    updateProfile: builder.mutation<User, Partial<User>>({
      query: (userData) => ({
        url: "/auth/profile",
        method: "PUT",
        body: userData,
      }),
      invalidatesTags: ["User"],
    }),

    // Forgot Password
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/email-verification/forgot-password",
        method: "POST",
        body: data,
      }),
    }),

    // Reset Password
    resetPassword: builder.mutation<
      { message: string },
      { email: string; otp: string; newPassword: string }
    >({
      query: (data) => ({
        url: "/email-verification/reset-password",
        method: "POST",
        body: data,
      }),
    }),

    // Verify Email (OTP)
    verifyEmail: builder.mutation<
      { message: string },
      { email: string; otp: string }
    >({
      query: (data) => ({
        url: "/email-verification/verify-email",
        method: "POST",
        body: data,
      }),
    }),

    // Resend Verification Email
    resendVerification: builder.mutation<
      { message: string },
      { email: string }
    >({
      query: (data) => ({
        url: "/email-verification/resend-verification",
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = authApi;
