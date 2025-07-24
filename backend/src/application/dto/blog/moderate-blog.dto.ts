import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class ModerateBlogDto {
  @ApiProperty({
    example: "approved",
    description: "Moderation status (approved/rejected)",
  })
  status: string;

  @ApiPropertyOptional({
    example: "Vi phạm nội dung",
    description: "Lý do từ chối (nếu có)",
  })
  reason?: string;
}
