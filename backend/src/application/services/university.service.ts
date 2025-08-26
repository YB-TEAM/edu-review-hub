import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, Like, In } from "typeorm";
import {
  University,
  UniversityType,
  UniversityStatus,
} from "../../infrastructure/database/entities/university.entity";
import {
  UniversityReview,
  ReviewStatus,
  ReviewType,
} from "../../infrastructure/database/entities/university-review.entity";
import { UniversityReviewCriterion } from "../../infrastructure/database/entities/university-review-criterion.entity";
import { IUniversityService } from "./university.service.interface";

@Injectable()
export class UniversityService implements IUniversityService {
  constructor(
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,
    @InjectRepository(UniversityReview)
    private readonly reviewRepository: Repository<UniversityReview>,
    @InjectRepository(UniversityReviewCriterion)
    private readonly criterionRepository: Repository<UniversityReviewCriterion>
  ) {}

  // University CRUD
  async getAllUniversities(
    filters: {
      page?: number;
      limit?: number;
      type?: string;
      location?: string;
      search?: string;
      status?: string;
    } = {}
  ): Promise<{
    universities: University[];
    pagination: {
      currentPage: number;
      limit: number;
      totalItems: number;
      totalPages: number;
      itemsInCurrentPage: number;
      hasPreviousPage: boolean;
      hasNextPage: boolean;
      previousPage: number | null;
      nextPage: number | null;
    };
  }> {
    const queryBuilder =
      this.universityRepository.createQueryBuilder("university");

    if (filters?.type) {
      queryBuilder.andWhere("university.type = :type", { type: filters.type });
    }

    if (filters?.location) {
      queryBuilder.andWhere("university.location @> ARRAY[:location]", {
        location: filters.location,
      });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        "(university.name ILIKE :search OR university.short_name ILIKE :search OR university.english_name ILIKE :search)",
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.status) {
      queryBuilder.andWhere("university.status = :status", {
        status: filters.status,
      });
    }

    // Sử dụng giá trị mặc định từ PaginationDto
    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    queryBuilder
      .orderBy("university.is_featured", "DESC")
      .addOrderBy("university.average_rating", "DESC")
      .addOrderBy("university.name", "ASC")
      .skip(offset)
      .take(limit);

    const [universities, totalItems] = await queryBuilder.getManyAndCount();

    // Tính toán thông tin phân trang chi tiết
    const totalPages = Math.ceil(totalItems / limit);
    const itemsInCurrentPage = universities.length;
    const hasPreviousPage = page > 1;
    const hasNextPage = page < totalPages;
    const previousPage = hasPreviousPage ? page - 1 : null;
    const nextPage = hasNextPage ? page + 1 : null;

    return {
      universities,
      pagination: {
        currentPage: page,
        limit,
        totalItems,
        totalPages,
        itemsInCurrentPage,
        hasPreviousPage,
        hasNextPage,
        previousPage,
        nextPage,
      },
    };
  }

  async getUniversityById(id: number): Promise<University> {
    const university = await this.universityRepository.findOne({
      where: { id },
      relations: ["reviews"],
    });

    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }

    return university;
  }

  async getUniversityBySlug(slug: string): Promise<University> {
    const university = await this.universityRepository.findOne({
      where: { short_name: slug },
      relations: ["reviews"],
    });

    if (!university) {
      throw new NotFoundException(`University with slug ${slug} not found`);
    }

    return university;
  }

  async createUniversity(universityData: any): Promise<University> {
    const university = this.universityRepository.create(universityData);
    const savedUniversity = await this.universityRepository.save(university);
    return Array.isArray(savedUniversity)
      ? savedUniversity[0]
      : savedUniversity;
  }

  async updateUniversity(id: number, universityData: any): Promise<University> {
    const university = await this.getUniversityById(id);
    Object.assign(university, universityData);
    return await this.universityRepository.save(university);
  }

  async deleteUniversity(id: number): Promise<void> {
    const university = await this.getUniversityById(id);
    await this.universityRepository.remove(university);
  }

  // University search and filter
  async getUniversitiesByType(type: UniversityType): Promise<University[]> {
    return await this.universityRepository.find({
      where: { type, status: UniversityStatus.ACTIVE },
      order: { average_rating: "DESC" },
    });
  }

  async getUniversitiesByLocation(location: string): Promise<University[]> {
    return await this.universityRepository.find({
      where: { location: In([location]), status: UniversityStatus.ACTIVE },
      order: { average_rating: "DESC" },
    });
  }

  // University review management
  async createUniversityReview(reviewData: any): Promise<UniversityReview> {
    const review = this.reviewRepository.create(reviewData);
    const savedReview = await this.reviewRepository.save(review);

    // Update university statistics
    await this.updateUniversityReviewStats(reviewData.university_id);

    return Array.isArray(savedReview) ? savedReview[0] : savedReview;
  }

  async getUniversityReviews(
    universityId: number,
    filters?: any
  ): Promise<{ reviews: UniversityReview[]; total: number }> {
    const queryBuilder = this.reviewRepository
      .createQueryBuilder("review")
      .where("review.university_id = :universityId", { universityId });

    if (filters?.status) {
      queryBuilder.andWhere("review.status = :status", {
        status: filters.status,
      });
    }

    if (filters?.type) {
      queryBuilder.andWhere("review.review_type = :type", {
        type: filters.type,
      });
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    queryBuilder.orderBy("review.created_at", "DESC").skip(offset).take(limit);

    const [reviews, totalItems] = await queryBuilder.getManyAndCount();

    return {
      reviews,
      total: totalItems,
    };
  }

  async updateUniversityReview(
    id: number,
    reviewData: any
  ): Promise<UniversityReview> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    Object.assign(review, reviewData);
    const updatedReview = await this.reviewRepository.save(review);

    // Update university statistics
    await this.updateUniversityReviewStats(review.university_id);

    return updatedReview;
  }

  async deleteUniversityReview(id: number): Promise<void> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    await this.reviewRepository.remove(review);

    // Update university statistics
    await this.updateUniversityReviewStats(review.university_id);
  }

  async moderateReview(
    id: number,
    status: ReviewStatus,
    moderatorId: number
  ): Promise<UniversityReview> {
    const review = await this.reviewRepository.findOne({ where: { id } });
    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    review.status = status;
    review.moderator_id = moderatorId;
    review.moderated_at = new Date();

    const moderatedReview = await this.reviewRepository.save(review);

    // Update university statistics if review is approved
    if (status === ReviewStatus.APPROVED) {
      await this.updateUniversityReviewStats(review.university_id);
    }

    return moderatedReview;
  }

  // Review statistics
  async getReviewStatistics(universityId: number): Promise<any> {
    const reviews = await this.reviewRepository.find({
      where: { university_id: universityId, status: ReviewStatus.APPROVED },
    });

    const totalReviews = reviews.length;
    const averageRating =
      reviews.reduce((sum, review) => sum + review.overall_score, 0) /
        totalReviews || 0;

    const ratingDistribution = this.calculateRatingDistribution(reviews);
    const reviewTypes = this.calculateReviewTypeDistribution(reviews);

    return {
      totalReviews,
      averageRating,
      ratingDistribution,
      reviewTypes,
      lastUpdated: new Date(),
    };
  }

  async getReviewAnalytics(universityId: number): Promise<any> {
    const reviews = await this.reviewRepository.find({
      where: { university_id: universityId, status: ReviewStatus.APPROVED },
      relations: ["scores", "scores.criterion"],
    });

    const criteria = await this.criterionRepository.find({
      where: { is_active: true },
    });
    const criteriaAnalytics = criteria.map((criterion) => {
      const criterionScores = reviews
        .flatMap((review) => review.scores)
        .filter((score) => score.criterion.id === criterion.id);

      const averageScore =
        criterionScores.length > 0
          ? criterionScores.reduce((sum, score) => sum + score.score, 0) /
            criterionScores.length
          : 0;

      return {
        criterion: criterion.display_name,
        averageScore,
        totalReviews: criterionScores.length,
      };
    });

    return {
      criteriaAnalytics,
      totalReviews: reviews.length,
      lastUpdated: new Date(),
    };
  }

  // ===== ADDITIONAL METHODS FOR COMPLETE FUNCTIONALITY =====

  async getFeaturedUniversities(): Promise<University[]> {
    return await this.universityRepository.find({
      where: { is_featured: true, status: UniversityStatus.ACTIVE },
      order: { average_rating: "DESC", name: "ASC" },
      take: 10,
    });
  }

  async getTopRatedUniversities(limit: number = 10): Promise<University[]> {
    return await this.universityRepository.find({
      where: { status: UniversityStatus.ACTIVE },
      order: { average_rating: "DESC", review_count: "DESC" },
      take: limit,
    });
  }

  async searchUniversities(query: string): Promise<University[]> {
    return await this.universityRepository
      .createQueryBuilder("university")
      .where(
        "(university.name ILIKE :query OR university.short_name ILIKE :query OR university.english_name ILIKE :query OR university.description ILIKE :query)",
        { query: `%${query}%` }
      )
      .andWhere("university.status = :status", {
        status: UniversityStatus.ACTIVE,
      })
      .orderBy("university.is_featured", "DESC")
      .addOrderBy("university.average_rating", "DESC")
      .take(20)
      .getMany();
  }

  async getUniversityStatistics(): Promise<any> {
    const [
      totalUniversities,
      activeUniversities,
      featuredUniversities,
      verifiedUniversities,
    ] = await Promise.all([
      this.universityRepository.count(),
      this.universityRepository.count({
        where: { status: UniversityStatus.ACTIVE },
      }),
      this.universityRepository.count({ where: { is_featured: true } }),
      this.universityRepository.count({ where: { is_verified: true } }),
    ]);

    const averageRating = await this.universityRepository
      .createQueryBuilder("university")
      .select("AVG(university.average_rating)", "avgRating")
      .where("university.status = :status", { status: UniversityStatus.ACTIVE })
      .getRawOne();

    return {
      totalUniversities,
      activeUniversities,
      featuredUniversities,
      verifiedUniversities,
      averageRating: parseFloat(averageRating?.avgRating || "0"),
      lastUpdated: new Date(),
    };
  }

  async getUniversityAnalytics(universityId: number): Promise<any> {
    const university = await this.getUniversityById(universityId);
    const reviews = await this.reviewRepository.find({
      where: { university_id: universityId, status: ReviewStatus.APPROVED },
    });

    const monthlyViews = await this.getMonthlyViews(universityId);
    const monthlyReviews = await this.getMonthlyReviews(universityId);

    return {
      university: {
        id: university.id,
        name: university.name,
        viewCount: university.view_count,
        reviewCount: university.review_count,
        averageRating: university.average_rating,
      },
      analytics: {
        monthlyViews,
        monthlyReviews,
        ratingDistribution: this.calculateRatingDistribution(reviews),
        reviewTypeDistribution: this.calculateReviewTypeDistribution(reviews),
        topReviewers: await this.getTopReviewers(universityId),
      },
      lastUpdated: new Date(),
    };
  }

  async compareUniversities(universityIds: number[]): Promise<any> {
    if (universityIds.length < 2 || universityIds.length > 5) {
      throw new BadRequestException("Can only compare 2-5 universities");
    }

    const universities =
      await this.universityRepository.findByIds(universityIds);
    if (universities.length !== universityIds.length) {
      throw new NotFoundException("Some universities not found");
    }

    const comparison = {
      basicInfo: universities.map((u) => ({
        id: u.id,
        name: u.name,
        type: u.type,
        location: u.location,
        foundedYear: u.founded_year,
        studentCount: u.student_count,
        facultyCount: u.faculty_count,
      })),
      ratings: universities.map((u) => ({
        id: u.id,
        name: u.name,
        averageRating: u.average_rating,
        reviewCount: u.review_count,
        totalRating: u.total_rating,
      })),
      costs: universities.map((u) => ({
        id: u.id,
        name: u.name,
        tuitionFeeMin: u.tuition_fee_min,
        tuitionFeeMax: u.tuition_fee_max,
        currency: u.currency,
      })),
      features: universities.map((u) => ({
        id: u.id,
        name: u.name,
        isFeatured: u.is_featured,
        isVerified: u.is_verified,
        specializations: u.specializations,
        facilities: u.facilities,
      })),
    };

    return {
      universities,
      comparison,
      comparedAt: new Date(),
    };
  }

  async getRecommendedUniversities(userId: number): Promise<University[]> {
    // Mock implementation - in real app, this would use ML algorithms
    // to analyze user preferences and behavior
    return await this.universityRepository.find({
      where: { status: UniversityStatus.ACTIVE },
      order: { average_rating: "DESC", review_count: "DESC" },
      take: 10,
    });
  }

  async getUniversityRecommendations(userId: number): Promise<University[]> {
    // Mock implementation - in real app, this would use ML algorithms
    // to analyze user preferences and behavior
    return await this.universityRepository.find({
      where: { status: UniversityStatus.ACTIVE },
      order: { average_rating: "DESC", review_count: "DESC" },
      take: 10,
    });
  }

  async incrementViewCount(universityId: number): Promise<void> {
    await this.universityRepository.increment(
      { id: universityId },
      "view_count",
      1
    );
  }

  private async getMonthlyViews(universityId: number): Promise<any[]> {
    // Mock implementation - in real app, this would query view logs
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toISOString().slice(0, 7),
        views: Math.floor(Math.random() * 100) + 10,
      });
    }
    return months;
  }

  private async getMonthlyReviews(universityId: number): Promise<any[]> {
    // Mock implementation - in real app, this would query review creation dates
    const months = [];
    for (let i = 11; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      months.push({
        month: date.toISOString().slice(0, 7),
        reviews: Math.floor(Math.random() * 20) + 1,
      });
    }
    return months;
  }

  private async getTopReviewers(universityId: number): Promise<any[]> {
    // Mock implementation - in real app, this would query user activity
    return [
      { userId: 1, username: "student1", reviewCount: 5, averageRating: 4.2 },
      { userId: 2, username: "student2", reviewCount: 3, averageRating: 4.5 },
      { userId: 3, username: "student3", reviewCount: 2, averageRating: 4.0 },
    ];
  }

  // University management (admin only)
  async updateUniversityStatus(
    id: number,
    status: UniversityStatus
  ): Promise<University> {
    const university = await this.getUniversityById(id);
    university.status = status;
    return await this.universityRepository.save(university);
  }

  async featureUniversity(id: number, featured: boolean): Promise<University> {
    const university = await this.getUniversityById(id);
    university.is_featured = featured;
    return await this.universityRepository.save(university);
  }

  async verifyUniversity(id: number, verified: boolean): Promise<University> {
    const university = await this.getUniversityById(id);
    university.is_verified = verified;
    return await this.universityRepository.save(university);
  }

  // University content management
  async updateUniversityContent(
    id: number,
    contentData: any
  ): Promise<University> {
    const university = await this.getUniversityById(id);
    Object.assign(university, contentData);
    return await this.universityRepository.save(university);
  }

  // Method này đã được thay thế bằng UniversityImageService
  // Giữ lại để tương thích ngược
  async uploadUniversityImage(id: number, imageFile: any): Promise<string> {
    console.warn(
      "uploadUniversityImage is deprecated. Use UniversityImageService instead."
    );
    const imageUrl = `https://example.com/uploads/universities/${id}/${imageFile.originalname}`;
    return imageUrl;
  }

  // University reporting
  async generateUniversityReport(
    universityId: number,
    reportType: string
  ): Promise<any> {
    const university = await this.getUniversityById(universityId);
    const reviews = await this.reviewRepository.find({
      where: { university_id: universityId, status: ReviewStatus.APPROVED },
    });

    const report = {
      university: {
        id: university.id,
        name: university.name,
        type: university.type,
        location: university.location,
        foundedYear: university.founded_year,
        studentCount: university.student_count,
        facultyCount: university.faculty_count,
      },
      statistics: {
        totalReviews: reviews.length,
        averageRating: university.average_rating,
        viewCount: university.view_count,
        reviewCount: university.review_count,
      },
      reportType,
      generatedAt: new Date(),
    };

    return report;
  }

  async getUniversityInsights(universityId: number): Promise<any> {
    const university = await this.getUniversityById(universityId);
    const reviews = await this.reviewRepository.find({
      where: { university_id: universityId, status: ReviewStatus.APPROVED },
    });

    const insights = {
      strengths: this.identifyStrengths(reviews),
      weaknesses: this.identifyWeaknesses(reviews),
      recommendations: this.generateRecommendations(reviews),
      trends: this.analyzeTrends(reviews),
    };

    return {
      university,
      insights,
      lastUpdated: new Date(),
    };
  }

  // Private helper methods
  private calculateRatingDistribution(reviews: UniversityReview[]): any {
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    reviews.forEach((review) => {
      const rating = Math.round(review.overall_score);
      if (rating >= 1 && rating <= 5) {
        distribution[rating]++;
      }
    });
    return distribution;
  }

  private calculateReviewTypeDistribution(reviews: UniversityReview[]): any {
    const distribution = {};
    reviews.forEach((review) => {
      const type = review.review_type;
      distribution[type] = (distribution[type] || 0) + 1;
    });
    return distribution;
  }

  private calculateReviewGrowth(reviews: UniversityReview[]): any {
    const monthlyData = {};
    reviews.forEach((review) => {
      const month = review.created_at.toISOString().slice(0, 7);
      monthlyData[month] = (monthlyData[month] || 0) + 1;
    });
    return monthlyData;
  }

  private async updateUniversityReviewStats(
    universityId: number
  ): Promise<void> {
    const reviews = await this.reviewRepository.find({
      where: { university_id: universityId, status: ReviewStatus.APPROVED },
    });

    if (reviews.length === 0) return;

    const totalRating = reviews.reduce(
      (sum, review) => sum + review.overall_score,
      0
    );
    const averageRating = totalRating / reviews.length;

    await this.universityRepository.update(universityId, {
      review_count: reviews.length,
      average_rating: Math.round(averageRating * 100) / 100,
      total_rating: totalRating,
    });
  }

  private identifyStrengths(reviews: UniversityReview[]): string[] {
    // Mock implementation - in real app, this would analyze review content
    return [
      "Chất lượng giảng dạy tốt",
      "Cơ sở vật chất hiện đại",
      "Môi trường học tập thân thiện",
    ];
  }

  private identifyWeaknesses(reviews: UniversityReview[]): string[] {
    // Mock implementation
    return ["Chi phí học tập cao", "Ký túc xá cần cải thiện"];
  }

  private generateRecommendations(reviews: UniversityReview[]): string[] {
    // Mock implementation
    return [
      "Cải thiện cơ sở vật chất",
      "Mở rộng chương trình học bổng",
      "Tăng cường hoạt động ngoại khóa",
    ];
  }

  private analyzeTrends(reviews: UniversityReview[]): any {
    // Mock implementation
    return {
      ratingTrend: "increasing",
      reviewVolumeTrend: "stable",
      sentimentTrend: "positive",
    };
  }
}
