import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  BlogStatus,
  BlogCategory,
} from "@/infrastructure/database/entities/blog.entity";
import { TagResponseDto } from "../tag/tag-response.dto";

export class BlogResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "My First Blog Post" })
  title: string;

  @ApiProperty({ example: "This is the content of my blog post..." })
  content: string;

  @ApiPropertyOptional({ example: "A brief summary of the blog post" })
  excerpt?: string;

  @ApiPropertyOptional({
    example: "edu-review-hub/zirc5boiivyb3bocqhrt",
    description: "Cloudinary public ID of featured image",
  })
  featuredImage?: string;

  @ApiPropertyOptional({
    example:
      "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/edu-review-hub/zirc5boiivyb3bocqhrt.jpg",
    description: "Full URL of featured image",
  })
  featuredImageUrl?: string;

  @ApiPropertyOptional({
    example: {
      thumbnail:
        "https://res.cloudinary.com/your-cloud/image/upload/w_300,h_200,c_fill,q_auto/edu-review-hub/zirc5boiivyb3bocqhrt.jpg",
      medium:
        "https://res.cloudinary.com/your-cloud/image/upload/w_800,h_600,c_fill,q_auto/edu-review-hub/zirc5boiivyb3bocqhrt.jpg",
      large:
        "https://res.cloudinary.com/your-cloud/image/upload/w_1200,h_800,c_fill,q_auto/edu-review-hub/zirc5boiivyb3bocqhrt.jpg",
      original:
        "https://res.cloudinary.com/your-cloud/image/upload/q_auto/edu-review-hub/zirc5boiivyb3bocqhrt.jpg",
    },
    description: "Responsive image URLs for different screen sizes",
  })
  featuredImageUrls?: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };

  @ApiProperty({ enum: BlogCategory, example: BlogCategory.GUIDE })
  category: BlogCategory;

  @ApiProperty({ enum: BlogStatus, example: BlogStatus.PUBLISHED })
  status: BlogStatus;

  @ApiPropertyOptional({ example: "Content violates community guidelines" })
  moderationReason?: string;

  @ApiProperty({ example: 150 })
  viewCount: number;

  @ApiProperty({ example: 25 })
  likeCount: number;

  @ApiPropertyOptional({
    example: true,
    description:
      "Whether the current user has liked this blog (null if not authenticated)",
  })
  isLiked?: boolean;

  @ApiProperty({ example: 10 })
  commentCount: number;

  @ApiPropertyOptional({
    example: [{ id: 1, name: "technology", color: "#3B82F6" }],
    description: "Blog tags",
  })
  tags?: any[];

  @ApiPropertyOptional({ example: "2024-01-15T10:30:00Z" })
  publishedAt?: Date;

  @ApiPropertyOptional({ example: "2024-01-15T11:00:00Z" })
  moderatedAt?: Date;

  @ApiProperty({ example: 1 })
  authorId: number;

  @ApiPropertyOptional({ example: "John Doe" })
  authorName?: string;

  @ApiPropertyOptional({ example: 2 })
  moderatorId?: number;

  @ApiPropertyOptional({ example: "Jane Smith" })
  moderatorName?: string;

  @ApiProperty({ example: "2024-01-15T10:00:00Z" })
  createdAt: Date;

  @ApiProperty({ example: "2024-01-15T10:30:00Z" })
  updatedAt: Date;
}
