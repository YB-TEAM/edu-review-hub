// Institution/University Types
export interface Institution {
  id: number;
  name: string;
  description?: string;
  location: string[];
  logoUrl?: string;
  website?: string;
  establishedYear?: number;
  studentCount?: number;
  programs?: string[];
  averageRating?: number;
  reviewsCount?: number;
  coursesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionDetail extends Institution {
  reviews: InstitutionReview[];
  courses: Course[];
  statistics: {
    totalStudents: number;
    totalCourses: number;
    totalReviews: number;
    averageRating: number;
    ratingDistribution: {
      fiveStar: number;
      fourStar: number;
      threeStar: number;
      twoStar: number;
      oneStar: number;
    };
  };
}

export interface CreateInstitutionRequest {
  name: string;
  description?: string;
  location: string[];
  logoUrl?: string;
  website?: string;
  establishedYear?: number;
  studentCount?: number;
  programs?: string[];
}

export interface UpdateInstitutionRequest {
  name?: string;
  description?: string;
  location?: string[];
  logoUrl?: string;
  website?: string;
  establishedYear?: number;
  studentCount?: number;
  programs?: string[];
}

export interface InstitutionFilters {
  search?: string;
  location?: string[];
  establishedYear?: {
    min?: number;
    max?: number;
  };
  studentCount?: {
    min?: number;
    max?: number;
  };
  averageRating?: {
    min?: number;
    max?: number;
  };
  programs?: string[];
  page?: number;
  limit?: number;
  sortBy?:
    | "name"
    | "createdAt"
    | "averageRating"
    | "reviewsCount"
    | "studentCount";
  sortOrder?: "asc" | "desc";
}

export interface InstitutionReview {
  id: number;
  content: string;
  overallRating: number;
  criteriaRatings: {
    [criterionId: number]: number;
  };
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    username: string;
    avatarUrl?: string;
  };
}

export interface Course {
  id: number;
  name: string;
  description?: string;
  duration?: string;
  level?: "beginner" | "intermediate" | "advanced";
  price?: number;
  currency?: string;
  instructor?: string;
  createdAt: string;
  updatedAt: string;
}
