import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../api";
import type {
  UserProfile,
  UpdateProfileRequest,
  UploadAvatarResponse,
} from "@/types/profile";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Profile"],
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
    uploadAvatar: builder.mutation<UploadAvatarResponse, FormData>({
      query: (formData) => ({
        url: "/profile/me/avatar",
        method: "POST",
        body: formData,
        prepareHeaders: (headers: Headers) => {
          if (typeof window !== "undefined") {
            const token = localStorage.getItem("token");
            if (token) {
              headers.set("authorization", `Bearer ${token}`);
            }
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
