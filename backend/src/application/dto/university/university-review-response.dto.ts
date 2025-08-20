import { ApiProperty } from "@nestjs/swagger";
import {
  ReviewStatus,
  ReviewType,
} from "../../../infrastructure/database/entities/university-review.entity";

export class UniversityReviewScoreResponseDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  criterionId: number;

  @ApiProperty()
  criterionName: string;

  @ApiProperty()
  score: number;
}

export class UniversityReviewResponseDto {
  @ApiProperty({ description: "Review ID", example: 1 })
  id: number;

  @ApiProperty({ description: "University ID", example: 1 })
  university_id: number;

  @ApiProperty({ description: "User ID", example: 1 })
  user_id: number;

  @ApiProperty({
    description: "Review content",
    example: "Trường rất tốt về cơ sở vật chất.",
  })
  content: string;

  @ApiProperty({
    description: "Pros of the university",
    example: "Ưu điểm của trường là gì?",
  })
  pros: string;

  @ApiProperty({
    description: "Cons of the university",
    example: "Nhược điểm cần cải thiện",
  })
  cons: string;

  @ApiProperty({
    description: "Recommendation",
    example: "Tôi khuyên bạn nên học tại trường này",
  })
  recommendation: string;

  @ApiProperty({ description: "Overall score", example: 4.5 })
  overall_score: number;

  @ApiProperty({
    description: "Review status",
    enum: ReviewStatus,
    example: ReviewStatus.APPROVED,
  })
  status: ReviewStatus;

  @ApiProperty({
    description: "Review type",
    enum: ReviewType,
    example: ReviewType.STUDENT,
  })
  review_type: ReviewType;

  @ApiProperty({ description: "Study program", example: "Công nghệ thông tin" })
  study_program: string;

  @ApiProperty({ description: "Study year", example: 3 })
  study_year: number;

  @ApiProperty({ description: "Graduation year", example: 2020 })
  graduation_year: number;

  @ApiProperty({ description: "Is anonymous review", example: false })
  is_anonymous: boolean;

  @ApiProperty({ description: "Is verified review", example: false })
  is_verified: boolean;

  @ApiProperty({ description: "Is helpful review", example: false })
  is_helpful: boolean;

  @ApiProperty({ description: "Helpful count", example: 5 })
  helpful_count: number;

  @ApiProperty({ description: "Report count", example: 0 })
  report_count: number;

  @ApiProperty({ description: "Admin notes", example: "Review approved" })
  admin_notes: string;

  @ApiProperty({ description: "Moderator ID", example: 1 })
  moderator_id: number;

  @ApiProperty({
    description: "Moderated at",
    example: "2024-01-01T00:00:00.000Z",
  })
  moderated_at: Date;

  @ApiProperty({
    description: "Created date",
    example: "2024-01-01T00:00:00.000Z",
  })
  created_at: Date;

  @ApiProperty({
    description: "Updated date",
    example: "2024-01-01T00:00:00.000Z",
  })
  updated_at: Date;

  @ApiProperty({ description: "Deleted date", example: null })
  deleted_at: Date;
}
