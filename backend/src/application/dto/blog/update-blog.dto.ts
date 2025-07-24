import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class UpdateBlogDto {
  @ApiPropertyOptional({
    example: "My updated blog",
    description: "Blog title",
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({
    example: "Updated content",
    description: "Blog content",
  })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiPropertyOptional({
    example: "https://example.com/image.jpg",
    description: "Blog image URL",
  })
  @IsOptional()
  @IsString()
  image?: string;
}
