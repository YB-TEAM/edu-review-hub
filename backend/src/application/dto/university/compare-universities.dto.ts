import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsNumber,
  Min,
  Max,
  ArrayMinSize,
  ArrayMaxSize,
} from "class-validator";

export class CompareUniversitiesDto {
  @ApiProperty({
    description: "Array of university IDs to compare",
    example: [1, 2, 3],
    type: [Number],
    minItems: 2,
    maxItems: 5,
  })
  @IsArray()
  @ArrayMinSize(2, { message: "Must compare at least 2 universities" })
  @ArrayMaxSize(5, { message: "Cannot compare more than 5 universities" })
  @IsNumber({}, { each: true })
  universityIds: number[];
}

export class UniversityComparisonDto {
  @ApiProperty({
    description: "Basic university information for comparison",
    example: {
      id: 1,
      name: "Đại học Quốc gia Hà Nội",
      type: "public",
      location: "Hà Nội",
      foundedYear: 1906,
      studentCount: 50000,
      facultyCount: 2000,
    },
  })
  basicInfo: Array<{
    id: number;
    name: string;
    type: string;
    location: string;
    foundedYear: number;
    studentCount: number;
    facultyCount: number;
  }>;

  @ApiProperty({
    description: "Rating information for comparison",
    example: {
      id: 1,
      name: "Đại học Quốc gia Hà Nội",
      averageRating: 4.5,
      reviewCount: 150,
      totalRating: 675,
    },
  })
  ratings: Array<{
    id: number;
    name: string;
    averageRating: number;
    reviewCount: number;
    totalRating: number;
  }>;

  @ApiProperty({
    description: "Cost information for comparison",
    example: {
      id: 1,
      name: "Đại học Quốc gia Hà Nội",
      tuitionFeeMin: 1000000,
      tuitionFeeMax: 5000000,
      currency: "VND",
    },
  })
  costs: Array<{
    id: number;
    name: string;
    tuitionFeeMin: number;
    tuitionFeeMax: number;
    currency: string;
  }>;

  @ApiProperty({
    description: "Feature information for comparison",
    example: {
      id: 1,
      name: "Đại học Quốc gia Hà Nội",
      isFeatured: true,
      isVerified: true,
      specializations: "Khoa học, Công nghệ, Kinh tế",
      facilities: "Thư viện, Phòng lab, Ký túc xá",
    },
  })
  features: Array<{
    id: number;
    name: string;
    isFeatured: boolean;
    isVerified: boolean;
    specializations: string;
    facilities: string;
  }>;
}

export class CompareUniversitiesResponseDto {
  @ApiProperty({
    description: "List of universities being compared",
    type: "array",
  })
  universities: any[];

  @ApiProperty({
    description: "Detailed comparison data",
    type: UniversityComparisonDto,
  })
  comparison: UniversityComparisonDto;

  @ApiProperty({
    description: "When the comparison was performed",
    example: "2025-01-25T10:30:00.000Z",
  })
  comparedAt: Date;
}
