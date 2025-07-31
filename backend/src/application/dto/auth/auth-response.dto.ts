import { ApiProperty } from "@nestjs/swagger";
import {
  UserRole,
  UserStatus,
} from "@/infrastructure/database/entities/user.entity";

export class AuthResponseDto {
  @ApiProperty({
    description: "JWT access token for API authentication",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  accessToken: string;

  @ApiProperty({
    description: "JWT refresh token to get new access token",
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  })
  refreshToken: string;

  @ApiProperty({
    description: "Token type",
    example: "Bearer",
  })
  tokenType: string;

  @ApiProperty({
    description: "Token expiration time in seconds",
    example: 604800,
  })
  expiresIn: number;

  @ApiProperty({
    description: "User information",
    example: {
      id: 1,
      username: "student123",
      email: "student@example.com",
      accountType: "student",
      status: "active",
      isVerified: false,
    },
  })
  user: {
    id: number;
    username: string;
    email: string;
    accountType: UserRole;
    status: UserStatus;
    isVerified: boolean;
  };
}
