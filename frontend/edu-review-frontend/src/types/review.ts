export interface Review {
  id: number;
  user_id: number;
  course_id: number;
  institution_id: number;
  rating: number;
  content: string;
  pros?: string;
  cons?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
  };
  course?: {
    id: number;
    name: string;
  };
  institution?: {
    id: number;
    name: string;
  };
}

export interface CreateReviewRequest {
  course_id: number;
  institution_id: number;
  rating: number;
  content: string;
  pros?: string;
  cons?: string;
}

export interface UpdateReviewRequest {
  rating?: number;
  content?: string;
  pros?: string;
  cons?: string;
}

export interface ReviewFilters {
  course_id?: number;
  institution_id?: number;
  rating?: number;
  user_id?: number;
  page?: number;
  limit?: number;
  sort_by?: "created_at" | "rating" | "updated_at";
  sort_order?: "asc" | "desc";
}

export interface ReviewListResponse {
  data: Review[];
  total: number;
  current_page: number;
  last_page: number;
}

export interface UserReviewsResponse {
  data: Review[];
  total: number;
}
