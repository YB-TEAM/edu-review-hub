import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import {
  UniversityResponse,
  UniversityListResponse,
  CreateUniversityRequest,
  UpdateUniversityRequest,
  UniversityQueryParams,
  CreateUniversityReviewRequest,
  UpdateUniversityReviewRequest,
  ModerateUniversityReviewRequest,
  UniversityStatistics,
  UniversityAnalytics,
  UniversityComparisonRequest,
  UniversityComparisonResponse
} from '@/types/university';

export const universityApi = createApi({
  reducerPath: 'universityApi',
  baseQuery,
  tagTypes: ['University', 'UniversityReview', 'UniversityStats'],
  endpoints: (builder) => ({
    // Basic CRUD operations
    getAllUniversities: builder.query<UniversityListResponse, UniversityQueryParams>({
      query: (params) => ({ url: '/universities/admin/all', method: 'GET', params }),
      providesTags: ['University'],
    }),

    getUniversityById: builder.query<UniversityResponse, number>({
      query: (id) => `/universities/${id}`,
      providesTags: (result, error, id) => [{ type: 'University', id }],
    }),

    createUniversity: builder.mutation<UniversityResponse, CreateUniversityRequest>({
      query: (universityData) => ({ url: '/universities', method: 'POST', body: universityData }),
      invalidatesTags: ['University', 'UniversityStats'],
    }),

    updateUniversity: builder.mutation<UniversityResponse, { id: number; data: UpdateUniversityRequest }>({
      query: ({ id, data }) => ({ url: `/universities/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'University', id },
        'University',
        'UniversityStats'
      ],
    }),

    deleteUniversity: builder.mutation<void, number>({
      query: (id) => ({ url: `/universities/${id}`, method: 'DELETE' }),
      invalidatesTags: ['University', 'UniversityStats'],
    }),

    // University status management
    activateUniversity: builder.mutation<UniversityResponse, number>({
      query: (id) => ({ url: `/universities/${id}/activate`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'University', id },
        'University',
        'UniversityStats'
      ],
    }),

    deactivateUniversity: builder.mutation<UniversityResponse, number>({
      query: (id) => ({ url: `/universities/${id}/deactivate`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'University', id },
        'University',
        'UniversityStats'
      ],
    }),

    suspendUniversity: builder.mutation<UniversityResponse, number>({
      query: (id) => ({ url: `/universities/${id}/suspend`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'University', id },
        'University',
        'UniversityStats'
      ],
    }),

    banUniversity: builder.mutation<UniversityResponse, number>({
      query: (id) => ({ url: `/universities/${id}/ban`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'University', id },
        'University',
        'UniversityStats'
      ],
    }),

    // University verification
    verifyUniversity: builder.mutation<UniversityResponse, number>({
      query: (id) => ({ url: `/universities/${id}/verify`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'University', id },
        'University',
        'UniversityStats'
      ],
    }),

    unverifyUniversity: builder.mutation<UniversityResponse, number>({
      query: (id) => ({ url: `/universities/${id}/unverify`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'University', id },
        'University',
        'UniversityStats'
      ],
    }),

    // University featuring
    featureUniversity: builder.mutation<UniversityResponse, number>({
      query: (id) => ({ url: `/universities/${id}/feature`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'University', id },
        'University',
        'UniversityStats'
      ],
    }),

    unfeatureUniversity: builder.mutation<UniversityResponse, number>({
      query: (id) => ({ url: `/universities/${id}/unfeature`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'University', id },
        'University',
        'UniversityStats'
      ],
    }),

    // University reviews management
    getUniversityReviews: builder.query<UniversityListResponse, { universityId: number; params?: UniversityQueryParams }>({
      query: ({ universityId, params }) => ({ 
        url: `/universities/${universityId}/reviews`, 
        method: 'GET', 
        params 
      }),
      providesTags: (result, error, { universityId }) => [
        { type: 'UniversityReview', id: universityId }
      ],
    }),

    createUniversityReview: builder.mutation<UniversityResponse, { universityId: number; data: CreateUniversityReviewRequest }>({
      query: ({ universityId, data }) => ({ 
        url: `/universities/${universityId}/reviews`, 
        method: 'POST', 
        body: data 
      }),
      invalidatesTags: (result, error, { universityId }) => [
        { type: 'UniversityReview', id: universityId },
        { type: 'University', id: universityId },
        'UniversityStats'
      ],
    }),

    updateUniversityReview: builder.mutation<UniversityResponse, { 
      universityId: number; 
      reviewId: number; 
      data: UpdateUniversityReviewRequest 
    }>({
      query: ({ universityId, reviewId, data }) => ({ 
        url: `/universities/${universityId}/reviews/${reviewId}`, 
        method: 'PUT', 
        body: data 
      }),
      invalidatesTags: (result, error, { universityId }) => [
        { type: 'UniversityReview', id: universityId },
        { type: 'University', id: universityId },
        'UniversityStats'
      ],
    }),

    deleteUniversityReview: builder.mutation<void, { universityId: number; reviewId: number }>({
      query: ({ universityId, reviewId }) => ({ 
        url: `/universities/${universityId}/reviews/${reviewId}`, 
        method: 'DELETE' 
      }),
      invalidatesTags: (result, error, { universityId }) => [
        { type: 'UniversityReview', id: universityId },
        { type: 'University', id: universityId },
        'UniversityStats'
      ],
    }),

    // Review moderation
    moderateUniversityReview: builder.mutation<UniversityResponse, { 
      universityId: number; 
      reviewId: number; 
      data: ModerateUniversityReviewRequest 
    }>({
      query: ({ universityId, reviewId, data }) => ({ 
        url: `/universities/${universityId}/reviews/${reviewId}/moderate`, 
        method: 'PATCH', 
        body: data 
      }),
      invalidatesTags: (result, error, { universityId }) => [
        { type: 'UniversityReview', id: universityId },
        { type: 'University', id: universityId },
        'UniversityStats'
      ],
    }),

    approveUniversityReview: builder.mutation<UniversityResponse, { universityId: number; reviewId: number }>({
      query: ({ universityId, reviewId }) => ({ 
        url: `/universities/${universityId}/reviews/${reviewId}/approve`, 
        method: 'PATCH' 
      }),
      invalidatesTags: (result, error, { universityId }) => [
        { type: 'UniversityReview', id: universityId },
        { type: 'University', id: universityId },
        'UniversityStats'
      ],
    }),

    rejectUniversityReview: builder.mutation<UniversityResponse, { 
      universityId: number; 
      reviewId: number; 
      reason: string 
    }>({
      query: ({ universityId, reviewId, reason }) => ({ 
        url: `/universities/${universityId}/reviews/${reviewId}/reject`, 
        method: 'PATCH', 
        body: { reason } 
      }),
      invalidatesTags: (result, error, { universityId }) => [
        { type: 'UniversityReview', id: universityId },
        { type: 'University', id: universityId },
        'UniversityStats'
      ],
    }),

    // University statistics and analytics
    getUniversityStatistics: builder.query<UniversityStatistics, void>({
      query: () => '/universities/statistics',
      providesTags: ['UniversityStats'],
    }),

    getUniversityAnalytics: builder.query<UniversityAnalytics, { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/universities/analytics', method: 'GET', params }),
      providesTags: ['UniversityStats'],
    }),

    // University comparison
    compareUniversities: builder.mutation<UniversityComparisonResponse, UniversityComparisonRequest>({
      query: (data) => ({ url: '/universities/compare', method: 'POST', body: data }),
    }),

    // Search and filtering
    searchUniversities: builder.query<UniversityListResponse, { query: string; params?: UniversityQueryParams }>({
      query: ({ query, params }) => ({ 
        url: '/universities/search', 
        method: 'GET', 
        params: { q: query, ...params } 
      }),
      providesTags: ['University'],
    }),

    getUniversitiesByLocation: builder.query<UniversityListResponse, { 
      location: string; 
      params?: UniversityQueryParams 
    }>({
      query: ({ location, params }) => ({ 
        url: `/universities/location/${encodeURIComponent(location)}`, 
        method: 'GET', 
        params 
      }),
      providesTags: ['University'],
    }),

    getUniversitiesByType: builder.query<UniversityListResponse, { 
      type: string; 
      params?: UniversityQueryParams 
    }>({
      query: ({ type, params }) => ({ 
        url: `/universities/type/${encodeURIComponent(type)}`, 
        method: 'GET', 
        params 
      }),
      providesTags: ['University'],
    }),

    getUniversitiesByLevel: builder.query<UniversityListResponse, { 
      level: string; 
      params?: UniversityQueryParams 
    }>({
      query: ({ level, params }) => ({ 
        url: `/universities/level/${encodeURIComponent(level)}`, 
        method: 'GET', 
        params 
      }),
      providesTags: ['University'],
    }),

    // Bulk operations
    bulkActivateUniversities: builder.mutation<{ success: number; failed: number }, number[]>({
      query: (ids) => ({ url: '/universities/bulk/activate', method: 'POST', body: { universityIds: ids } }),
      invalidatesTags: ['University', 'UniversityStats'],
    }),

    bulkDeactivateUniversities: builder.mutation<{ success: number; failed: number }, number[]>({
      query: (ids) => ({ url: '/universities/bulk/deactivate', method: 'POST', body: { universityIds: ids } }),
      invalidatesTags: ['University', 'UniversityStats'],
    }),

    bulkDeleteUniversities: builder.mutation<{ success: number; failed: number }, number[]>({
      query: (ids) => ({ url: '/universities/bulk/delete', method: 'POST', body: { universityIds: ids } }),
      invalidatesTags: ['University', 'UniversityStats'],
    }),

    bulkVerifyUniversities: builder.mutation<{ success: number; failed: number }, number[]>({
      query: (ids) => ({ url: '/universities/bulk/verify', method: 'POST', body: { universityIds: ids } }),
      invalidatesTags: ['University', 'UniversityStats'],
    }),

    // Import/Export operations
    exportUniversities: builder.mutation<{ downloadUrl: string }, UniversityQueryParams>({
      query: (params) => ({ url: '/universities/export', method: 'POST', body: params }),
    }),

    importUniversities: builder.mutation<{ success: number; failed: number; errors: string[] }, FormData>({
      query: (formData) => ({ 
        url: '/universities/import', 
        method: 'POST', 
        body: formData,
        headers: {}, // Let the browser set Content-Type for FormData
      }),
      invalidatesTags: ['University', 'UniversityStats'],
    }),

    // University images management
    uploadUniversityImage: builder.mutation<{ imageUrl: string }, { universityId: number; image: File }>({
      query: ({ universityId, image }) => {
        const formData = new FormData();
        formData.append('image', image);
        return { 
          url: `/universities/${universityId}/images`, 
          method: 'POST', 
          body: formData,
          headers: {}, // Let the browser set Content-Type for FormData
        };
      },
      invalidatesTags: (result, error, { universityId }) => [
        { type: 'University', id: universityId }
      ],
    }),

    deleteUniversityImage: builder.mutation<void, { universityId: number; imageId: number }>({
      query: ({ universityId, imageId }) => ({ 
        url: `/universities/${universityId}/images/${imageId}`, 
        method: 'DELETE' 
      }),
      invalidatesTags: (result, error, { universityId }) => [
        { type: 'University', id: universityId }
      ],
    }),

    // University programs management
    addUniversityProgram: builder.mutation<UniversityResponse, { 
      universityId: number; 
      program: any 
    }>({
      query: ({ universityId, program }) => ({ 
        url: `/universities/${universityId}/programs`, 
        method: 'POST', 
        body: program 
      }),
      invalidatesTags: (result, error, { universityId }) => [
        { type: 'University', id: universityId }
      ],
    }),

    updateUniversityProgram: builder.mutation<UniversityResponse, { 
      universityId: number; 
      programId: number; 
      program: any 
    }>({
      query: ({ universityId, programId, program }) => ({ 
        url: `/universities/${universityId}/programs/${programId}`, 
        method: 'PUT', 
        body: program 
      }),
      invalidatesTags: (result, error, { universityId }) => [
        { type: 'University', id: universityId }
      ],
    }),

    deleteUniversityProgram: builder.mutation<void, { universityId: number; programId: number }>({
      query: ({ universityId, programId }) => ({ 
        url: `/universities/${universityId}/programs/${programId}`, 
        method: 'DELETE' 
      }),
      invalidatesTags: (result, error, { universityId }) => [
        { type: 'University', id: universityId }
      ],
    }),
  }),
});

export const {
  // Basic CRUD
  useGetAllUniversitiesQuery,
  useGetUniversityByIdQuery,
  useCreateUniversityMutation,
  useUpdateUniversityMutation,
  useDeleteUniversityMutation,
  
  // Status management
  useActivateUniversityMutation,
  useDeactivateUniversityMutation,
  useSuspendUniversityMutation,
  useBanUniversityMutation,
  
  // Verification
  useVerifyUniversityMutation,
  useUnverifyUniversityMutation,
  
  // Featuring
  useFeatureUniversityMutation,
  useUnfeatureUniversityMutation,
  
  // Reviews
  useGetUniversityReviewsQuery,
  useCreateUniversityReviewMutation,
  useUpdateUniversityReviewMutation,
  useDeleteUniversityReviewMutation,
  
  // Review moderation
  useModerateUniversityReviewMutation,
  useApproveUniversityReviewMutation,
  useRejectUniversityReviewMutation,
  
  // Statistics and analytics
  useGetUniversityStatisticsQuery,
  useGetUniversityAnalyticsQuery,
  
  // Comparison
  useCompareUniversitiesMutation,
  
  // Search and filtering
  useSearchUniversitiesQuery,
  useGetUniversitiesByLocationQuery,
  useGetUniversitiesByTypeQuery,
  useGetUniversitiesByLevelQuery,
  
  // Bulk operations
  useBulkActivateUniversitiesMutation,
  useBulkDeactivateUniversitiesMutation,
  useBulkDeleteUniversitiesMutation,
  useBulkVerifyUniversitiesMutation,
  
  // Import/Export
  useExportUniversitiesMutation,
  useImportUniversitiesMutation,
  
  // Images
  useUploadUniversityImageMutation,
  useDeleteUniversityImageMutation,
  
  // Programs
  useAddUniversityProgramMutation,
  useUpdateUniversityProgramMutation,
  useDeleteUniversityProgramMutation,
} = universityApi;
