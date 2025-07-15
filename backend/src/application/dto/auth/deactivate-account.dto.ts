import { IsString, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class DeactivateAccountDto {
  @ApiProperty({ description: "Current password for verification" })
  @IsString()
  password: string;

  @ApiPropertyOptional({ description: "Reason for deactivation" })
  @IsOptional()
  @IsString()
  reason?: string;
}
