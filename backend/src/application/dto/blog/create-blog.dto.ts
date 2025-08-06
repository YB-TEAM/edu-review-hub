import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  MinLength,
  MaxLength,
} from "class-validator";
import { BlogCategory } from "@/infrastructure/database/entities/blog.entity";

export class CreateBlogDto {
  @ApiProperty({
    example: "My First Blog Post",
    description: "Blog title",
    minLength: 5,
    maxLength: 255,
  })
  @IsString()
  @MinLength(5)
  @MaxLength(255)
  title: string;

  @ApiProperty({
    example: "This is the content of my blog post...",
    description: "Blog content",
    minLength: 10,
  })
  @IsString()
  @MinLength(10)
  content: string;

  @ApiPropertyOptional({
    example: "A brief summary of the blog post",
    description: "Blog excerpt (optional)",
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  excerpt?: string;

  @ApiPropertyOptional({
    example: "https://example.com/featured-image.jpg",
    description: "Featured image URL",
    maxLength: 500,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  featuredImage?: string;

  @ApiPropertyOptional({
    enum: BlogCategory,
    example: BlogCategory.GUIDE,
    description: "Blog category",
    default: BlogCategory.OTHER,
  })
  @IsOptional()
  @IsEnum(BlogCategory)
  category?: BlogCategory;

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
