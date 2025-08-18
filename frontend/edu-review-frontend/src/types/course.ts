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

export interface CourseListResponse {
  data: Course[];
  total: number;
  current_page: number;
  last_page: number;
}

export interface InstitutionCoursesResponse {
  data: Course[];
  total: number;
}
