import { UniversityReviewCriterion } from "@/infrastructure/database/entities/university-review-criterion.entity";

export interface IUniversityReviewCriterionRepository {
  create(
    criterion: Partial<UniversityReviewCriterion>
  ): Promise<UniversityReviewCriterion>;
  findById(id: number): Promise<UniversityReviewCriterion | null>;
  findAll(): Promise<UniversityReviewCriterion[]>;
  update(
    id: number,
    criterion: Partial<UniversityReviewCriterion>
  ): Promise<UniversityReviewCriterion>;
  delete(id: number): Promise<void>;
}
