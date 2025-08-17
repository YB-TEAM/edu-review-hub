import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDefined, IsInt, Min, IsOptional, IsString, IsNumber, IsEnum, IsDateString } from "class-validator";

export enum SortField {
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
  TITLE = 'title',
  VIEW_COUNT = 'viewCount',
  LIKE_COUNT = 'likeCount',
  COMMENT_COUNT = 'commentCount',
  PUBLISHED_AT = 'publishedAt',
}

export enum SortOrder {
  ASC = 'ASC',
  DESC = 'DESC',
}

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

  // Sorting fields
  @ApiProperty({
    required: false,
    enum: SortField,
    description: "Field to sort by",
    default: SortField.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(SortField)
  sortBy?: SortField = SortField.CREATED_AT;

  @ApiProperty({
    required: false,
    enum: SortOrder,
    description: "Sort order",
    default: SortOrder.DESC,
  })
  @IsOptional()
  @IsEnum(SortOrder)
  sortOrder?: SortOrder = SortOrder.DESC;

  // Advanced filtering fields
  @ApiProperty({
    required: false,
    description: "Filter blogs created from this date (ISO string)",
  })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({
    required: false,
    description: "Filter blogs created until this date (ISO string)",
  })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiProperty({
    required: false,
    description: "Minimum view count",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minViews?: number;

  @ApiProperty({
    required: false,
    description: "Minimum like count",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minLikes?: number;

  @ApiProperty({
    required: false,
    description: "Minimum comment count",
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minComments?: number;
}


