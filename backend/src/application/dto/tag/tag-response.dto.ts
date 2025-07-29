import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TagResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: "technology" })
  name: string;

  @ApiPropertyOptional({ example: "Technology related content" })
  description?: string;

  @ApiPropertyOptional({ example: "#3B82F6" })
  color?: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: 15 })
  usageCount: number;

  @ApiProperty({ example: "2024-01-15T10:00:00Z" })
  createdAt: Date;

  @ApiProperty({ example: "2024-01-15T10:30:00Z" })
  updatedAt: Date;
}
