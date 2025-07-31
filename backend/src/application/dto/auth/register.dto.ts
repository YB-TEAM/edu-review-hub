import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "@/infrastructure/database/entities/user.entity";

export class RegisterDto {
  @ApiProperty({
    description: "Username for the account",
    example: "student123",
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  username: string;

  @ApiProperty({
    description: "Email address",
    example: "student@example.com",
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Password for the account (minimum 8 characters)",
    example: "password123",
    minLength: 8,
    maxLength: 128,
  })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password: string;

  @ApiPropertyOptional({
    description: "Phone number",
    example: "+84123456789",
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({
    description: "Account type",
    enum: UserRole,
    default: UserRole.STUDENT,
    example: UserRole.STUDENT,
  })
  @IsOptional()
  @IsEnum(UserRole)
  accountType?: UserRole = UserRole.STUDENT;

  @ApiPropertyOptional({
    description: "Device ID for session management (optional)",
    example: "device_123456",
    required: false,
  })
  @IsOptional()
  @IsString()
  deviceId?: string;
}

// Internal interface for auth service that includes IP address and user agent
export interface RegisterDtoWithIp extends RegisterDto {
  ip: string;
  userAgent: string;
}
