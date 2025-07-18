import { IsString, IsOptional, IsDateString, MaxLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class AdminUpdateUserDto {
  @ApiPropertyOptional({ description: "Họ" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ description: "Tên" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({ description: "Tên hiển thị" })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  displayName?: string;
}
