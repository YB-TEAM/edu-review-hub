import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import {
  TagResponse,
  TagListResponse,
  CreateTagRequest,
  UpdateTagRequest,
  TagQueryParams,
  TagStatistics,
  TagAnalytics,
  TagUsage,
  TagSuggestion
} from '@/types/tag';

export const tagApi = createApi({
  reducerPath: 'tagApi',
  baseQuery,
  tagTypes: ['Tag', 'TagStats'],
  endpoints: (builder) => ({
    // Basic CRUD operations
    getAllTags: builder.query<TagListResponse, TagQueryParams>({
      query: (params) => ({ url: '/api/v1/tags', method: 'GET', params }),
      providesTags: ['Tag'],
    }),

    getTagById: builder.query<TagResponse, number>({
      query: (id) => `/api/v1/tags/${id}`,
      providesTags: (result, error, id) => [{ type: 'Tag', id }],
    }),

    createTag: builder.mutation<TagResponse, CreateTagRequest>({
      query: (tagData) => ({ url: '/api/v1/tags', method: 'POST', body: tagData }),
      invalidatesTags: ['Tag', 'TagStats'],
    }),

    updateTag: builder.mutation<TagResponse, { id: number; data: UpdateTagRequest }>({
      query: ({ id, data }) => ({ url: `/tags/${id}`, method: 'PUT', body: data }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Tag', id },
        'Tag',
        'TagStats'
      ],
    }),

    deleteTag: builder.mutation<void, number>({
      query: (id) => ({ url: `/tags/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Tag', 'TagStats'],
    }),

    // Tag status management
    activateTag: builder.mutation<TagResponse, number>({
      query: (id) => ({ url: `/tags/${id}/activate`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Tag', id },
        'Tag',
        'TagStats'
      ],
    }),

    deactivateTag: builder.mutation<TagResponse, number>({
      query: (id) => ({ url: `/tags/${id}/deactivate`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Tag', id },
        'Tag',
        'TagStats'
      ],
    }),

    // Tag verification
    verifyTag: builder.mutation<TagResponse, number>({
      query: (id) => ({ url: `/tags/${id}/verify`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Tag', id },
        'Tag',
        'TagStats'
      ],
    }),

    unverifyTag: builder.mutation<TagResponse, number>({
      query: (id) => ({ url: `/tags/${id}/unverify`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Tag', id },
        'Tag',
        'TagStats'
      ],
    }),

    // Tag featuring
    featureTag: builder.mutation<TagResponse, number>({
      query: (id) => ({ url: `/tags/${id}/feature`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Tag', id },
        'Tag',
        'TagStats'
      ],
    }),

    unfeatureTag: builder.mutation<TagResponse, number>({
      query: (id) => ({ url: `/tags/${id}/unfeature`, method: 'PATCH' }),
      invalidatesTags: (result, error, id) => [
        { type: 'Tag', id },
        'Tag',
        'TagStats'
      ],
    }),

    // Tag statistics and analytics
    getTagStatistics: builder.query<TagStatistics, void>({
      query: () => '/api/v1/tags/statistics',
      providesTags: ['TagStats'],
    }),

    getTagAnalytics: builder.query<TagAnalytics, { startDate?: string; endDate?: string }>({
      query: (params) => ({ url: '/api/v1/tags/analytics', method: 'GET', params }),
      providesTags: ['TagStats'],
    }),

    // Tag usage
    getTagUsage: builder.query<TagUsage[], { tagId?: number; limit?: number }>({
      query: (params) => ({ url: '/api/v1/tags/usage', method: 'GET', params }),
      providesTags: ['Tag'],
    }),

    getTagUsageByType: builder.query<TagUsage[], { type: string; limit?: number }>({
      query: ({ type, limit }) => ({ 
        url: `/tags/usage/${encodeURIComponent(type)}`, 
        method: 'GET', 
        params: { limit } 
      }),
      providesTags: ['Tag'],
    }),

    // Tag suggestions
    getTagSuggestions: builder.query<TagSuggestion[], { query: string; limit?: number }>({
      query: ({ query, limit }) => ({ 
        url: '/api/v1/tags/suggestions', 
        method: 'GET', 
        params: { q: query, limit } 
      }),
    }),

    getPopularTags: builder.query<TagResponse[], { limit?: number; period?: string }>({
      query: (params) => ({ url: '/api/v1/tags/popular', method: 'GET', params }),
      providesTags: ['Tag'],
    }),

    getTrendingTags: builder.query<TagResponse[], { limit?: number; period?: string }>({
      query: (params) => ({ url: '/api/v1/tags/trending', method: 'GET', params }),
      providesTags: ['Tag'],
    }),

    // Tag search and filtering
    searchTags: builder.query<TagListResponse, { query: string; params?: TagQueryParams }>({
      query: ({ query, params }) => ({ 
        url: '/api/v1/tags/search', 
        method: 'GET', 
        params: { q: query, ...params } 
      }),
      providesTags: ['Tag'],
    }),

    getTagsByCategory: builder.query<TagListResponse, { category: string; params?: TagQueryParams }>({
      query: ({ category, params }) => ({ 
        url: `/tags/category/${encodeURIComponent(category)}`, 
        method: 'GET', 
        params 
      }),
      providesTags: ['Tag'],
    }),

    getTagsByType: builder.query<TagListResponse, { type: string; params?: TagQueryParams }>({
      query: ({ type, params }) => ({ 
        url: `/tags/type/${encodeURIComponent(type)}`, 
        method: 'GET', 
        params 
      }),
      providesTags: ['Tag'],
    }),

    getTagsByStatus: builder.query<TagListResponse, { status: string; params?: TagQueryParams }>({
      query: ({ status, params }) => ({ 
        url: `/tags/status/${encodeURIComponent(status)}`, 
        method: 'GET', 
        params 
      }),
      providesTags: ['Tag'],
    }),

    // Tag relationships
    getRelatedTags: builder.query<TagResponse[], { tagId: number; limit?: number }>({
      query: ({ tagId, limit }) => ({ 
        url: `/tags/${tagId}/related`, 
        method: 'GET', 
        params: { limit } 
      }),
      providesTags: (result, error, { tagId }) => [{ type: 'Tag', id: tagId }],
    }),

    getTagHierarchy: builder.query<{ tags: TagResponse[]; hierarchy: any }, void>({
      query: () => '/api/v1/tags/hierarchy',
      providesTags: ['Tag'],
    }),

    // Tag content
    getTagContent: builder.query<{ blogs: any[]; universities: any[]; total: number }, { 
      tagId: number; 
      type?: string; 
      params?: TagQueryParams 
    }>({
      query: ({ tagId, type, params }) => ({ 
        url: `/tags/${tagId}/content`, 
        method: 'GET', 
        params: { type, ...params } 
      }),
      providesTags: (result, error, { tagId }) => [{ type: 'Tag', id: tagId }],
    }),

    // Bulk operations
    bulkActivateTags: builder.mutation<{ success: number; failed: number }, number[]>({
      query: (ids) => ({ url: '/api/v1/tags/bulk/activate', method: 'POST', body: { tagIds: ids } }),
      invalidatesTags: ['Tag', 'TagStats'],
    }),

    bulkDeactivateTags: builder.mutation<{ success: number; failed: number }, number[]>({
      query: (ids) => ({ url: '/api/v1/tags/bulk/deactivate', method: 'POST', body: { tagIds: ids } }),
      invalidatesTags: ['Tag', 'TagStats'],
    }),

    bulkDeleteTags: builder.mutation<{ success: number; failed: number }, number[]>({
      query: (ids) => ({ url: '/api/v1/tags/bulk/delete', method: 'POST', body: { tagIds: ids } }),
      invalidatesTags: ['Tag', 'TagStats'],
    }),

    bulkVerifyTags: builder.mutation<{ success: number; failed: number }, number[]>({
      query: (ids) => ({ url: '/api/v1/tags/bulk/verify', method: 'POST', body: { tagIds: ids } }),
      invalidatesTags: ['Tag', 'TagStats'],
    }),

    // Tag import/Export
    exportTags: builder.mutation<{ downloadUrl: string }, TagQueryParams>({
      query: (params) => ({ url: '/api/v1/tags/export', method: 'POST', body: params }),
    }),

    importTags: builder.mutation<{ success: number; failed: number; errors: string[] }, FormData>({
      query: (formData) => ({ 
        url: '/api/v1/tags/import', 
        method: 'POST', 
        body: formData,
        headers: {}, // Let the browser set Content-Type for FormData
      }),
      invalidatesTags: ['Tag', 'TagStats'],
    }),

    // Tag merging
    mergeTags: builder.mutation<{ success: boolean; mergedTag: TagResponse }, { 
      sourceTagId: number; 
      targetTagId: number 
    }>({
      query: (data) => ({ url: '/api/v1/tags/merge', method: 'POST', body: data }),
      invalidatesTags: ['Tag', 'TagStats'],
    }),

    // Tag aliases
    addTagAlias: builder.mutation<{ success: boolean }, { tagId: number; alias: string }>({
      query: ({ tagId, alias }) => ({ 
        url: `/tags/${tagId}/aliases`, 
        method: 'POST', 
        body: { alias } 
      }),
      invalidatesTags: (result, error, { tagId }) => [{ type: 'Tag', id: tagId }],
    }),

    removeTagAlias: builder.mutation<{ success: boolean }, { tagId: number; alias: string }>({
      query: ({ tagId, alias }) => ({ 
        url: `/tags/${tagId}/aliases/${encodeURIComponent(alias)}`, 
        method: 'DELETE' 
      }),
      invalidatesTags: (result, error, { tagId }) => [{ type: 'Tag', id: tagId }],
    }),

    getTagAliases: builder.query<{ aliases: string[] }, number>({
      query: (id) => `/api/v1/tags/${tagId}/aliases`,
      providesTags: (result, error, tagId) => [{ type: 'Tag', id: tagId }],
    }),

    // Tag synonyms
    addTagSynonym: builder.mutation<{ success: boolean }, { tagId: number; synonym: string }>({
      query: ({ tagId, synonym }) => ({ 
        url: `/tags/${tagId}/synonyms`, 
        method: 'POST', 
        body: { synonym } 
      }),
      invalidatesTags: (result, error, { tagId }) => [{ type: 'Tag', id: tagId }],
    }),

    removeTagSynonym: builder.mutation<{ success: boolean }, { tagId: number; synonym: string }>({
      query: ({ tagId, synonym }) => ({ 
        url: `/tags/${tagId}/synonyms/${encodeURIComponent(synonym)}`, 
        method: 'DELETE' 
      }),
      invalidatesTags: (result, error, { tagId }) => [{ type: 'Tag', id: tagId }],
    }),

    getTagSynonyms: builder.query<{ synonyms: string[] }, number>({
      query: (id) => `/api/v1/tags/${tagId}/synonyms`,
      providesTags: (result, error, tagId) => [{ type: 'Tag', id: tagId }],
    }),

    // Tag moderation
    moderateTag: builder.mutation<TagResponse, { 
      tagId: number; 
      action: string; 
      reason?: string 
    }>({
      query: ({ tagId, action, reason }) => ({ 
        url: `/tags/${tagId}/moderate`, 
        method: 'PATCH', 
        body: { action, reason } 
      }),
      invalidatesTags: (result, error, { tagId }) => [
        { type: 'Tag', id: tagId },
        'Tag',
        'TagStats'
      ],
    }),

    // Tag reports
    reportTag: builder.mutation<{ success: boolean }, { 
      tagId: number; 
      reason: string; 
      description?: string 
    }>({
      query: ({ tagId, reason, description }) => ({ 
        url: `/tags/${tagId}/report`, 
        method: 'POST', 
        body: { reason, description } 
      }),
    }),

    getTagReports: builder.query<{ reports: any[] }, { tagId?: number; status?: string }>({
      query: (params) => ({ url: '/api/v1/tags/reports', method: 'GET', params }),
      providesTags: ['Tag'],
    }),

    // Tag cleanup
    cleanupUnusedTags: builder.mutation<{ removedCount: number; keptCount: number }, { 
      threshold?: number; 
      dryRun?: boolean 
    }>({
      query: (params) => ({ url: '/api/v1/tags/cleanup', method: 'POST', body: params }),
      invalidatesTags: ['Tag', 'TagStats'],
    }),

    // Tag validation
    validateTag: builder.mutation<{ isValid: boolean; errors: string[] }, CreateTagRequest>({
      query: (tagData) => ({ url: '/api/v1/tags/validate', method: 'POST', body: tagData }),
    }),
  }),
});

export const {
  // Basic CRUD
  useGetAllTagsQuery,
  useGetTagByIdQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  
  // Status management
  useActivateTagMutation,
  useDeactivateTagMutation,
  
  // Verification
  useVerifyTagMutation,
  useUnverifyTagMutation,
  
  // Featuring
  useFeatureTagMutation,
  useUnfeatureTagMutation,
  
  // Statistics and analytics
  useGetTagStatisticsQuery,
  useGetTagAnalyticsQuery,
  
  // Tag usage
  useGetTagUsageQuery,
  useGetTagUsageByTypeQuery,
  
  // Tag suggestions
  useGetTagSuggestionsQuery,
  useGetPopularTagsQuery,
  useGetTrendingTagsQuery,
  
  // Search and filtering
  useSearchTagsQuery,
  useGetTagsByCategoryQuery,
  useGetTagsByTypeQuery,
  useGetTagsByStatusQuery,
  
  // Tag relationships
  useGetRelatedTagsQuery,
  useGetTagHierarchyQuery,
  
  // Tag content
  useGetTagContentQuery,
  
  // Bulk operations
  useBulkActivateTagsMutation,
  useBulkDeactivateTagsMutation,
  useBulkDeleteTagsMutation,
  useBulkVerifyTagsMutation,
  
  // Import/Export
  useExportTagsMutation,
  useImportTagsMutation,
  
  // Tag merging
  useMergeTagsMutation,
  
  // Tag aliases
  useAddTagAliasMutation,
  useRemoveTagAliasMutation,
  useGetTagAliasesQuery,
  
  // Tag synonyms
  useAddTagSynonymMutation,
  useRemoveTagSynonymMutation,
  useGetTagSynonymsQuery,
  
  // Tag moderation
  useModerateTagMutation,
  
  // Tag reports
  useReportTagMutation,
  useGetTagReportsQuery,
  
  // Tag cleanup
  useCleanupUnusedTagsMutation,
  
  // Tag validation
  useValidateTagMutation,
} = tagApi;
