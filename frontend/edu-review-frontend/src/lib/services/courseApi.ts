import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandling } from "../api";
import type {
  Course,
  CreateCourseRequest,
  UpdateCourseRequest,
  CourseFilters,
  CourseListResponse,
  InstitutionCoursesResponse,
} from "@/types/course";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: baseQueryWithErrorHandling,
  tagTypes: ["Course"],
  endpoints: (builder) => ({
    getCourses: builder.query<CourseListResponse, CourseFilters>({
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
      InstitutionCoursesResponse,
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
