import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  UniversityReview,
  ReviewStatus,
} from "../entities/university-review.entity";
import { IUniversityReviewRepository } from "@/domain/repositories/university-review.repository.interface";

@Injectable()
export class UniversityReviewRepository implements IUniversityReviewRepository {
  constructor(
    @InjectRepository(UniversityReview)
    private readonly repo: Repository<UniversityReview>
  ) {}

  async create(review: Partial<UniversityReview>): Promise<UniversityReview> {
    return this.repo.save(review);
  }

  async findById(id: number): Promise<UniversityReview | null> {
    return this.repo.findOne({
      where: { id },
      relations: ["user", "university", "scores", "scores.criterion"],
    });
  }

  async findByUniversity(universityId: number): Promise<UniversityReview[]> {
    return this.repo.find({
      where: { university: { id: universityId } },
      relations: ["user", "university", "scores", "scores.criterion"],
    });
  }

  async findByUser(userId: number): Promise<UniversityReview[]> {
    return this.repo.find({
      where: { user: { id: userId } },
      relations: ["user", "university", "scores", "scores.criterion"],
    });
  }

  async update(
    id: number,
    review: Partial<UniversityReview>
  ): Promise<UniversityReview> {
    await this.repo.update(id, review);
    return this.findById(id) as Promise<UniversityReview>;
  }

  async updateStatus(id: number, status: ReviewStatus): Promise<void> {
    await this.repo.update(id, { status });
  }

  async delete(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }
}
