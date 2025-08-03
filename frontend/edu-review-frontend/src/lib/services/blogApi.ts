import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
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
  PaginatedResponse,
} from "@/types";

export const blogApi = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as any).auth.accessToken;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Blog", "Tag", "BlogLike", "BlogComment"],
  endpoints: (builder) => ({
    // Get all blogs with pagination and filters
    getBlogs: builder.query<PaginatedResponse<Blog>, BlogFilters>({
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

    // Delete blog
    deleteBlog: builder.mutation<void, number>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),

    // Publish blog
    publishBlog: builder.mutation<Blog, number>({
      query: (id) => ({
        url: `/blogs/${id}/publish`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    // Like/Unlike blog
    toggleBlogLike: builder.mutation<void, number>({
      query: (id) => ({
        url: `/blogs/${id}/like`,
        method: "POST",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Blog", id },
        { type: "BlogLike", id },
      ],
    }),

    // Get my blogs
    getMyBlogs: builder.query<
      PaginatedResponse<Blog>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/blogs/my",
        params: { page, limit },
      }),
      providesTags: ["Blog"],
    }),

    // Get pending moderation blogs (Admin/Moderator)
    getPendingModeration: builder.query<
      PaginatedResponse<Blog>,
      { page?: number; limit?: number }
    >({
      query: ({ page = 1, limit = 10 }) => ({
        url: "/blogs/pending",
        params: { page, limit },
      }),
      providesTags: ["Blog"],
    }),

    // Moderate blog (Admin/Moderator)
    moderateBlog: builder.mutation<
      Blog,
      { id: number; action: "approve" | "reject" | "ban"; reason?: string }
    >({
      query: ({ id, action, reason }) => ({
        url: `/blogs/${id}/moderate`,
        method: "POST",
        body: { action, reason },
      }),
      invalidatesTags: ["Blog"],
    }),

    // Search blogs
    searchBlogs: builder.query<PaginatedResponse<Blog>, BlogFilters>({
      query: (filters) => ({
        url: "/blogs/search",
        params: filters,
      }),
      providesTags: ["Blog"],
    }),

    // Get blogs by category
    getBlogsByCategory: builder.query<
      PaginatedResponse<Blog>,
      { category: string; page?: number; limit?: number }
    >({
      query: ({ category, page = 1, limit = 10 }) => ({
        url: `/blogs/category/${category}`,
        params: { page, limit },
      }),
      providesTags: ["Blog"],
    }),

    // Get blogs by tag
    getBlogsByTag: builder.query<
      PaginatedResponse<Blog>,
      { tagId: number; page?: number; limit?: number }
    >({
      query: ({ tagId, page = 1, limit = 10 }) => ({
        url: `/blogs/tag/${tagId}`,
        params: { page, limit },
      }),
      providesTags: ["Blog"],
    }),

    // Get popular blogs
    getPopularBlogs: builder.query<Blog[], { limit?: number }>({
      query: ({ limit = 10 }) => ({
        url: "/blogs/popular",
        params: { limit },
      }),
      providesTags: ["Blog"],
    }),

    // Get related blogs
    getRelatedBlogs: builder.query<Blog[], { blogId: number; limit?: number }>({
      query: ({ blogId, limit = 5 }) => ({
        url: `/blogs/${blogId}/related`,
        params: { limit },
      }),
      providesTags: ["Blog"],
    }),

    // Tags management
    getTags: builder.query<Tag[], void>({
      query: () => "/tags",
      providesTags: ["Tag"],
    }),

    createTag: builder.mutation<Tag, CreateTagRequest>({
      query: (tagData) => ({
        url: "/tags",
        method: "POST",
        body: tagData,
      }),
      invalidatesTags: ["Tag"],
    }),

    updateTag: builder.mutation<Tag, { id: number; data: UpdateTagRequest }>({
      query: ({ id, data }) => ({
        url: `/tags/${id}`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: "Tag", id }],
    }),

    deleteTag: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tags/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Tag"],
    }),

    // Blog comments
    getBlogComments: builder.query<
      PaginatedResponse<BlogComment>,
      { blogId: number; page?: number; limit?: number }
    >({
      query: ({ blogId, page = 1, limit = 10 }) => ({
        url: `/blogs/${blogId}/comments`,
        params: { page, limit },
      }),
      providesTags: (result, error, { blogId }) => [
        { type: "BlogComment", id: blogId },
      ],
    }),

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
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
  usePublishBlogMutation,
  useToggleBlogLikeMutation,
  useGetMyBlogsQuery,
  useGetPendingModerationQuery,
  useModerateBlogMutation,
  useSearchBlogsQuery,
  useGetBlogsByCategoryQuery,
  useGetBlogsByTagQuery,
  useGetPopularBlogsQuery,
  useGetRelatedBlogsQuery,
  useGetTagsQuery,
  useCreateTagMutation,
  useUpdateTagMutation,
  useDeleteTagMutation,
  useGetBlogCommentsQuery,
  useAddBlogCommentMutation,
  useDeleteBlogCommentMutation,
} = blogApi;
