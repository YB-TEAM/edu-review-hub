import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString } from "class-validator";
import { ReviewStatus } from "../../../infrastructure/database/entities/university-review.entity";

export class ModerateUniversityReviewDto {
  @ApiProperty({
    enum: ReviewStatus,
    example: ReviewStatus.APPROVED,
    description: "New review status",
  })
  @IsEnum(ReviewStatus)
  status: ReviewStatus;

  @ApiProperty({
    example: "Review approved after moderation",
    required: false,
    description: "Admin notes about the moderation",
  })
  @IsOptional()
  @IsString()
  admin_notes?: string;
}
