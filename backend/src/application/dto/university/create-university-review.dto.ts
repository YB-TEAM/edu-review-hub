import {
  IsInt,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsString,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiProperty } from "@nestjs/swagger";

class ReviewScoreInputDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  criterionId: number;

  @ApiProperty({ example: 8 })
  @IsInt()
  @Min(1)
  @Max(10)
  score: number;
}

export class CreateUniversityReviewDto {
  @ApiProperty({ example: 1 })
  @IsInt()
  universityId: number;

  @ApiProperty({ example: "Trường rất tốt về cơ sở vật chất." })
  @IsString()
  content: string;

  @ApiProperty({ type: [ReviewScoreInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ReviewScoreInputDto)
  scores: ReviewScoreInputDto[];
}
