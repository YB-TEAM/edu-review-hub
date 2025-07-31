import { IsString, IsEmail, IsOptional, IsBoolean } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class LoginDto {
  @ApiProperty({
    description: "Email address or username",
    example: "student@example.com",
    examples: ["student@example.com", "student123"],
  })
  @IsString()
  identifier: string;

  @ApiProperty({
    description: "Password for the account",
    example: "password123",
  })
  @IsString()
  password: string;

  @ApiPropertyOptional({
    description: "Device ID for session management (optional)",
    example: "device_123456",
    required: false,
  })
  @IsOptional()
  @IsString()
  deviceId?: string;

  @ApiPropertyOptional({
    description: "Remember me option for extended session",
    example: false,
    default: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  rememberMe?: boolean;
}

// Internal interface for auth service that includes IP address and user agent
export interface LoginDtoWithIp extends LoginDto {
  ip: string;
  userAgent: string;
}
