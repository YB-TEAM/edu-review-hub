import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../api";
import type {
  Blog,
  CreateBlogRequest,
  UpdateBlogRequest,
  BlogFilters,
  Tag,
  CreateTagRequest,
  UpdateTagRequest,
  BlogLike,
  BlogComment,
  BlogListResponse,
} from "@/types/blog";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Blog", "Tag", "BlogLike", "BlogComment"],
  endpoints: (builder) => ({
    // Get all blogs with pagination and filters
    getBlogs: builder.query<BlogListResponse, BlogFilters>({
      query: (filters) => ({
        url: "/blogs",
        params: filters,
      }),
      providesTags: ["Blog"],
    }),

    // Get blog by ID
    getBlogById: builder.query<Blog, number>({
      query: (id) => `/blogs/${id}`,
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    // Get blog by slug
    getBlogBySlug: builder.query<Blog, string>({
      query: (slug) => `/blogs/slug/${slug}`,
      providesTags: (result, error, slug) => [{ type: "Blog", id: slug }],
    }),

    // Get my drafts
    getMyDrafts: builder.query<
      BlogListResponse,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/blogs/my-drafts",
        params,
      }),
      providesTags: ["Blog"],
    }),

    // Get blogs for moderation (admin/moderator only)
    getModerationBlogs: builder.query<
      BlogListResponse,
      { page?: number; limit?: number }
    >({
      query: (params) => ({
        url: "/blogs/moderation",
        params,
      }),
      providesTags: ["Blog"],
    }),

    // Create new blog
    createBlog: builder.mutation<Blog, CreateBlogRequest>({
      query: (blogData) => ({
        url: "/blogs",
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: ["Blog"],
    }),

    // Update blog
    updateBlog: builder.mutation<Blog, { id: number; data: UpdateBlogRequest }>(
      {
        query: ({ id, data }) => ({
          url: `/blogs/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: "Blog", id }],
      }
    ),

    // Publish blog (submit for moderation)
    publishBlog: builder.mutation<Blog, { id: number; data: any }>({
      query: ({ id, data }) => ({
        url: `/blogs/${id}/publish`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Blog", id }],
    }),

    // Delete blog
    deleteBlog: builder.mutation<void, number>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    // Like/Unlike blog
    likeBlog: builder.mutation<void, number>({
      query: (id) => ({
        url: `/blogs/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Blog", id },
        "BlogLike",
      ],
    }),

    // Approve blog (admin/moderator only)
    approveBlog: builder.mutation<
      Blog,
      { id: number; data: { moderationReason?: string } }
    >({
      query: ({ id, data }) => ({
        url: `/blogs/${id}/approve`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Blog", id }],
    }),

    // Reject blog (admin/moderator only)
    rejectBlog: builder.mutation<
      Blog,
      { id: number; data: { moderationReason: string } }
    >({
      query: ({ id, data }) => ({
        url: `/blogs/${id}/reject`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Blog", id }],
    }),

    // Ban blog (admin/moderator only)
    banBlog: builder.mutation<
      Blog,
      { id: number; data: { moderationReason: string } }
    >({
      query: ({ id, data }) => ({
        url: `/blogs/${id}/ban`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Blog", id }],
    }),

    // Get all tags
    getTags: builder.query<Tag[], void>({
      query: () => "/tags",
      providesTags: ["Tag"],
    }),

    // Create tag
    createTag: builder.mutation<Tag, CreateTagRequest>({
      query: (tagData) => ({
        url: "/tags",
        method: "POST",
        body: tagData,
      }),
      invalidatesTags: ["Tag"],
    }),

    // Update tag
    updateTag: builder.mutation<Tag, { id: number; data: UpdateTagRequest }>({
      query: ({ id, data }) => ({
        url: `/tags/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Tag", id }],
    }),

    // Delete tag
    deleteTag: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tag"],
    }),

    // Get blog comments
    getBlogComments: builder.query<BlogComment[], number>({
      query: (blogId) => `/blogs/${blogId}/comments`,
      providesTags: (result, error, blogId) => [
        { type: "BlogComment", id: blogId },
      ],
    }),

    // Add comment to blog
    addBlogComment: builder.mutation<
      BlogComment,
      { blogId: number; content: string }
    >({
      query: ({ blogId, content }) => ({
        url: `/blogs/${blogId}/comments`,
        method: "POST",
        body: { content },
      }),
      invalidatesTags: (result, error, { blogId }) => [
        { type: "BlogComment", id: blogId },
      ],
    }),

    // Delete comment
    deleteBlogComment: builder.mutation<
      void,
      { blogId: number; commentId: number }
    >({
      query: ({ blogId, commentId }) => ({
        url: `/blogs/${blogId}/comments/${commentId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { blogId }) => [
        { type: "BlogComment", id: blogId },
      ],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogByIdQuery,
  useGetBlogBySlugQuery,
  useGetMyDraftsQuery,
  useGetModerationBlogsQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  usePublishBlogMutation,
  useDeleteBlogMutation,
  useLikeBlogMutation,
  useApproveBlogMutation,
  useRejectBlogMutation,
  useBanBlogMutation,
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useGetBlogCommentsQuery,
  useAddBlogCommentMutation,
  useDeleteBlogCommentMutation,
} = blogApi;
