import { IsString, IsOptional } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class LogoutDto {
  @ApiPropertyOptional({ description: "Device ID to logout from" })
  @IsOptional()
  @IsString()
  deviceId?: string;
}
