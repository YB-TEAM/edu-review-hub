import { ApiProperty } from "@nestjs/swagger";
import {
  AccountType,
  UserStatus,
} from "@/infrastructure/database/entities/user.entity";

export class AuthResponseDto {
  @ApiProperty({ description: "Access token" })
  accessToken: string;

  @ApiProperty({ description: "Refresh token" })
  refreshToken: string;

  @ApiProperty({ description: "Token type" })
  tokenType: string;

  @ApiProperty({ description: "Token expiration time in seconds" })
  expiresIn: number;

  @ApiProperty({ description: "User information" })
  user: {
    id: number;
    username: string;
    email: string;
    accountType: AccountType;
    status: UserStatus;
    isVerified: boolean;
  };
}
