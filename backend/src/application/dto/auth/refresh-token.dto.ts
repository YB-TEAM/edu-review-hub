import { IsString, IsNotEmpty, IsOptional } from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RefreshTokenDto {
  @ApiProperty({
    description: "Refresh token to get new access token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  @IsString()
  @IsNotEmpty()
  refreshToken: string;

  @ApiPropertyOptional({
    description: "Device ID for session management (optional)",
    example: "device_123456",
    required: false,
  })
  @IsOptional()
  @IsString()
  deviceId?: string;
}
