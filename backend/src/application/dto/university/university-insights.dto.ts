import { ApiProperty } from "@nestjs/swagger";

export class UniversityInsightsDto {
  @ApiProperty({
    description: "University strengths identified from reviews",
    example: [
      "Chất lượng giảng dạy tốt",
      "Cơ sở vật chất hiện đại",
      "Môi trường học tập thân thiện",
    ],
    type: [String],
  })
  strengths: string[];

  @ApiProperty({
    description: "University weaknesses identified from reviews",
    example: ["Chi phí học tập cao", "Ký túc xá cần cải thiện"],
    type: [String],
  })
  weaknesses: string[];

  @ApiProperty({
    description: "Recommendations for improvement",
    example: [
      "Cải thiện cơ sở vật chất",
      "Mở rộng chương trình học bổng",
      "Tăng cường hoạt động ngoại khóa",
    ],
    type: [String],
  })
  recommendations: string[];

  @ApiProperty({
    description: "Trend analysis from reviews",
    example: {
      ratingTrend: "increasing",
      reviewVolumeTrend: "stable",
      sentimentTrend: "positive",
    },
  })
  trends: {
    ratingTrend: string;
    reviewVolumeTrend: string;
    sentimentTrend: string;
  };
}

export class UniversityInsightsResponseDto {
  @ApiProperty({
    description: "University information",
    example: {
      id: 1,
      name: "Đại học Quốc gia Hà Nội",
      short_name: "VNU",
      type: "public",
      location: "Hà Nội",
    },
  })
  university: {
    id: number;
    name: string;
    short_name?: string;
    type: string;
    location: string;
    [key: string]: any;
  };

  @ApiProperty({
    description: "University insights and analysis",
    type: UniversityInsightsDto,
  })
  insights: UniversityInsightsDto;

  @ApiProperty({
    description: "When the insights were generated",
    example: "2025-01-25T10:30:00.000Z",
  })
  lastUpdated: Date;
}
