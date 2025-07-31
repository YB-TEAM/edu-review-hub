import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsHexColor,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateTagDto {
  @ApiProperty({
    example: "technology",
    description: "Tag name (unique)",
    minLength: 2,
    maxLength: 50,
  })
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  name: string;

  @ApiPropertyOptional({
    example: "Technology related content",
    description: "Tag description",
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  description?: string;

  @ApiPropertyOptional({
    example: "#3B82F6",
    description: "Tag color in hex format",
    pattern: "^#[0-9A-Fa-f]{6}$",
  })
  @IsOptional()
  @IsHexColor()
  color?: string;
}
