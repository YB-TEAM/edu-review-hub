import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQuery } from './baseQuery';
import {
  BlogResponse,
  BlogListResponse,
  CreateBlogRequest,
  UpdateBlogRequest,
  BlogQueryParams,
  ApproveBlogRequest,
  RejectBlogRequest,
  BanBlogRequest,
  UnbanBlogRequest,
  BlogStatistics,
  BlogAnalytics
} from '@/types/blog';

// Blog API service
export const blogApi = createApi({
  reducerPath: 'blogApi',
  baseQuery,
  tagTypes: ['Blog', 'BlogStats'],
  endpoints: (builder) => ({
    // Get all blogs for admin
    getAllBlogs: builder.query<BlogListResponse, BlogQueryParams>({
      query: (params) => ({
        url: '/blogs/admin/all',
        method: 'GET',
        params,
      }),
      providesTags: ['Blog'],
    }),

    // Get blogs pending moderation
    getPendingModeration: builder.query<BlogListResponse, BlogQueryParams>({
      query: (params) => ({
        url: '/blogs/pending-moderation',
        method: 'GET',
        params,
      }),
      providesTags: ['Blog'],
    }),

    // Get blog by ID
    getBlogById: builder.query<BlogResponse, number>({
      query: (id) => `/blogs/${id}`,
      providesTags: (result, error, id) => [{ type: 'Blog', id }],
    }),

    // Create new blog
    createBlog: builder.mutation<BlogResponse, CreateBlogRequest>({
      query: (blogData) => ({
        url: '/blogs',
        method: 'POST',
        body: blogData,
      }),
      invalidatesTags: ['Blog', 'BlogStats'],
    }),

    // Update blog
    updateBlog: builder.mutation<BlogResponse, { id: number; data: UpdateBlogRequest }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}`,
        method: 'PATCH',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        'Blog',
        'BlogStats'
      ],
    }),

    // Delete blog
    deleteBlog: builder.mutation<void, number>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Blog', 'BlogStats'],
    }),

    // Publish blog
    publishBlog: builder.mutation<BlogResponse, number>({
      query: (id) => ({
        url: `/blogs/${id}/publish`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blog', id },
        'Blog',
        'BlogStats'
      ],
    }),

    // Like/unlike blog
    toggleBlogLike: builder.mutation<void, number>({
      query: (id) => ({
        url: `/blogs/${id}/like`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [
        { type: 'Blog', id },
        'BlogStats'
      ],
    }),

    // Approve blog
    approveBlog: builder.mutation<BlogResponse, { id: number; data: ApproveBlogRequest }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}/approve`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        'Blog',
        'BlogStats'
      ],
    }),

    // Reject blog
    rejectBlog: builder.mutation<BlogResponse, { id: number; data: RejectBlogRequest }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}/reject`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        'Blog',
        'BlogStats'
      ],
    }),

    // Ban blog
    banBlog: builder.mutation<BlogResponse, { id: number; data: BanBlogRequest }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}/ban`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        'Blog',
        'BlogStats'
      ],
    }),

    // Unban blog
    unbanBlog: builder.mutation<BlogResponse, { id: number; data: UnbanBlogRequest }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}/unban`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: 'Blog', id },
        'Blog',
        'BlogStats'
      ],
    }),

    // Get blog statistics
    getBlogStatistics: builder.query<BlogStatistics, void>({
      query: () => '/blogs/statistics',
      providesTags: ['BlogStats'],
    }),

    // Get blog analytics
    getBlogAnalytics: builder.query<BlogAnalytics, { startDate?: string; endDate?: string }>({
      query: (params) => ({
        url: '/blogs/analytics',
        method: 'GET',
        params,
      }),
      providesTags: ['BlogStats'],
    }),

    // Bulk operations
    bulkApproveBlogs: builder.mutation<{ success: number; failed: number }, number[]>({
      query: (ids) => ({
        url: '/blogs/bulk/approve',
        method: 'POST',
        body: { blogIds: ids },
      }),
      invalidatesTags: ['Blog', 'BlogStats'],
    }),

    bulkRejectBlogs: builder.mutation<{ success: number; failed: number }, { ids: number[]; reason: string }>({
      query: ({ ids, reason }) => ({
        url: '/blogs/bulk/reject',
        method: 'POST',
        body: { blogIds: ids, reason },
      }),
      invalidatesTags: ['Blog', 'BlogStats'],
    }),

    bulkDeleteBlogs: builder.mutation<{ success: number; failed: number }, number[]>({
      query: (ids) => ({
        url: '/blogs/bulk/delete',
        method: 'DELETE',
        body: { blogIds: ids },
      }),
      invalidatesTags: ['Blog', 'BlogStats'],
    }),

    // Search blogs
    searchBlogs: builder.query<BlogListResponse, { query: string; params?: BlogQueryParams }>({
      query: ({ query, params }) => ({
        url: `/blogs/search?q=${encodeURIComponent(query)}`,
        method: 'GET',
        params,
      }),
      providesTags: ['Blog'],
    }),

    // Get blogs by author
    getBlogsByAuthor: builder.query<BlogListResponse, { authorId: number; params?: BlogQueryParams }>({
      query: ({ authorId, params }) => ({
        url: `/blogs/author/${authorId}`,
        method: 'GET',
        params,
      }),
      providesTags: ['Blog'],
    }),

    // Get blogs by category
    getBlogsByCategory: builder.query<BlogListResponse, { category: string; params?: BlogQueryParams }>({
      query: ({ category, params }) => ({
        url: `/blogs/category/${category}`,
        method: 'GET',
        params,
      }),
      providesTags: ['Blog'],
    }),

    // Get blogs by tag
    getBlogsByTag: builder.query<BlogListResponse, { tagId: number; params?: BlogQueryParams }>({
      query: ({ tagId, params }) => ({
        url: `/blogs/tag/${tagId}`,
        method: 'GET',
        params,
      }),
      providesTags: ['Blog'],
    }),

    // Export blogs
    exportBlogs: builder.mutation<Blob, { format: 'csv' | 'excel' | 'pdf'; params?: BlogQueryParams }>({
      query: ({ format, params }) => ({
        url: `/blogs/export/${format}`,
        method: 'GET',
        params,
        responseHandler: (response) => response.blob(),
      }),
    }),

    // Import blogs
    importBlogs: builder.mutation<{ success: number; failed: number; errors: string[] }, FormData>({
      query: (formData) => ({
        url: '/blogs/import',
        method: 'POST',
        body: formData,
      }),
      invalidatesTags: ['Blog', 'BlogStats'],
    }),
  }),
});

// Export hooks
export const {
  useGetAllBlogsQuery,
  useGetPendingModerationQuery,
  useGetBlogByIdQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  usePublishBlogMutation,
  useToggleBlogLikeMutation,
  useApproveBlogMutation,
  useRejectBlogMutation,
  useBanBlogMutation,
  useUnbanBlogMutation,
  useGetBlogStatisticsQuery,
  useGetBlogAnalyticsQuery,
  useBulkApproveBlogsMutation,
  useBulkRejectBlogsMutation,
  useBulkDeleteBlogsMutation,
  useSearchBlogsQuery,
  useGetBlogsByAuthorQuery,
  useGetBlogsByCategoryQuery,
  useGetBlogsByTagQuery,
  useExportBlogsMutation,
  useImportBlogsMutation,
} = blogApi;
