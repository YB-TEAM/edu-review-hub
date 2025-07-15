import { IsString, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class DeleteAccountDto {
  @ApiProperty({ description: "Current password for verification" })
  @IsString()
  password: string;

  @ApiPropertyOptional({ description: "Reason for deletion" })
  @IsOptional()
  @IsString()
  reason?: string;

  @ApiPropertyOptional({
    description: "Confirm permanent deletion of all data",
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  confirmPermanentDeletion?: boolean = false;
}
