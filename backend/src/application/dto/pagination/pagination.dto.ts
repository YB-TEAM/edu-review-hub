import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, Min, IsOptional } from "class-validator";

export class PaginationDto {
  @ApiProperty({ example: 1, required: false, description: "Trang hiện tại" })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({
    example: 10,
    required: false,
    description: "Số lượng mỗi trang",
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit?: number = 10;
}
