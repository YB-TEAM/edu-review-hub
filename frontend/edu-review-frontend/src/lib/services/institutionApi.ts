import { api } from "../api";

export interface Institution {
  id: number;
  name: string;
  description?: string;
  address?: string;
  website?: string;
  email?: string;
  phone?: string;
  logo_url?: string;
  type?: "university" | "college" | "school" | "training_center";
  created_at: string;
  updated_at: string;
  courses_count?: number;
  reviews_count?: number;
  average_rating?: number;
}

export interface CreateInstitutionRequest {
  name: string;
  description?: string;
  address?: string;
  website?: string;
  email?: string;
  phone?: string;
  type?: "university" | "college" | "school" | "training_center";
}

export interface UpdateInstitutionRequest {
  name?: string;
  description?: string;
  address?: string;
  website?: string;
  email?: string;
  phone?: string;
  type?: "university" | "college" | "school" | "training_center";
}

export interface InstitutionFilters {
  type?: "university" | "college" | "school" | "training_center";
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: "name" | "created_at" | "average_rating" | "reviews_count";
  sort_order?: "asc" | "desc";
}

export const institutionApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getInstitutions: builder.query<
      {
        data: Institution[];
        total: number;
        current_page: number;
        last_page: number;
      },
      InstitutionFilters
    >({
      query: (filters) => ({
        url: "/institutions",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Institution" as const,
                id,
              })),
              { type: "Institution", id: "LIST" },
            ]
          : [{ type: "Institution", id: "LIST" }],
    }),

    getInstitution: builder.query<Institution, number>({
      query: (id) => `/institutions/${id}`,
      providesTags: (result, error, id) => [{ type: "Institution", id }],
    }),

    createInstitution: builder.mutation<Institution, CreateInstitutionRequest>({
      query: (institutionData) => ({
        url: "/institutions",
        method: "POST",
        body: institutionData,
      }),
      invalidatesTags: [{ type: "Institution", id: "LIST" }],
    }),

    updateInstitution: builder.mutation<
      Institution,
      { id: number; data: UpdateInstitutionRequest }
    >({
      query: ({ id, data }) => ({
        url: `/institutions/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Institution", id },
        { type: "Institution", id: "LIST" },
      ],
    }),

    deleteInstitution: builder.mutation<void, number>({
      query: (id) => ({
        url: `/institutions/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Institution", id: "LIST" }],
    }),

    getTopInstitutions: builder.query<Institution[], { limit?: number }>({
      query: ({ limit = 10 }) => ({
        url: "/institutions/top",
        params: { limit },
      }),
      providesTags: [{ type: "Institution", id: "TOP" }],
    }),

    searchInstitutions: builder.query<
      { data: Institution[]; total: number },
      { query: string; page?: number; limit?: number }
    >({
      query: ({ query, page = 1, limit = 10 }) => ({
        url: "/institutions/search",
        params: { q: query, page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Institution" as const,
                id,
              })),
              { type: "Institution", id: "SEARCH" },
            ]
          : [{ type: "Institution", id: "SEARCH" }],
    }),
  }),
});

export const {
  useGetInstitutionsQuery,
  useGetInstitutionQuery,
  useCreateInstitutionMutation,
  useUpdateInstitutionMutation,
  useDeleteInstitutionMutation,
  useGetTopInstitutionsQuery,
  useSearchInstitutionsQuery,
} = institutionApi;
