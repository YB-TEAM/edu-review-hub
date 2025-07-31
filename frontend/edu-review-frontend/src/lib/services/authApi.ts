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
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  message?: string;
}

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      // Tự động lưu token và invalidate cache
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log("Login response:", data);
          console.log("Token from response:", data.accessToken);
          // Lưu token vào localStorage
          localStorage.setItem("token", data.accessToken);
          console.log("Token saved to localStorage");
          // Invalidate và refetch profile
          dispatch(authApi.util.invalidateTags(["User", "Profile"]));
        } catch (error) {
          console.error("Login error:", error);
          // Xóa token nếu login thất bại
          localStorage.removeItem("token");
        }
      },
      invalidatesTags: ["User", "Profile"],
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: "/auth/register",
        method: "POST",
        body: userData,
      }),
      // Tự động lưu token sau register
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("token", data.accessToken);
          dispatch(authApi.util.invalidateTags(["User", "Profile"]));
        } catch (error) {
          localStorage.removeItem("token");
        }
      },
      invalidatesTags: ["User", "Profile"],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      // Tự động xóa token và clear cache
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem("token");
          // Clear tất cả cache
          dispatch(api.util.resetApiState());
        } catch (error) {
          // Vẫn xóa token ngay cả khi logout API thất bại
          localStorage.removeItem("token");
          dispatch(api.util.resetApiState());
        }
      },
      invalidatesTags: ["User", "Profile"],
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: (data) => ({
        url: "/email-verification/forgot-password",
        method: "POST",
        body: data,
      }),
    }),
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
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useVerifyEmailMutation,
  useResendVerificationMutation,
} = authApi;
