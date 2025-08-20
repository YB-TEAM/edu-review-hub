import {
  IsInt,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsString,
  IsOptional,
  IsBoolean,
  IsEnum,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";
import { ReviewType } from "../../../infrastructure/database/entities/university-review.entity";

class ReviewScoreInputDto {
  @ApiProperty({
    example: 1,
    description: "Review criterion ID",
  })
  @IsInt()
  criterionId: number;

  @ApiProperty({
    example: 8,
    description: "Score from 1-10",
    minimum: 1,
    maximum: 10,
  })
  @IsInt()
  @Min(1)
  @Max(10)
  score: number;
}

export class CreateUniversityReviewDto {
  @ApiProperty({
    example: 1,
    description: "University ID",
  })
  @IsInt()
  university_id: number;

  @ApiProperty({
    example: "Trường rất tốt về cơ sở vật chất và chất lượng giảng dạy.",
    description: "Review content",
  })
  @IsString()
  content: string;

  @ApiProperty({
    example: "Ưu điểm của trường là gì?",
    required: false,
    description: "Pros of the university",
  })
  @IsOptional()
  @IsString()
  pros?: string;

  @ApiProperty({
    example: "Nhược điểm cần cải thiện",
    required: false,
    description: "Cons of the university",
  })
  @IsOptional()
  @IsString()
  cons?: string;

  @ApiProperty({
    example: "Tôi khuyên bạn nên học tại trường này",
    required: false,
    description: "Recommendation",
  })
  @IsOptional()
  @IsString()
  recommendation?: string;

  @ApiProperty({
    example: 4.5,
    description: "Overall score from 1-5",
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  overall_score: number;

  @ApiProperty({
    example: ReviewType.STUDENT,
    enum: ReviewType,
    description: "Type of reviewer",
  })
  @IsEnum(ReviewType)
  review_type: ReviewType;

  @ApiProperty({
    example: "Công nghệ thông tin",
    required: false,
    description: "Study program",
  })
  @IsOptional()
  @IsString()
  study_program?: string;

  @ApiProperty({
    example: 3,
    required: false,
    description: "Current study year",
    minimum: 1,
    maximum: 6,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(6)
  study_year?: number;

  @ApiProperty({
    example: 2020,
    required: false,
    description: "Graduation year",
  })
  @IsOptional()
  @IsInt()
  @Min(1900)
  @Max(2030)
  graduation_year?: number;

  @ApiProperty({
    example: false,
    required: false,
    description: "Is anonymous review",
  })
  @IsOptional()
  @IsBoolean()
  is_anonymous?: boolean;

  @ApiProperty({
    type: [ReviewScoreInputDto],
    description: "Detailed scores for each criterion",
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewScoreInputDto)
  scores: ReviewScoreInputDto[];
}
