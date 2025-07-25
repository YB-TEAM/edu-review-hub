import { api } from "../api";

export interface Blog {
  id: number;
  title: string;
  content: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogRequest {
  title: string;
  content: string;
}

export interface UpdateBlogRequest {
  title?: string;
  content?: string;
}

export interface BlogFilters {
  page?: number;
  limit?: number;
}

export interface BlogListResponse {
  data: Blog[];
  metadata: {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
}

export const blogApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBlogs: builder.query<BlogListResponse, BlogFilters>({
      query: (filters) => ({
        url: "/blogs",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Blog" as const, id })),
              { type: "Blog", id: "LIST" },
            ]
          : [{ type: "Blog", id: "LIST" }],
    }),

    getBlog: builder.query<Blog, number>({
      query: (id) => `/blogs/${id}`,
      providesTags: (result, error, id) => [{ type: "Blog", id }],
    }),

    createBlog: builder.mutation<Blog, CreateBlogRequest>({
      query: (blogData) => ({
        url: "/blogs",
        method: "POST",
        body: blogData,
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),

    updateBlog: builder.mutation<Blog, { id: number; data: UpdateBlogRequest }>(
      {
        query: ({ id, data }) => ({
          url: `/blogs/${id}`,
          method: "PATCH",
          body: data,
        }),
        invalidatesTags: (result, error, { id }) => [
          { type: "Blog", id },
          { type: "Blog", id: "LIST" },
        ],
      }
    ),

    deleteBlog: builder.mutation<void, number>({
      query: (id) => ({
        url: `/blogs/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Blog", id: "LIST" }],
    }),
  }),
});

export const {
  useGetBlogsQuery,
  useGetBlogQuery,
  useCreateBlogMutation,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = blogApi;
