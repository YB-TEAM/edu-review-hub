import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { AuthResponse, LoginRequest, RefreshTokenRequest } from "@/types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/api/v1/auth/login",
        method: "POST",
        body: credentials,
      }),
      invalidatesTags: ["Auth"],
      // Transform response - API returns data directly
      transformResponse: (response: any) => {
        // Check if response has required fields
        if (response.accessToken && response.user) {
          return response;
        }
        throw new Error('Invalid response format');
      },
      // Handle successful login
      async onQueryStarted(credentials, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Store tokens in localStorage
          if (data.accessToken) {
            localStorage.setItem('accessToken', data.accessToken);
          }
          if (data.refreshToken) {
            localStorage.setItem('refreshToken', data.refreshToken);
          }
        } catch (error) {
          console.error('Login error:', error);
          // Clear any partial data
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      },
    }),

    refreshToken: builder.mutation<AuthResponse, RefreshTokenRequest>({
      query: (refreshData) => ({
        url: "/api/v1/auth/refresh",
        method: "POST",
        body: refreshData,
      }),
      invalidatesTags: ["Auth"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/api/v1/auth/logout",
        method: "POST",
      }),
      invalidatesTags: ["Auth"],
      // Clear tokens on logout
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        } catch (error) {
          // Even if logout fails, clear tokens locally
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      },
    }),

    getProfile: builder.query<any, void>({
      query: () => "/api/v1/auth/profile",
      providesTags: ["Auth"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetProfileQuery,
} = authApi;
