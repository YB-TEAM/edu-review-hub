import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsInt, Min, IsOptional, IsString, IsNumber } from "class-validator";

export class BlogPublicQueryDto {
  @ApiProperty({ example: 1, required: true, description: "Current page (>=1)" })
  @Type(() => Number)
  @IsDefined()
  @IsInt()
  @Min(1)
  page: number;

  @ApiProperty({ example: 10, required: true, description: "Items per page (>=1)" })
  @Type(() => Number)
  @IsDefined()
  @IsInt()
  @Min(1)
  limit: number;

  @ApiProperty({ required: false, description: "Filter by author ID" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  authorId?: number;

  @ApiProperty({ required: false, description: "Filter by tag IDs (comma separated)" })
  @IsOptional()
  @IsString()
  tagIds?: string;

  @ApiProperty({ required: false, description: "Search in title, content, and excerpt" })
  @IsOptional()
  @IsString()
  search?: string;
}


