import { ApiProperty } from "@nestjs/swagger";
import {
  UserRole,
  UserStatus,
} from "@/infrastructure/database/entities/user.entity";

export class RegisterResponseDto {
  @ApiProperty({
    description: "Success message",
    example:
      "Registration successful. Please check your email to verify your account.",
  })
  message: string;

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
