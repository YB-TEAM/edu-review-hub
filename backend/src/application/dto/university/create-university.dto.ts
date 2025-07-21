import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsOptional, IsArray } from "class-validator";

export class CreateUniversityDto {
  @ApiProperty({ example: "Đại học Quốc gia Hà Nội" })
  @IsString()
  name: string;

  @ApiProperty({ example: ["Hà Nội"], required: false, type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  location?: string[];

  @ApiProperty({ example: "Trường đại học hàng đầu Việt Nam", required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: "https://example.com/logo.png", required: false })
  @IsOptional()
  @IsString()
  logo_url?: string;
}
