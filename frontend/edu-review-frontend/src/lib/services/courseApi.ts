import { api } from "../api";

export interface Course {
  id: number;
  name: string;
  description?: string;
  code?: string;
  duration?: string;
  level?: "beginner" | "intermediate" | "advanced";
  category?: string;
  created_at: string;
  updated_at: string;
  institution?: {
    id: number;
    name: string;
  };
  reviews_count?: number;
  average_rating?: number;
}

export interface CreateCourseRequest {
  name: string;
  description?: string;
  code?: string;
  duration?: string;
  level?: "beginner" | "intermediate" | "advanced";
  category?: string;
  institution_id: number;
}

export interface UpdateCourseRequest {
  name?: string;
  description?: string;
  code?: string;
  duration?: string;
  level?: "beginner" | "intermediate" | "advanced";
  category?: string;
}

export interface CourseFilters {
  institution_id?: number;
  category?: string;
  level?: "beginner" | "intermediate" | "advanced";
  search?: string;
  page?: number;
  limit?: number;
  sort_by?: "name" | "created_at" | "average_rating";
  sort_order?: "asc" | "desc";
}

export const courseApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getCourses: builder.query<
      {
        data: Course[];
        total: number;
        current_page: number;
        last_page: number;
      },
      CourseFilters
    >({
      query: (filters) => ({
        url: "/courses",
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Course" as const, id })),
              { type: "Course", id: "LIST" },
            ]
          : [{ type: "Course", id: "LIST" }],
    }),

    getCourse: builder.query<Course, number>({
      query: (id) => `/courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Course", id }],
    }),

    createCourse: builder.mutation<Course, CreateCourseRequest>({
      query: (courseData) => ({
        url: "/courses",
        method: "POST",
        body: courseData,
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),

    updateCourse: builder.mutation<
      Course,
      { id: number; data: UpdateCourseRequest }
    >({
      query: ({ id, data }) => ({
        url: `/courses/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Course", id },
        { type: "Course", id: "LIST" },
      ],
    }),

    deleteCourse: builder.mutation<void, number>({
      query: (id) => ({
        url: `/courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "Course", id: "LIST" }],
    }),

    getInstitutionCourses: builder.query<
      { data: Course[]; total: number },
      { institution_id: number; page?: number; limit?: number }
    >({
      query: ({ institution_id, page = 1, limit = 10 }) => ({
        url: `/institutions/${institution_id}/courses`,
        params: { page, limit },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Course" as const, id })),
              { type: "Course", id: "INSTITUTION_LIST" },
            ]
          : [{ type: "Course", id: "INSTITUTION_LIST" }],
    }),

    getCourseCategories: builder.query<string[], void>({
      query: () => "/courses/categories",
      providesTags: [{ type: "Course", id: "CATEGORIES" }],
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetInstitutionCoursesQuery,
  useGetCourseCategoriesQuery,
} = courseApi;
