import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../api";
import type {
  Institution,
  InstitutionDetail,
  CreateInstitutionRequest,
  UpdateInstitutionRequest,
  InstitutionFilters,
  InstitutionListResponse,
  InstitutionStats,
} from "@/types/institution";

export const institutionApi = createApi({
  reducerPath: "institutionApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Institution", "InstitutionDetail"],
  endpoints: (builder) => ({
    // Get all institutions with pagination and filters
    getInstitutions: builder.query<InstitutionListResponse, InstitutionFilters>(
      {
        query: (filters) => ({
          url: "/universities",
          params: filters,
        }),
        providesTags: ["Institution"],
      }
    ),

    // Get institution by ID
    getInstitutionById: builder.query<InstitutionDetail, number>({
      query: (id) => `/universities/${id}`,
      providesTags: (result, error, id) => [{ type: "InstitutionDetail", id }],
    }),

    // Create new institution (Admin only)
    createInstitution: builder.mutation<Institution, CreateInstitutionRequest>({
      query: (institutionData) => ({
        url: "/universities",
        method: "POST",
        body: institutionData,
      }),
      invalidatesTags: ["Institution"],
    }),

    // Update institution (Admin only)
    updateInstitution: builder.mutation<
      Institution,
      { id: number; data: UpdateInstitutionRequest }
    >({
      query: ({ id, data }) => ({
        url: `/universities/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Institution",
        { type: "InstitutionDetail", id },
      ],
    }),

    // Delete institution (Admin only)
    deleteInstitution: builder.mutation<void, number>({
      query: (id) => ({
        url: `/universities/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Institution"],
    }),

    // Search institutions
    searchInstitutions: builder.query<
      InstitutionListResponse,
      InstitutionFilters
    >({
      query: (filters) => ({
        url: "/universities/search",
        params: filters,
      }),
      providesTags: ["Institution"],
    }),

    // Get institutions by location
    getInstitutionsByLocation: builder.query<Institution[], string[]>({
      query: (locations) => ({
        url: "/universities/by-location",
        params: { locations },
      }),
      providesTags: ["Institution"],
    }),

    // Get top rated institutions
    getTopRatedInstitutions: builder.query<Institution[], { limit?: number }>({
      query: ({ limit = 10 }) => ({
        url: "/universities/top-rated",
        params: { limit },
      }),
      providesTags: ["Institution"],
    }),

    // Get institutions by program
    getInstitutionsByProgram: builder.query<Institution[], string[]>({
      query: (programs) => ({
        url: "/universities/by-program",
        params: { programs },
      }),
      providesTags: ["Institution"],
    }),

    // Get institution statistics
    getInstitutionStats: builder.query<InstitutionStats, void>({
      query: () => "/universities/stats",
      providesTags: ["Institution"],
    }),

    // Upload institution logo
    uploadInstitutionLogo: builder.mutation<
      { logoUrl: string },
      { id: number; formData: FormData }
    >({
      query: ({ id, formData }) => ({
        url: `/universities/${id}/logo`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: (result, error, { id }) => [
        "Institution",
        { type: "InstitutionDetail", id },
      ],
    }),

    // Get institution reviews
    getInstitutionReviews: builder.query<
      { data: any[]; total: number; current_page: number; last_page: number },
      { institutionId: number; page?: number; limit?: number }
    >({
      query: ({ institutionId, page = 1, limit = 10 }) => ({
        url: `/universities/${institutionId}/reviews`,
        params: { page, limit },
      }),
      providesTags: (result, error, { institutionId }) => [
        { type: "InstitutionDetail", id: institutionId },
      ],
    }),

    // Get institution courses
    getInstitutionCourses: builder.query<
      { data: any[]; total: number; current_page: number; last_page: number },
      { institutionId: number; page?: number; limit?: number }
    >({
      query: ({ institutionId, page = 1, limit = 10 }) => ({
        url: `/universities/${institutionId}/courses`,
        params: { page, limit },
      }),
      providesTags: (result, error, { institutionId }) => [
        { type: "InstitutionDetail", id: institutionId },
      ],
    }),
  }),
});

export const {
  useGetInstitutionsQuery,
  useGetInstitutionByIdQuery,
  useCreateInstitutionMutation,
  useUpdateInstitutionMutation,
  useDeleteInstitutionMutation,
  useSearchInstitutionsQuery,
  useGetInstitutionsByLocationQuery,
  useGetTopRatedInstitutionsQuery,
  useGetInstitutionsByProgramQuery,
  useGetInstitutionStatsQuery,
  useUploadInstitutionLogoMutation,
  useGetInstitutionReviewsQuery,
  useGetInstitutionCoursesQuery,
} = institutionApi;
