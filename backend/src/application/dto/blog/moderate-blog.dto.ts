import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEnum, IsOptional, IsString, IsNotEmpty } from "class-validator";
import { BlogStatus } from "@/infrastructure/database/entities/blog.entity";

export class ModerateBlogDto {
  @ApiProperty({
    enum: BlogStatus,
    example: BlogStatus.PUBLISHED,
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
