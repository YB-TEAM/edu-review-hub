import { Injectable, NotFoundException, Inject } from "@nestjs/common";
import { IUniversityReviewCriterionService } from "./university-review-criterion.service.interface";
import { IUniversityReviewCriterionRepository } from "@/domain/repositories/university-review-criterion.repository.interface";
import { UniversityReviewCriterion } from "@/infrastructure/database/entities/university-review-criterion.entity";

@Injectable()
export class UniversityReviewCriterionService
  implements IUniversityReviewCriterionService
{
  constructor(
    @Inject("IUniversityReviewCriterionRepository")
    private readonly repo: IUniversityReviewCriterionRepository
  ) {}

  async create(
    name: string,
    description?: string
  ): Promise<UniversityReviewCriterion> {
    return this.repo.create({ name, description });
  }

  async findById(id: number): Promise<UniversityReviewCriterion | null> {
    return this.repo.findById(id);
  }

  async findAll(): Promise<UniversityReviewCriterion[]> {
    return this.repo.findAll();
  }

  async update(
    id: number,
    name: string,
    description?: string
  ): Promise<UniversityReviewCriterion> {
    const criterion = await this.repo.findById(id);
    if (!criterion) throw new NotFoundException("Criterion not found");
    return this.repo.update(id, { name, description });
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
