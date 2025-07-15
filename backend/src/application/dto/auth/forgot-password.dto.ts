import { IsEmail } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ForgotPasswordDto {
  @ApiProperty({ description: "Email address to send reset link" })
  @IsEmail()
  email: string;
}
