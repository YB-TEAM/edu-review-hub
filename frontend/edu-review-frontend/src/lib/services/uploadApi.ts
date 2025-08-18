import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../api";

export interface UploadResponse {
  publicId: string;
  secureUrl: string;
  url: string;
  width: number;
  height: number;
  format: string;
  bytes: string;
  createdAt: string;
  message?: string;
}

export const uploadApi = createApi({
  reducerPath: "uploadApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Upload"],
  endpoints: (builder) => ({
    // Upload image
    uploadImage: builder.mutation<UploadResponse, FormData>({
      query: (formData) => ({
        url: "/upload/image",
        method: "POST",
        body: formData,
        // Let the browser set Content-Type for FormData automatically
        prepareHeaders: (headers: Headers) => {
          // Ensure we don't override the browser's Content-Type for FormData
          headers.delete("Content-Type");
          return headers;
        },
      }),
      invalidatesTags: ["Upload"],
    }),
  }),
});

export const {
  useUploadImageMutation,
} = uploadApi;
