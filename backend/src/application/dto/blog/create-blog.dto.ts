import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  MinLength,
  MaxLength,
  IsUrl,
  ArrayMinSize,
  ArrayMaxSize,
  Matches,
} from "class-validator";
import { BlogCategory } from "@/infrastructure/database/entities/blog.entity";

export class CreateBlogDto {
  @ApiProperty({
    example: "My First Blog Post",
    description: "Blog title (5-255 characters)",
    minLength: 5,
    maxLength: 255,
  })
  @IsString({ message: "Title must be a string" })
  @MinLength(5, { message: "Title must be at least 5 characters long" })
  @MaxLength(255, { message: "Title cannot exceed 255 characters" })
  title: string;

  @ApiProperty({
    example: "This is the content of my blog post with detailed information...",
    description: "Blog content (minimum 10 characters)",
    minLength: 10,
  })
  @IsString({ message: "Content must be a string" })
  @MinLength(10, { message: "Content must be at least 10 characters long" })
  content: string;

  @ApiPropertyOptional({
    example: "A brief summary of the blog post that captures the main points",
    description: "Blog excerpt (optional, max 500 characters)",
    maxLength: 500,
  })
  @IsOptional()
  @IsString({ message: "Excerpt must be a string" })
  @MaxLength(500, { message: "Excerpt cannot exceed 500 characters" })
  excerpt?: string;

  @ApiPropertyOptional({
    example:
      "https://res.cloudinary.com/example/image/upload/v1234567890/blog-featured.jpg",
    description: "Featured image URL (must be a valid URL)",
    maxLength: 500,
    format: "uri",
  })
  @IsOptional()
  @IsString({ message: "Featured image URL must be a string" })
  @IsUrl({}, { message: "Featured image must be a valid URL" })
  @MaxLength(500, {
    message: "Featured image URL cannot exceed 500 characters",
  })
  featuredImage?: string;

  @ApiPropertyOptional({
    enum: BlogCategory,
    example: BlogCategory.GUIDE,
    description: "Blog category",
    default: BlogCategory.OTHER,
  })
  @IsOptional()
  @IsEnum(BlogCategory, { message: "Invalid blog category" })
  category?: BlogCategory;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: "Blog tag IDs (1-10 tags allowed)",
    type: [Number],
    minItems: 1,
    maxItems: 10,
  })
  @IsOptional()
  @IsArray({ message: "Tag IDs must be an array" })
  @ArrayMinSize(1, { message: "At least one tag is required" })
  @ArrayMaxSize(10, { message: "Cannot exceed 10 tags" })
  @IsNumber({}, { each: true, message: "Each tag ID must be a number" })
  tagIds?: number[];

  @ApiPropertyOptional({
    example: ["technology", "education", "university"],
    description: "SEO keywords for the blog post (optional)",
    type: [String],
    maxItems: 10,
  })
  @IsOptional()
  @IsArray({ message: "Keywords must be an array" })
  @ArrayMaxSize(10, { message: "Cannot exceed 10 keywords" })
  @IsString({ each: true, message: "Each keyword must be a string" })
  keywords?: string[];

  @ApiPropertyOptional({
    example: "blog-post-slug",
    description: "Custom URL slug (optional, auto-generated if not provided)",
    maxLength: 100,
    pattern: "^[a-z0-9-]+$",
  })
  @IsOptional()
  @IsString({ message: "Slug must be a string" })
  @MaxLength(100, { message: "Slug cannot exceed 100 characters" })
  @Matches(/^[a-z0-9-]+$/, {
    message: "Slug can only contain lowercase letters, numbers, and hyphens",
  })
  slug?: string;
}
