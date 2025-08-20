import { PartialType } from "@nestjs/swagger";
import { CreateUniversityReviewDto } from "./create-university-review.dto";

export class UpdateUniversityReviewDto extends PartialType(
  CreateUniversityReviewDto
) {}
