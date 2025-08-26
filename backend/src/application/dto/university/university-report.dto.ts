import { ApiProperty } from "@nestjs/swagger";

export class UniversityReportDto {
  @ApiProperty({
    description: "University ID",
    example: 1,
  })
  id: number;

  @ApiProperty({
    description: "University name",
    example: "Đại học Quốc gia Hà Nội",
  })
  name: string;

  @ApiProperty({
    description: "University type",
    example: "public",
  })
  type: string;

  @ApiProperty({
    description: "University location",
    example: "Hà Nội",
  })
  location: string;

  @ApiProperty({
    description: "Year university was founded",
    example: 1906,
  })
  foundedYear: number;

  @ApiProperty({
    description: "Number of students",
    example: 50000,
  })
  studentCount: number;

  @ApiProperty({
    description: "Number of faculty members",
    example: 2000,
  })
  facultyCount: number;
}

export class UniversityReportStatisticsDto {
  @ApiProperty({
    description: "Total number of reviews",
    example: 150,
  })
  totalReviews: number;

  @ApiProperty({
    description: "Average rating",
    example: 4.5,
  })
  averageRating: number;

  @ApiProperty({
    description: "Total view count",
    example: 10000,
  })
  viewCount: number;

  @ApiProperty({
    description: "Total review count",
    example: 150,
  })
  reviewCount: number;
}

export class UniversityReportResponseDto {
  @ApiProperty({
    description: "University information",
    type: UniversityReportDto,
  })
  university: UniversityReportDto;

  @ApiProperty({
    description: "University statistics",
    type: UniversityReportStatisticsDto,
  })
  statistics: UniversityReportStatisticsDto;

  @ApiProperty({
    description: "Type of report generated",
    example: "reviews",
  })
  reportType: string;

  @ApiProperty({
    description: "When the report was generated",
    example: "2025-01-25T10:30:00.000Z",
  })
  generatedAt: Date;
}
