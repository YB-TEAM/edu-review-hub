import { UniversityReviewCriterion } from "@/infrastructure/database/entities/university-review-criterion.entity";

export interface IUniversityReviewCriterionService {
  create(
    name: string,
    description?: string
  ): Promise<UniversityReviewCriterion>;
  findById(id: number): Promise<UniversityReviewCriterion | null>;
  findAll(): Promise<UniversityReviewCriterion[]>;
  update(
    id: number,
    name: string,
    description?: string
  ): Promise<UniversityReviewCriterion>;
  delete(id: number): Promise<void>;
}
