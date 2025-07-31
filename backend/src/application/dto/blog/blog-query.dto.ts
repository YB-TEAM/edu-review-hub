import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsInt,
  Min,
  IsOptional,
  IsEnum,
  IsString,
  IsNumber,
} from "class-validator";
import {
  BlogStatus,
  BlogCategory,
} from "@/infrastructure/database/entities/blog.entity";

export class BlogQueryDto {
  @ApiProperty({ example: 1, required: false, description: "Trang hiện tại" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    example: 10,
    required: false,
    description: "Số lượng mỗi trang",
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({
    required: false,
    description: "Filter by author ID",
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  authorId?: number;

  @ApiProperty({
    required: false,
    description: "Filter by tag IDs (comma separated)",
  })
  @IsOptional()
  @IsString()
  tagIds?: string;

  @ApiProperty({
    required: false,
    description: "Search in title, content, and excerpt",
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({
    required: false,
    enum: BlogStatus,
    description: "Filter by blog status",
  })
  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;

  @ApiProperty({
    required: false,
    enum: BlogCategory,
    description: "Filter by blog category",
  })
  @IsOptional()
  @IsEnum(BlogCategory)
  category?: BlogCategory;
}
