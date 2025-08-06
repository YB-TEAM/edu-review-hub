import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString, IsArray, IsNumber } from "class-validator";

export class PublishBlogDto {
  @ApiProperty({
    description: "Blog title",
    example: "How to Choose the Right University",
  })
  @IsString()
  title: string;

  @ApiProperty({
    description: "Blog content in markdown format",
    example: "# How to Choose the Right University\n\nChoosing the right university is one of the most important decisions...",
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: "Blog excerpt/summary",
    example: "A comprehensive guide to help students choose the perfect university for their academic journey.",
    required: false,
  })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({
    description: "Featured image URL",
    example: "https://example.com/image.jpg",
    required: false,
  })
  @IsOptional()
  @IsString()
  featuredImage?: string;

  @ApiProperty({
    description: "Blog category",
    example: "guide",
    enum: ["news", "guide", "review", "interview", "opinion", "other"],
  })
  @IsString()
  category: string;

  @ApiProperty({
    description: "Array of tag IDs",
    example: [1, 2, 3],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  tagIds?: number[];

  @ApiProperty({
    description: "Keywords for SEO",
    example: ["university", "education", "choosing"],
    required: false,
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  keywords?: string[];
} 