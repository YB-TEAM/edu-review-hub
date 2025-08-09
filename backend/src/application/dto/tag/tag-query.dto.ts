import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Min, IsOptional, IsString } from "class-validator";

export class TagQueryDto {
  @ApiProperty({ example: 1, required: false, description: "Current page (default: 1)" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ example: 20, required: false, description: "Items per page (default: 20)" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 20;

  @ApiProperty({ required: false, description: "Search by tag name" })
  @IsOptional()
  @IsString()
  search?: string;
}


