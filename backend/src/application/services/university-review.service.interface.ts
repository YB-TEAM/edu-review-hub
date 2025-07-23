import { CreateUniversityReviewDto } from "../dto/university/create-university-review.dto";
import { UpdateUniversityReviewDto } from "../dto/university/update-university-review.dto";
import { UniversityReviewResponseDto } from "../dto/university/university-review-response.dto";

export interface IUniversityReviewService {
  create(
    userId: number,
    dto: CreateUniversityReviewDto
  ): Promise<UniversityReviewResponseDto>;
  findById(id: number): Promise<UniversityReviewResponseDto>;
  findByUniversity(
    universityId: number
  ): Promise<UniversityReviewResponseDto[]>;
  findByUser(userId: number): Promise<UniversityReviewResponseDto[]>;
  update(
    userId: number,
    id: number,
    dto: UpdateUniversityReviewDto
  ): Promise<UniversityReviewResponseDto>;
  delete(userId: number, id: number): Promise<void>;
  moderate(id: number, status: string): Promise<UniversityReviewResponseDto>;
}
