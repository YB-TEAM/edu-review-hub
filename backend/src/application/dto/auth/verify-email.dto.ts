import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class VerifyEmailDto {
  @ApiProperty({ description: "Verification token from email" })
  @IsString()
  token: string;
}
