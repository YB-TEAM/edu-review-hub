import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsIn } from "class-validator";

export class ModerateUniversityReviewDto {
  @ApiProperty({ example: "approved", enum: ["approved", "rejected"] })
  @IsString()
  @IsIn(["approved", "rejected"])
  status: string;
} 