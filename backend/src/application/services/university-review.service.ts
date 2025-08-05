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
      universityId: review.university.id,
      userId: review.user.id,
      content: review.content,
      overall_score: review.overall_score,
      status: review.status,
      created_at: review.created_at,
      updated_at: review.updated_at,
      scores: (review.scores || []).map((s) => ({
        id: s.id,
        criterionId: s.criterion.id,
        criterionName: s.criterion.name,
        score: s.score,
      })),
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
      university: { id: dto.universityId } as any,
      user: { id: userId } as any,
      content: dto.content,
      overall_score,
      status: ReviewStatus.PENDING,
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
