import { IsString, IsEmail, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({ description: "Email or username" })
  @IsString()
  identifier: string;

  @ApiProperty({ description: "Password" })
  @IsString()
  password: string;

  @ApiPropertyOptional({ description: "Device ID for session management" })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({ description: "Remember me option" })
  @IsOptional()
  rememberMe?: boolean;
}
