import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsString, IsOptional } from "class-validator";

export class CreateBlogDto {
  @ApiProperty({ example: "My first blog", description: "Blog title" })
  @IsString()
  title: string;

  @ApiProperty({ example: "This is the content", description: "Blog content" })
  @IsString()
  content: string;

  @ApiPropertyOptional({
    example: "https://example.com/image.jpg",
    description: "Blog image URL",
  })
  @IsOptional()
  @IsString()
  image?: string;
}
