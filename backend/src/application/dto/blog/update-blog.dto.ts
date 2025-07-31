import { ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  MinLength,
  MaxLength,
} from "class-validator";
import {
  BlogCategory,
  BlogStatus,
} from "@/infrastructure/database/entities/blog.entity";

export class UpdateBlogDto {
  @ApiPropertyOptional({
    example: "Updated Blog Title",
    description: "Blog title",
    minLength: 5,
    maxLength: 255,
  })
  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({
    example: "Updated blog content...",
    description: "Blog content",
    minLength: 10,
  })
  @IsOptional()
  @IsString()
  @MinLength(10)
  content?: string;

  @ApiPropertyOptional({
    example: "Updated excerpt",
    description: "Blog excerpt",
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiPropertyOptional({
    example: "https://example.com/updated-image.jpg",
    description: "Featured image URL",
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  featuredImage?: string;

  @ApiPropertyOptional({
    enum: BlogCategory,
    example: BlogCategory.REVIEW,
    description: "Blog category",
  })
  @IsOptional()
  @IsEnum(BlogCategory)
  category?: BlogCategory;

  @ApiPropertyOptional({
    enum: BlogStatus,
    example: BlogStatus.DRAFT,
    description: "Blog status",
  })
  @IsOptional()
  @IsEnum(BlogStatus)
  status?: BlogStatus;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: "Blog tag IDs",
    type: [Number],
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tagIds?: number[];
}
