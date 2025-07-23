import {
  IsArray,
  ValidateNested,
  IsOptional,
  Min,
  Max,
  IsInt,
} from "class-validator";
import { Type } from "class-transformer";
import { ApiPropertyOptional } from "@nestjs/swagger";

class UpdateReviewScoreInputDto {
  @ApiPropertyOptional({ example: 1 })
  @IsInt()
  criterionId: number;

  @ApiPropertyOptional({ example: 8 })
  @IsInt()
  @Min(1)
  @Max(10)
  score: number;
}

export class UpdateUniversityReviewDto {
  @ApiPropertyOptional({ example: "Trường rất tốt về cơ sở vật chất." })
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ type: [UpdateReviewScoreInputDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateReviewScoreInputDto)
  scores?: UpdateReviewScoreInputDto[];
}
