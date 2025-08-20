import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from "@nestjs/common";
import { IUniversityReviewService } from "./university-review.service.interface";
import { IUniversityReviewRepository } from "@/domain/repositories/university-review.repository.interface";
import { IUniversityReviewCriterionRepository } from "@/domain/repositories/university-review-criterion.repository.interface";
import { CreateUniversityReviewDto } from "../dto/university/create-university-review.dto";
import { UpdateUniversityReviewDto } from "../dto/university/update-university-review.dto";
import { UniversityReviewResponseDto } from "../dto/university/university-review-response.dto";
import {
  UniversityReview,
  ReviewStatus,
} from "@/infrastructure/database/entities/university-review.entity";
import { UniversityReviewScore } from "@/infrastructure/database/entities/university-review-score.entity";
import { UniversityReviewCriterion } from "@/infrastructure/database/entities/university-review-criterion.entity";

@Injectable()
export class UniversityReviewService implements IUniversityReviewService {
  constructor(
    @Inject("IUniversityReviewRepository")
    private readonly reviewRepo: IUniversityReviewRepository,
    @Inject("IUniversityReviewCriterionRepository")
    private readonly criterionRepo: IUniversityReviewCriterionRepository
  ) {}

  private toResponseDto(review: UniversityReview): UniversityReviewResponseDto {
    return {
      id: review.id,
      university_id: review.university.id,
      user_id: review.user.id,
      content: review.content,
      pros: review.pros,
      cons: review.cons,
      recommendation: review.recommendation,
      overall_score: review.overall_score,
      status: review.status,
      review_type: review.review_type,
      study_program: review.study_program,
      study_year: review.study_year,
      graduation_year: review.graduation_year,
      is_anonymous: review.is_anonymous,
      is_verified: review.is_verified,
      is_helpful: review.is_helpful,
      helpful_count: review.helpful_count,
      report_count: review.report_count,
      admin_notes: review.admin_notes,
      moderator_id: review.moderator_id,
      moderated_at: review.moderated_at,
      created_at: review.created_at,
      updated_at: review.updated_at,
      deleted_at: review.deleted_at,
    };
  }

  async create(
    userId: number,
    dto: CreateUniversityReviewDto
  ): Promise<UniversityReviewResponseDto> {
    // Lấy danh sách tiêu chí hiện tại
    const criteria = await this.criterionRepo.findAll();
    if (criteria.length === 0)
      throw new NotFoundException("No review criteria found");
    // Validate đủ tiêu chí
    if (dto.scores.length !== criteria.length)
      throw new ForbiddenException("Must rate all criteria");
    // Map điểm vào đúng criterion
    const scores = criteria.map((criterion) => {
      const input = dto.scores.find((s) => s.criterionId === criterion.id);
      if (!input)
        throw new ForbiddenException(
          `Missing score for criterion ${criterion.name}`
        );
      const score = new UniversityReviewScore();
      score.criterion = criterion;
      score.score = input.score;
      return score;
    });
    const overall_score =
      scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    const review = await this.reviewRepo.create({
      university: { id: dto.university_id } as any,
      user: { id: userId } as any,
      content: dto.content,
      pros: dto.pros,
      cons: dto.cons,
      recommendation: dto.recommendation,
      overall_score,
      status: ReviewStatus.PENDING,
      review_type: dto.review_type,
      study_program: dto.study_program,
      study_year: dto.study_year,
      graduation_year: dto.graduation_year,
      is_anonymous: dto.is_anonymous,
      created_at: new Date(),
      updated_at: new Date(),
      scores,
    });
    return this.toResponseDto(review);
  }

  async findById(id: number): Promise<UniversityReviewResponseDto> {
    const review = await this.reviewRepo.findById(id);
    if (!review) throw new NotFoundException("Review not found");
    return this.toResponseDto(review);
  }

  async findByUniversity(
    universityId: number
  ): Promise<UniversityReviewResponseDto[]> {
    const reviews = await this.reviewRepo.findByUniversity(universityId);
    return reviews.map(this.toResponseDto);
  }

  async findByUser(userId: number): Promise<UniversityReviewResponseDto[]> {
    const reviews = await this.reviewRepo.findByUser(userId);
    return reviews.map(this.toResponseDto);
  }

  async update(
    userId: number,
    id: number,
    dto: UpdateUniversityReviewDto
  ): Promise<UniversityReviewResponseDto> {
    const review = await this.reviewRepo.findById(id);
    if (!review) throw new NotFoundException("Review not found");
    if (review.user.id !== userId)
      throw new ForbiddenException("Not your review");
    let scores = review.scores;
    if (dto.scores && dto.scores.length > 0) {
      const criteria = await this.criterionRepo.findAll();
      if (dto.scores.length !== criteria.length)
        throw new ForbiddenException("Must rate all criteria");
      scores = criteria.map((criterion) => {
        const input = dto.scores.find((s) => s.criterionId === criterion.id);
        if (!input)
          throw new ForbiddenException(
            `Missing score for criterion ${criterion.name}`
          );
        const score = new UniversityReviewScore();
        score.criterion = criterion;
        score.score = input.score;
        return score;
      });
    }
    const overall_score =
      scores.reduce((sum, s) => sum + s.score, 0) / scores.length;
    const updated = await this.reviewRepo.update(id, {
      ...dto,
      overall_score,
      updated_at: new Date(),
      scores,
    });
    return this.toResponseDto(updated);
  }

  async delete(userId: number, id: number): Promise<void> {
    const review = await this.reviewRepo.findById(id);
    if (!review) throw new NotFoundException("Review not found");
    if (review.user.id !== userId)
      throw new ForbiddenException("Not your review");
    await this.reviewRepo.delete(id);
  }

  async moderate(
    id: number,
    status: string
  ): Promise<UniversityReviewResponseDto> {
    const review = await this.reviewRepo.findById(id);
    if (!review) throw new NotFoundException("Review not found");
    await this.reviewRepo.updateStatus(id, status);
    const updated = await this.reviewRepo.findById(id);
    return this.toResponseDto(updated!);
  }
}
