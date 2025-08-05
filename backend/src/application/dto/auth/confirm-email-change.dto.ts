import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class ConfirmEmailChangeDto {
  @ApiProperty({ description: "Email change confirmation token" })
  @IsString()
  token: string;
}
