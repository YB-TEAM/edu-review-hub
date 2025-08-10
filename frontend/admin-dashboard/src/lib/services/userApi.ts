import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  User,
  UserFilters,
  UpdateUserStatusDto,
  UpdateUserRoleDto,
  UserActivity,
  UserDevice,
  PaginatedResponse,
} from "@/types";

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "UserActivity", "UserDevice"],
  endpoints: (builder) => ({
    // Get all users with pagination and filters
    getUsers: builder.query<PaginatedResponse<User>, UserFilters>({
      query: (filters) => ({
        url: "/users",
        params: filters,
      }),
      providesTags: ["User"],
    }),

    // Get user by ID
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Update user status
    updateUserStatus: builder.mutation<User, { id: number; data: UpdateUserStatusDto }>({
      query: ({ id, data }) => ({
        url: `/users/${id}/status`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    // Update user role
    updateUserRole: builder.mutation<User, { id: number; data: UpdateUserRoleDto }>({
      query: ({ id, data }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    // Get user activities
    getUserActivities: builder.query<PaginatedResponse<UserActivity>, { userId: number; page: number; limit: number }>({
      query: ({ userId, page, limit }) => ({
        url: `/users/${userId}/activities`,
        params: { page, limit },
      }),
      providesTags: (result, error, { userId }) => [{ type: "UserActivity", id: userId }],
    }),

    // Get user devices
    getUserDevices: builder.query<UserDevice[], number>({
      query: (userId) => `/users/${userId}/devices`,
      providesTags: (result, error, userId) => [{ type: "UserDevice", id: userId }],
    }),

    // Deactivate user account
    deactivateUser: builder.mutation<void, { id: number; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/users/${id}/deactivate`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    // Reactivate user account
    reactivateUser: builder.mutation<User, number>({
      query: (id) => ({
        url: `/users/${id}/reactivate`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "User", id }],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useUpdateUserStatusMutation,
  useUpdateUserRoleMutation,
  useGetUserActivitiesQuery,
  useGetUserDevicesQuery,
  useDeactivateUserMutation,
  useReactivateUserMutation,
} = userApi;
