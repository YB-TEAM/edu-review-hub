import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsArray,
  IsUrl,
  MinLength,
  MaxLength,
  ArrayMinSize,
  ArrayMaxSize,
  IsNumber,
  Min,
  Max,
} from "class-validator";

export class CreateUniversityDto {
  @ApiProperty({
    example: "Đại học Quốc gia Hà Nội",
    description: "University name (3-255 characters)",
    minLength: 3,
    maxLength: 255,
  })
  @IsString({ message: "Name must be a string" })
  @MinLength(3, { message: "Name must be at least 3 characters long" })
  @MaxLength(255, { message: "Name cannot exceed 255 characters" })
  name: string;

  @ApiPropertyOptional({
    example: ["Hà Nội", "Việt Nam"],
    description: "University locations (1-5 locations)",
    type: [String],
    minItems: 1,
    maxItems: 5,
  })
  @IsOptional()
  @IsArray({ message: "Location must be an array" })
  @ArrayMinSize(1, { message: "At least one location is required" })
  @ArrayMaxSize(5, { message: "Cannot exceed 5 locations" })
  @IsString({ each: true, message: "Each location must be a string" })
  location?: string[];

  @ApiPropertyOptional({
    example: "Trường đại học hàng đầu Việt Nam với chất lượng đào tạo xuất sắc",
    description: "University description (optional, max 1000 characters)",
    maxLength: 1000,
  })
  @IsOptional()
  @IsString({ message: "Description must be a string" })
  @MaxLength(1000, { message: "Description cannot exceed 1000 characters" })
  description?: string;

  @ApiPropertyOptional({
    example: "https://example.com/logo.png",
    description: "University logo URL (must be a valid URL)",
    format: "uri",
  })
  @IsOptional()
  @IsString({ message: "Logo URL must be a string" })
  @IsUrl({}, { message: "Logo URL must be a valid URL" })
  logo_url?: string;

  @ApiPropertyOptional({
    example: "https://vnu.edu.vn",
    description: "University website URL (must be a valid URL)",
    format: "uri",
  })
  @IsOptional()
  @IsString({ message: "Website URL must be a string" })
  @IsUrl({}, { message: "Website URL must be a valid URL" })
  website?: string;

  @ApiPropertyOptional({
    example: 1906,
    description: "Year the university was established",
    minimum: 1800,
    maximum: 2024,
  })
  @IsOptional()
  @IsNumber({}, { message: "Established year must be a number" })
  @Min(1800, { message: "Established year must be at least 1800" })
  @Max(2024, { message: "Established year cannot exceed current year" })
  establishedYear?: number;

  @ApiPropertyOptional({
    example: 50000,
    description: "Number of students enrolled",
    minimum: 1,
  })
  @IsOptional()
  @IsNumber({}, { message: "Student count must be a number" })
  @Min(1, { message: "Student count must be at least 1" })
  studentCount?: number;

  @ApiPropertyOptional({
    example: ["Engineering", "Computer Science", "Business"],
    description: "Main academic programs offered (1-20 programs)",
    type: [String],
    maxItems: 20,
  })
  @IsOptional()
  @IsArray({ message: "Programs must be an array" })
  @ArrayMaxSize(20, { message: "Cannot exceed 20 programs" })
  @IsString({ each: true, message: "Each program must be a string" })
  programs?: string[];
}
