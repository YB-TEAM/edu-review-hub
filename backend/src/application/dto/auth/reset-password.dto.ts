import { IsString, MinLength, MaxLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ResetPasswordDto {
  @ApiProperty({ description: "Reset token from email" })
  @IsString()
  token: string;

  @ApiProperty({ description: "New password" })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}
