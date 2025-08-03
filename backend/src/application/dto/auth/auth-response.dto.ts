import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import {
  UserRole,
  UserStatus,
} from "@/infrastructure/database/entities/user.entity";

export class UserInfoDto {
  @ApiProperty({
    description: "User ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "Username",
    example: "student123",
  })
  username: string;

  @ApiProperty({
    description: "Email address",
    example: "student@example.com",
  })
  email: string;

  @ApiProperty({
    description: "Account type",
    enum: UserRole,
    example: UserRole.STUDENT,
  })
  accountType: UserRole;

  @ApiProperty({
    description: "User status",
    enum: UserStatus,
    example: UserStatus.ACTIVE,
  })
  status: UserStatus;

  @ApiProperty({
    description: "Whether email is verified",
    example: false,
  })
  isVerified: boolean;

  @ApiPropertyOptional({
    description: "Phone number",
    example: "+84123456789",
  })
  phone?: string;

  @ApiPropertyOptional({
    description: "Last login timestamp",
    example: "2024-01-15T10:30:00.000Z",
  })
  lastLoginAt?: Date;

  @ApiPropertyOptional({
    description: "User profile information",
    example: {
      firstName: "John",
      lastName: "Doe",
      avatarUrl: "https://example.com/avatar.jpg",
      bio: "Student at University",
    },
  })
  profile?: {
    firstName?: string;
    lastName?: string;
    avatarUrl?: string;
    bio?: string;
  };
}

export class AuthResponseDto {
  @ApiProperty({
    description: "JWT access token for API authentication",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxNjM0NjU0MjkwfQ.example",
    minLength: 100,
  })
  accessToken: string;

  @ApiProperty({
    description: "JWT refresh token to get new access token",
    example:
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImlhdCI6MTYzNDU2Nzg5MCwiZXhwIjoxNjM1MDg2MjkwfQ.refresh",
    minLength: 100,
  })
  refreshToken: string;

  @ApiProperty({
    description: "Token type",
    example: "Bearer",
    default: "Bearer",
  })
  tokenType: string;

  @ApiProperty({
    description: "Token expiration time in seconds",
    example: 604800,
    minimum: 60,
  })
  expiresIn: number;

  @ApiProperty({
    description: "Refresh token expiration time in seconds",
    example: 2592000,
    minimum: 3600,
  })
  refreshExpiresIn: number;

  @ApiProperty({
    description: "User information",
    type: UserInfoDto,
  })
  user: UserInfoDto;

  @ApiPropertyOptional({
    description: "Additional session information",
    example: {
      sessionId: "sess_123456",
      deviceId: "device_123456",
      ipAddress: "192.168.1.1",
    },
  })
  session?: {
    sessionId: string;
    deviceId?: string;
    ipAddress?: string;
  };
}
