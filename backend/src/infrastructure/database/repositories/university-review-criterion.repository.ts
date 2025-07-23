import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UniversityReviewCriterion } from "../entities/university-review-criterion.entity";
import { IUniversityReviewCriterionRepository } from "@/domain/repositories/university-review-criterion.repository.interface";

@Injectable()
export class UniversityReviewCriterionRepository
  implements IUniversityReviewCriterionRepository
{
  constructor(
    @InjectRepository(UniversityReviewCriterion)
    private readonly repo: Repository<UniversityReviewCriterion>
  ) {}

  async create(
    criterion: Partial<UniversityReviewCriterion>
  ): Promise<UniversityReviewCriterion> {
    return this.repo.save(criterion);
  }

  async findById(id: number): Promise<UniversityReviewCriterion | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findAll(): Promise<UniversityReviewCriterion[]> {
    return this.repo.find();
  }

  async update(
    id: number,
    criterion: Partial<UniversityReviewCriterion>
  ): Promise<UniversityReviewCriterion> {
    await this.repo.update(id, criterion);
    return this.findById(id) as Promise<UniversityReviewCriterion>;
  }

  async delete(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
