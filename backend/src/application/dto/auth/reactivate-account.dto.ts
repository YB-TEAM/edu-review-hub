import { IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class ReactivateAccountDto {
  @ApiProperty({ description: "Email address of the account" })
  @IsString()
  email: string;

  @ApiProperty({ description: "Username of the account" })
  @IsString()
  username: string;
}
