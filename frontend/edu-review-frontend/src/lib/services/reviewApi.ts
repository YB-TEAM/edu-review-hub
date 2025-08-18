import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../api";
import type {
  Review,
  CreateReviewRequest,
  UpdateReviewRequest,
  ReviewFilters,
  ReviewListResponse,
  UserReviewsResponse,
} from "@/types/review";

export const reviewApi = createApi({
  reducerPath: "reviewApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Review"],
  endpoints: (builder) => ({
    getReviews: builder.query<ReviewListResponse, ReviewFilters>({
      query: (filters) => ({
        url: "/reviews",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Review" as const, id })),
              { type: "Review", id: "LIST" },
            ]
          : [{ type: "Review", id: "LIST" }],
    }),

    getReview: builder.query<Review, number>({
      query: (id) => `/reviews/${id}`,
      providesTags: (result, error, id) => [{ type: "Review", id }],
    }),

    createReview: builder.mutation<Review, CreateReviewRequest>({
      query: (reviewData) => ({
        url: "/reviews",
        method: "POST",
        body: reviewData,
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),

    updateReview: builder.mutation<
      Review,
      { id: number; data: UpdateReviewRequest }
    >({
      query: ({ id, data }) => ({
        url: `/reviews/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Review", id },
        { type: "Review", id: "LIST" },
      ],
    }),

    deleteReview: builder.mutation<void, number>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Review", id: "LIST" }],
    }),

    getUserReviews: builder.query<
      UserReviewsResponse,
      { user_id: number; page?: number; limit?: number }
    >({
      query: ({ user_id, page = 1, limit = 10 }) => ({
        url: `/users/${user_id}/reviews`,
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Review" as const, id })),
              { type: "Review", id: "USER_LIST" },
            ]
          : [{ type: "Review", id: "USER_LIST" }],
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useGetReviewQuery,
  useCreateReviewMutation,
  useUpdateReviewMutation,
  useDeleteReviewMutation,
  useGetUserReviewsQuery,
} = reviewApi;
