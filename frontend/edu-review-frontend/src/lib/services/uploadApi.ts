import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../api";

export interface UploadResponse {
  publicId: string;
  secureUrl: string;
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
        // Don't set Content-Type header for FormData, let the browser set it
        prepareHeaders: (headers: Headers) => {
          // Remove Content-Type header for FormData
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
