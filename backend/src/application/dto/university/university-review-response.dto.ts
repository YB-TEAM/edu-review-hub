import { ApiProperty } from "@nestjs/swagger";

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
  @ApiProperty()
  id: number;

  @ApiProperty()
  universityId: number;

  @ApiProperty()
  userId: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  overall_score: number;

  @ApiProperty()
  status: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  updated_at: Date;

  @ApiProperty({ type: [UniversityReviewScoreResponseDto] })
  scores: UniversityReviewScoreResponseDto[];
}
