import {
  IsEmail,
  IsString,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  Matches,
  IsPhoneNumber,
} from "class-validator";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { UserRole } from "@/infrastructure/database/entities/user.entity";

export class RegisterDto {
  @ApiProperty({
    description:
      "Username for the account (3-50 characters, alphanumeric and underscore only)",
    example: "student123",
    minLength: 3,
    maxLength: 50,
    pattern: "^[a-zA-Z0-9_]+$",
  })
  @IsString()
  @MinLength(3, { message: "Username must be at least 3 characters long" })
  @MaxLength(50, { message: "Username cannot exceed 50 characters" })
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: "Username can only contain letters, numbers, and underscores",
  })
  username: string;

  @ApiProperty({
    description: "Email address (must be a valid email format)",
    example: "student@example.com",
    format: "email",
  })
  @IsEmail({}, { message: "Please provide a valid email address" })
  email: string;

  @ApiProperty({
    description:
      "Password (8-128 characters, must contain at least one uppercase, one lowercase, one number)",
    example: "Password123",
    minLength: 8,
    maxLength: 128,
    pattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)[a-zA-Z\\d@$!%*?&]{8,}$",
  })
  @IsString()
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @MaxLength(128, { message: "Password cannot exceed 128 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, and one number",
  })
  password: string;

  @ApiPropertyOptional({
    description: "Phone number (international format)",
    example: "+84123456789",
    maxLength: 20,
    pattern: "^\\+[1-9]\\d{1,14}$",
  })
  @IsOptional()
  @IsString()
  @MaxLength(20, { message: "Phone number cannot exceed 20 characters" })
  @Matches(/^\+[1-9]\d{1,14}$/, {
    message:
      "Phone number must be in international format (e.g., +84123456789)",
  })
  phone?: string;

  @ApiPropertyOptional({
    description: "Account type",
    enum: UserRole,
    default: UserRole.STUDENT,
    example: UserRole.STUDENT,
  })
  @IsOptional()
  @IsEnum(UserRole, { message: "Invalid account type" })
  accountType?: UserRole = UserRole.STUDENT;

  @ApiPropertyOptional({
    description: "Device ID for session management (optional)",
    example: "device_123456",
    required: false,
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, { message: "Device ID cannot exceed 100 characters" })
  deviceId?: string;
}

// Internal interface for auth service that includes IP address and user agent
export interface RegisterDtoWithIp extends RegisterDto {
  ip: string;
  userAgent: string;
}
