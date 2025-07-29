import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { BlogStatus } from "@/infrastructure/database/entities/blog.entity";

export class ModerateBlogDto {
  @ApiProperty({
    enum: BlogStatus,
    example: BlogStatus.APPROVED,
    description: "New status for the blog",
  })
  @IsEnum(BlogStatus)
  @IsNotEmpty()
  status: BlogStatus;

  @ApiPropertyOptional({
    example: "Content violates community guidelines",
    description: "Reason for moderation (required if status is REJECTED)",
  })
  @IsOptional()
  @IsString()
  moderationReason?: string;
}

// Specific DTOs for clearer API endpoints
export class ApproveBlogDto {
  @ApiPropertyOptional({
    example: "Good quality content",
    description: "Optional approval comment",
  })
  @IsOptional()
  @IsString()
  moderationReason?: string;
}

export class RejectBlogDto {
  @ApiProperty({
    example: "Content violates community guidelines",
    description: "Reason for rejection (required)",
  })
  @IsNotEmpty()
  @IsString()
  moderationReason: string;
}

export class BanBlogDto {
  @ApiProperty({
    example: "Spam content or severe policy violation",
    description: "Reason for banning the blog (required)",
  })
  @IsNotEmpty()
  @IsString()
  banReason: string;
}
