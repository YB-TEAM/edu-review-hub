// Institution/University Types
export interface Institution {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  foundedYear?: number;
  type: "university" | "college" | "institute" | "school";
  accreditation?: string[];
  programs?: string[];
  averageRating: number;
  reviewsCount: number;
  studentsCount?: number;
  facultyCount?: number;
  acceptanceRate?: number;
  tuitionRange?: {
    min: number;
    max: number;
    currency: string;
  };
  status: "active" | "inactive" | "pending" | "suspended";
  createdAt: string;
  updatedAt: string;
}

export interface InstitutionDetail extends Institution {
  facilities?: string[];
  admissionRequirements?: string[];
  scholarships?: string[];
  internationalStudents?: {
    percentage: number;
    countries: string[];
  };
  rankings?: {
    national?: number;
    international?: number;
    subject?: Record<string, number>;
  };
  socialMedia?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    instagram?: string;
  };
  contactInfo?: {
    admissions?: string;
    international?: string;
    general?: string;
  };
}

export interface CreateInstitutionRequest {
  name: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  foundedYear?: number;
  type: "university" | "college" | "institute" | "school";
  accreditation?: string[];
  programs?: string[];
  facilities?: string[];
  admissionRequirements?: string[];
  scholarships?: string[];
}

export interface UpdateInstitutionRequest {
  name?: string;
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  foundedYear?: number;
  type?: "university" | "college" | "institute" | "school";
  accreditation?: string[];
  programs?: string[];
  facilities?: string[];
  admissionRequirements?: string[];
  scholarships?: string[];
}

export interface InstitutionFilters {
  search?: string;
  type?: "university" | "college" | "institute" | "school";
  country?: string;
  city?: string;
  programs?: string[];
  minRating?: number;
  maxRating?: number;
  page?: number;
  limit?: number;
  sort_by?: "name" | "rating" | "reviews_count" | "founded_year";
  sort_order?: "asc" | "desc";
}

export interface InstitutionListResponse {
  data: Institution[];
  total: number;
  current_page: number;
  last_page: number;
}

export interface InstitutionStats {
  totalInstitutions: number;
  totalStudents: number;
  averageRating: number;
  topPrograms: string[];
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
