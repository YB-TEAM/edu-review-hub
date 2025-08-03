import { University, UniversityType, UniversityStatus } from '../../infrastructure/database/entities/university.entity';
import { UniversityReview, ReviewStatus, ReviewType } from '../../infrastructure/database/entities/university-review.entity';

export interface IUniversityService {
  // University CRUD
  getAllUniversities(filters?: any): Promise<{ universities: University[]; total: number }>;
  getUniversityById(id: number): Promise<University>;
  getUniversityBySlug(slug: string): Promise<University>;
  createUniversity(universityData: any): Promise<University>;
  updateUniversity(id: number, universityData: any): Promise<University>;
  deleteUniversity(id: number): Promise<void>;
  
  // University search and filter
  searchUniversities(query: string): Promise<University[]>;
  getUniversitiesByType(type: UniversityType): Promise<University[]>;
  getUniversitiesByLocation(location: string): Promise<University[]>;
  getFeaturedUniversities(): Promise<University[]>;
  getTopRatedUniversities(limit?: number): Promise<University[]>;
  
  // University statistics
  getUniversityStatistics(): Promise<any>;
  getUniversityAnalytics(universityId: number): Promise<any>;
  
  // University reviews
  getUniversityReviews(universityId: number, filters?: any): Promise<{ reviews: UniversityReview[]; total: number }>;
  createUniversityReview(reviewData: any): Promise<UniversityReview>;
  updateUniversityReview(id: number, reviewData: any): Promise<UniversityReview>;
  deleteUniversityReview(id: number): Promise<void>;
  moderateReview(id: number, status: ReviewStatus, moderatorId: number): Promise<UniversityReview>;
  
  // Review statistics
  getReviewStatistics(universityId: number): Promise<any>;
  getReviewAnalytics(universityId: number): Promise<any>;
  
  // University comparison
  compareUniversities(universityIds: number[]): Promise<any>;
  
  // University recommendations
  getRecommendedUniversities(userId: number): Promise<University[]>;
  
  // University management (admin only)
  updateUniversityStatus(id: number, status: UniversityStatus): Promise<University>;
  featureUniversity(id: number, featured: boolean): Promise<University>;
  verifyUniversity(id: number, verified: boolean): Promise<University>;
  
  // University content management
  updateUniversityContent(id: number, contentData: any): Promise<University>;
  uploadUniversityImage(id: number, imageFile: any): Promise<string>;
  
  // University reporting
  generateUniversityReport(universityId: number, reportType: string): Promise<any>;
  getUniversityInsights(universityId: number): Promise<any>;
}
