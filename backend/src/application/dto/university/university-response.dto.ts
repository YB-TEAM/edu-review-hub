import { ApiProperty } from "@nestjs/swagger";

export class UniversityResponseDto {
  @ApiProperty({ description: "University ID" })
  id: number;

  @ApiProperty({ description: "University name" })
  name: string;

  @ApiProperty({ description: "Short name/abbreviation" })
  short_name: string;

  @ApiProperty({ description: "English name" })
  english_name: string;

  @ApiProperty({ description: "Location/provinces", type: [String] })
  location: string[];

  @ApiProperty({ description: "University description" })
  description: string;

  @ApiProperty({ description: "Logo URL" })
  logo_url: string;

  @ApiProperty({ description: "Average rating score" })
  average_rating: number;

  @ApiProperty({ description: "Total number of reviews" })
  review_count: number;

  @ApiProperty({ description: "Is featured university" })
  is_featured: boolean;

  @ApiProperty({ description: "Is verified university" })
  is_verified: boolean;

  @ApiProperty({ description: "University status" })
  status: string;

  @ApiProperty({ description: "University type" })
  type: string;

  @ApiProperty({ description: "Created date" })
  created_at: Date;

  @ApiProperty({ description: "Updated date" })
  updated_at: Date;
}
