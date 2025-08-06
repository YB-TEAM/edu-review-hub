import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString } from "class-validator";

export class ChangeEmailDto {
  @ApiProperty({ description: "New email address" })
  @IsEmail()
  newEmail: string;

  @ApiProperty({ description: "Current password for verification" })
  @IsString()
  password: string;
}
