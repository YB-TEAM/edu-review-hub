import { api } from "../api";

export interface Review {
  id: number;
  user_id: number;
  course_id: number;
  institution_id: number;
  rating: number;
  content: string;
  pros?: string;
  cons?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
  };
  course?: {
    id: number;
    name: string;
  };
  institution?: {
    id: number;
    name: string;
  };
}

export interface CreateReviewRequest {
  course_id: number;
  institution_id: number;
  rating: number;
  content: string;
  pros?: string;
  cons?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  content?: string;
  pros?: string;
  cons?: string;
}

export interface ReviewFilters {
  course_id?: number;
  institution_id?: number;
  rating?: number;
  user_id?: number;
  page?: number;
  limit?: number;
  sort_by?: "created_at" | "rating" | "updated_at";
  sort_order?: "asc" | "desc";
}

export const reviewApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getReviews: builder.query<
      {
        data: Review[];
        total: number;
        current_page: number;
        last_page: number;
      },
      ReviewFilters
    >({
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
      { data: Review[]; total: number },
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
