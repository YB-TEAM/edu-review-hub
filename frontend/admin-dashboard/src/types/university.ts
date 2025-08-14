// University status enum
export enum UniversityStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  SUSPENDED = 'suspended',
  BANNED = 'banned',
}

// University type enum
export enum UniversityType {
  PUBLIC = 'public',
  PRIVATE = 'private',
  INTERNATIONAL = 'international',
  COMMUNITY = 'community',
}

// University level enum
export enum UniversityLevel {
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate',
  BOTH = 'both',
}

// University ranking enum
export enum UniversityRanking {
  TOP_10 = 'top_10',
  TOP_25 = 'top_25',
  TOP_50 = 'top_50',
  TOP_100 = 'top_100',
  TOP_200 = 'top_200',
  TOP_500 = 'top_500',
  UNRANKED = 'unranked',
}

// University location interface
export interface UniversityLocation {
  country: string;
  state?: string;
  city: string;
  address: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  timezone?: string;
}

// University contact interface
export interface UniversityContact {
  phone?: string;
  email?: string;
  website?: string;
  fax?: string;
  emergencyContact?: string;
}

// University social media interface
export interface UniversitySocialMedia {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
}

// University academic info interface
export interface UniversityAcademicInfo {
  foundedYear?: number;
  accreditation?: string[];
  academicCalendar?: string;
  studentFacultyRatio?: number;
  averageClassSize?: number;
  graduationRate?: number;
  retentionRate?: number;
}

// University financial info interface
export interface UniversityFinancialInfo {
  tuitionInState?: number;
  tuitionOutState?: number;
  tuitionInternational?: number;
  roomAndBoard?: number;
  booksAndSupplies?: number;
  otherExpenses?: number;
  financialAidAvailable?: boolean;
  averageFinancialAid?: number;
}

// University admission info interface
export interface UniversityAdmissionInfo {
  acceptanceRate?: number;
  satRange?: { min: number; max: number };
  actRange?: { min: number; max: number };
  gpaRequirement?: number;
  applicationDeadline?: string;
  earlyDecisionDeadline?: string;
  transferAcceptanceRate?: number;
}

// University program interface
export interface UniversityProgram {
  id: number;
  name: string;
  level: UniversityLevel;
  duration: number; // in years
  degree: string;
  department: string;
  accreditation?: string;
  isActive: boolean;
}

// University image interface
export interface UniversityImage {
  id: number;
  url: string;
  alt: string;
  caption?: string;
  isPrimary: boolean;
  order: number;
  createdAt: string;
}

// University review interface
export interface UniversityReview {
  id: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
  isVerified: boolean;
  isHelpful: number;
  isNotHelpful: number;
  createdAt: string;
  updatedAt: string;
}

// University response interface matching backend UniversityResponseDto
export interface UniversityResponse {
  id: number;
  name: string;
  slug: string;
  shortName?: string;
  description: string;
  longDescription?: string;
  status: UniversityStatus;
  type: UniversityType;
  level: UniversityLevel;
  ranking?: UniversityRanking;
  isFeatured: boolean;
  isVerified: boolean;
  logo?: string;
  coverImage?: string;
  location: UniversityLocation;
  contact: UniversityContact;
  socialMedia: UniversitySocialMedia;
  academicInfo: UniversityAcademicInfo;
  financialInfo: UniversityFinancialInfo;
  admissionInfo: UniversityAdmissionInfo;
  programs: UniversityProgram[];
  images: UniversityImage[];
  reviews: UniversityReview[];
  averageRating: number;
  totalReviews: number;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

// University list response with pagination
export interface UniversityListResponse {
  universities: UniversityResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Create university request matching backend CreateUniversityDto
export interface CreateUniversityRequest {
  name: string;
  shortName?: string;
  description: string;
  longDescription?: string;
  type: UniversityType;
  level: UniversityLevel;
  ranking?: UniversityRanking;
  foundedYear?: number;
  country: string;
  state?: string;
  city: string;
  address: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  tuitionInState?: number;
  tuitionOutState?: number;
  tuitionInternational?: number;
  acceptanceRate?: number;
  logo?: string;
  coverImage?: string;
}

// Update university request matching backend UpdateUniversityDto
export interface UpdateUniversityRequest {
  name?: string;
  shortName?: string;
  description?: string;
  longDescription?: string;
  type?: UniversityType;
  level?: UniversityLevel;
  ranking?: UniversityRanking;
  foundedYear?: number;
  country?: string;
  state?: string;
  city?: string;
  address?: string;
  postalCode?: string;
  phone?: string;
  email?: string;
  website?: string;
  tuitionInState?: number;
  tuitionOutState?: number;
  tuitionInternational?: number;
  acceptanceRate?: number;
  logo?: string;
  coverImage?: string;
}

// University query parameters
export interface UniversityQueryParams {
  page?: number;
  limit?: number;
  status?: UniversityStatus;
  type?: UniversityType;
  level?: UniversityLevel;
  ranking?: UniversityRanking;
  country?: string;
  state?: string;
  city?: string;
  search?: string;
  sortBy?: 'name' | 'ranking' | 'foundedYear' | 'averageRating' | 'totalReviews' | 'viewCount' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  minTuition?: number;
  maxTuition?: number;
  minAcceptanceRate?: number;
  maxAcceptanceRate?: number;
  featured?: boolean;
  verified?: boolean;
}

// University review request matching backend CreateUniversityReviewDto
export interface CreateUniversityReviewRequest {
  rating: number;
  title: string;
  content: string;
  pros: string[];
  cons: string[];
}

// Update university review request matching backend UpdateUniversityReviewDto
export interface UpdateUniversityReviewRequest {
  rating?: number;
  title?: string;
  content?: string;
  pros?: string[];
  cons?: string[];
}

// Moderate university review request matching backend ModerateUniversityReviewDto
export interface ModerateUniversityReviewRequest {
  action: 'approve' | 'reject' | 'ban';
  reason?: string;
  notes?: string;
  moderatedBy: number;
  moderatedAt: string;
}

// University statistics
export interface UniversityStatistics {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
  banned: number;
  featured: number;
  verified: number;
  totalReviews: number;
  totalViews: number;
  averageRating: number;
}

// University analytics
export interface UniversityAnalytics {
  viewsByDate: Array<{ date: string; count: number }>;
  reviewsByDate: Array<{ date: string; count: number }>;
  topUniversities: UniversityResponse[];
  countryDistribution: Array<{ country: string; count: number }>;
  typeDistribution: Array<{ type: UniversityType; count: number }>;
  levelDistribution: Array<{ level: UniversityLevel; count: number }>;
  ratingDistribution: Array<{ rating: number; count: number }>;
}

// University comparison request
export interface UniversityComparisonRequest {
  universityIds: number[];
  criteria: string[];
}

// University comparison response
export interface UniversityComparisonResponse {
  universities: UniversityResponse[];
  comparison: {
    [criterion: string]: {
      [universityId: number]: any;
    };
  };
}
