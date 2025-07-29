import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsEnum, IsString, IsNumber } from "class-validator";
import { Type } from "class-transformer";
import {
  BlogStatus,
  BlogCategory,
} from "@/infrastructure/database/entities/blog.entity";

export class BlogFilterDto {
  @ApiProperty({
    enum: BlogStatus,
    required: false,
    description: "Filter by blog status",
  })
  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;

  @ApiProperty({
    enum: BlogCategory,
    required: false,
    description: "Filter by blog category",
  })
  @IsOptional()
  @IsEnum(BlogCategory)
  category?: BlogCategory;

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
    description: "Search in title, content, and excerpt",
  })
  @IsOptional()
  @IsString()
  search?: string;
}
