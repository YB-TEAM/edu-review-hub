import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type {
  User,
  UserRole,
  UserStatus,
  PaginationMeta,
  ApiResponse,
} from "@/types";

// Define local types for API responses
interface UserListResponse {
  data: User[];
  metadata: PaginationMeta;
  success: boolean;
  message: string;
}

interface UpdateUserRequest {
  id: number;
  status?: UserStatus;
  role?: UserRole;
}

export const userApi = createApi({
  reducerPath: "userApi",
  baseQuery,
  tagTypes: ["User"],
  endpoints: (builder) => ({
    // Get all users with pagination and filters
    getUsers: builder.query<UserListResponse, { page?: number; limit?: number; search?: string }>({
      query: (filters) => ({
        url: "/api/v1/users",
        method: "GET",
        params: filters,
      }),
      providesTags: ["User"],
    }),

    // Get user by ID
    getUserById: builder.query<ApiResponse<User>, number>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "User", id }],
    }),

    // Update user status
    updateUserStatus: builder.mutation<ApiResponse<User>, { id: number; status: UserStatus }>({
      query: ({ id, status }) => ({
        url: `/api/v1/users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    // Update user role
    updateUserRole: builder.mutation<ApiResponse<User>, { id: number; role: UserRole }>({
      query: ({ id, role }) => ({
        url: `/api/v1/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    // Deactivate user account
    deactivateUser: builder.mutation<ApiResponse<void>, { id: number; reason: string }>({
      query: ({ id, reason }) => ({
        url: `/api/v1/users/${id}/deactivate`,
        method: "POST",
        body: { reason },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "User", id }],
    }),

    // Reactivate user account
    reactivateUser: builder.mutation<ApiResponse<User>, number>({
      query: (id) => ({
        url: `/api/v1/users/${id}/reactivate`,
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
  useDeactivateUserMutation,
  useReactivateUserMutation,
} = userApi;
