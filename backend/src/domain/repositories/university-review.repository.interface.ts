import { UniversityReview } from "@/infrastructure/database/entities/university-review.entity";
import { UniversityReviewCriterion } from "@/infrastructure/database/entities/university-review-criterion.entity";

export interface IUniversityReviewRepository {
  create(review: Partial<UniversityReview>): Promise<UniversityReview>;
  findById(id: number): Promise<UniversityReview | null>;
  findByUniversity(universityId: number): Promise<UniversityReview[]>;
  findByUser(userId: number): Promise<UniversityReview[]>;
  update(
    id: number,
    review: Partial<UniversityReview>
  ): Promise<UniversityReview>;
  updateStatus(id: number, status: string): Promise<void>;
  delete(id: number): Promise<void>;
}
