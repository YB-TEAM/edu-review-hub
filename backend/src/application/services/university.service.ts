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
      relations: [
        "reviews",
        "reviews.user",
        "reviews.scores",
        "reviews.scores.criterion",
      ],
    });

    if (!university) {
      throw new NotFoundException(`University with ID ${id} not found`);
    }

    // Increment view count
    university.view_count += 1;
    await this.universityRepository.save(university);

    return university;
  }

  async getUniversityBySlug(slug: string): Promise<University> {
    const university = await this.universityRepository.findOne({
      where: { short_name: slug },
      relations: [
        "reviews",
        "reviews.user",
        "reviews.scores",
        "reviews.scores.criterion",
      ],
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
  async searchUniversities(query: string): Promise<University[]> {
    return await this.universityRepository.find({
      where: [
        { name: Like(`%${query}%`) },
        { short_name: Like(`%${query}%`) },
        { english_name: Like(`%${query}%`) },
      ],
      order: { average_rating: "DESC" },
      take: 20,
    });
  }

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

  async getFeaturedUniversities(): Promise<University[]> {
    return await this.universityRepository.find({
      where: { is_featured: true, status: UniversityStatus.ACTIVE },
      order: { average_rating: "DESC" },
      take: 10,
    });
  }

  async getTopRatedUniversities(limit: number = 10): Promise<University[]> {
    return await this.universityRepository.find({
      where: { status: UniversityStatus.ACTIVE },
      order: { average_rating: "DESC" },
      take: limit,
    });
  }

  // University statistics
  async getUniversityStatistics(): Promise<any> {
    const [
      totalUniversities,
      activeUniversities,
      featuredUniversities,
      verifiedUniversities,
      averageRating,
      totalReviews,
    ] = await Promise.all([
      this.universityRepository.count(),
      this.universityRepository.count({
        where: { status: UniversityStatus.ACTIVE },
      }),
      this.universityRepository.count({ where: { is_featured: true } }),
      this.universityRepository.count({ where: { is_verified: true } }),
      this.universityRepository
        .createQueryBuilder("university")
        .select("AVG(university.average_rating)", "avg")
        .getRawOne(),
      this.reviewRepository.count({ where: { status: ReviewStatus.APPROVED } }),
    ]);

    return {
      totalUniversities,
      activeUniversities,
      featuredUniversities,
      verifiedUniversities,
      averageRating: parseFloat(averageRating?.avg || "0"),
      totalReviews,
      lastUpdated: new Date(),
    };
  }

  async getUniversityAnalytics(universityId: number): Promise<any> {
    const university = await this.getUniversityById(universityId);
    const reviews = await this.reviewRepository.find({
      where: { university_id: universityId, status: ReviewStatus.APPROVED },
    });

    const reviewStats = {
      totalReviews: reviews.length,
      averageRating: university.average_rating,
      ratingDistribution: this.calculateRatingDistribution(reviews),
      recentReviews: reviews.slice(0, 5),
      reviewGrowth: this.calculateReviewGrowth(reviews),
    };

    return {
      university,
      reviewStats,
      lastUpdated: new Date(),
    };
  }

  // University reviews
  async getUniversityReviews(
    universityId: number,
    filters?: any
  ): Promise<{ reviews: UniversityReview[]; total: number }> {
    const queryBuilder = this.reviewRepository.createQueryBuilder("review");

    queryBuilder
      .leftJoinAndSelect("review.user", "user")
      .leftJoinAndSelect("review.scores", "scores")
      .leftJoinAndSelect("scores.criterion", "criterion")
      .where("review.university_id = :universityId", { universityId });

    if (filters?.status) {
      queryBuilder.andWhere("review.status = :status", {
        status: filters.status,
      });
    } else {
      queryBuilder.andWhere("review.status = :status", {
        status: ReviewStatus.APPROVED,
      });
    }

    const page = filters?.page || 1;
    const limit = filters?.limit || 10;
    const offset = (page - 1) * limit;

    queryBuilder.orderBy("review.created_at", "DESC").skip(offset).take(limit);

    const [reviews, total] = await queryBuilder.getManyAndCount();

    return { reviews, total };
  }

  async createUniversityReview(reviewData: any): Promise<UniversityReview> {
    const review = this.reviewRepository.create(reviewData);
    const savedReview = await this.reviewRepository.save(review);

    // Update university statistics
    await this.updateUniversityReviewStats(reviewData.university_id);

    return Array.isArray(savedReview) ? savedReview[0] : savedReview;
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

  // University comparison
  async compareUniversities(universityIds: number[]): Promise<any> {
    const universities = await this.universityRepository.find({
      where: { id: In(universityIds) },
      relations: ["reviews"],
    });

    const comparison = universities.map((university) => ({
      id: university.id,
      name: university.name,
      short_name: university.short_name,
      type: university.type,
      location: university.location,
      average_rating: university.average_rating,
      review_count: university.review_count,
      student_count: university.student_count,
      faculty_count: university.faculty_count,
      acceptance_rate: university.acceptance_rate,
      tuition_fee_min: university.tuition_fee_min,
      tuition_fee_max: university.tuition_fee_max,
      specializations: university.specializations,
      facilities: university.facilities,
      achievements: university.achievements,
    }));

    return {
      universities: comparison,
      comparisonDate: new Date(),
    };
  }

  // University recommendations
  async getRecommendedUniversities(userId: number): Promise<University[]> {
    // Simple recommendation based on top-rated universities
    // In a real implementation, this would use ML algorithms
    return await this.universityRepository.find({
      where: { status: UniversityStatus.ACTIVE, is_verified: true },
      order: { average_rating: "DESC" },
      take: 10,
    });
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

  async uploadUniversityImage(id: number, imageFile: any): Promise<string> {
    // In a real implementation, this would upload to cloud storage
    const imageUrl = `https://example.com/uploads/universities/${id}/${imageFile.originalname}`;

    const university = await this.getUniversityById(id);
    university.logo_url = imageUrl;
    await this.universityRepository.save(university);

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

    switch (reportType) {
      case "overview":
        return this.generateOverviewReport(university, reviews);
      case "reviews":
        return this.generateReviewsReport(university, reviews);
      case "analytics":
        return this.generateAnalyticsReport(university, reviews);
      default:
        throw new BadRequestException(`Unknown report type: ${reportType}`);
    }
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
  private async updateUniversityReviewStats(
    universityId: number
  ): Promise<void> {
    const reviews = await this.reviewRepository.find({
      where: { university_id: universityId, status: ReviewStatus.APPROVED },
    });

    const totalReviews = reviews.length;
    const averageRating =
      totalReviews > 0
        ? reviews.reduce((sum, review) => sum + review.overall_score, 0) /
          totalReviews
        : 0;

    await this.universityRepository.update(universityId, {
      review_count: totalReviews,
      average_rating: averageRating,
      total_rating: reviews.reduce(
        (sum, review) => sum + review.overall_score,
        0
      ),
    });
  }

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
    const monthlyGrowth = {};
    reviews.forEach((review) => {
      const month = review.created_at.toISOString().slice(0, 7); // YYYY-MM
      monthlyGrowth[month] = (monthlyGrowth[month] || 0) + 1;
    });
    return monthlyGrowth;
  }

  private generateOverviewReport(
    university: University,
    reviews: UniversityReview[]
  ): any {
    return {
      type: "overview",
      university: {
        id: university.id,
        name: university.name,
        short_name: university.short_name,
      },
      statistics: {
        totalReviews: reviews.length,
        averageRating: university.average_rating,
        ratingDistribution: this.calculateRatingDistribution(reviews),
      },
      generatedAt: new Date(),
    };
  }

  private generateReviewsReport(
    university: University,
    reviews: UniversityReview[]
  ): any {
    return {
      type: "reviews",
      university: {
        id: university.id,
        name: university.name,
      },
      reviews: reviews.slice(0, 50).map((review) => ({
        id: review.id,
        content: review.content,
        overall_score: review.overall_score,
        review_type: review.review_type,
        created_at: review.created_at,
      })),
      generatedAt: new Date(),
    };
  }

  private generateAnalyticsReport(
    university: University,
    reviews: UniversityReview[]
  ): any {
    return {
      type: "analytics",
      university: {
        id: university.id,
        name: university.name,
      },
      analytics: {
        reviewGrowth: this.calculateReviewGrowth(reviews),
        reviewTypeDistribution: this.calculateReviewTypeDistribution(reviews),
        averageRatingTrend: this.calculateAverageRatingTrend(reviews),
      },
      generatedAt: new Date(),
    };
  }

  private calculateAverageRatingTrend(reviews: UniversityReview[]): any {
    const monthlyRatings = {};
    reviews.forEach((review) => {
      const month = review.created_at.toISOString().slice(0, 7);
      if (!monthlyRatings[month]) {
        monthlyRatings[month] = { total: 0, count: 0 };
      }
      monthlyRatings[month].total += review.overall_score;
      monthlyRatings[month].count += 1;
    });

    return Object.keys(monthlyRatings).map((month) => ({
      month,
      averageRating: monthlyRatings[month].total / monthlyRatings[month].count,
    }));
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
