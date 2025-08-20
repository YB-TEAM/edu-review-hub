import { ApiProperty } from "@nestjs/swagger";
import {
  UniversityType,
  UniversityStatus,
} from "../../../infrastructure/database/entities/university.entity";

export class UniversityResponseDto {
  @ApiProperty({ description: "University ID", example: 1 })
  id: number;

  @ApiProperty({
    description: "University name",
    example: "Đại học Quốc gia Hà Nội",
  })
  name: string;

  @ApiProperty({ description: "Short name/abbreviation", example: "ĐHQGHN" })
  short_name: string;

  @ApiProperty({
    description: "English name",
    example: "Vietnam National University, Hanoi",
  })
  english_name: string;

  @ApiProperty({
    description: "Full address",
    example: "144 Xuân Thủy, Cầu Giấy, Hà Nội",
  })
  address: string;

  @ApiProperty({
    description: "Location/provinces",
    type: [String],
    example: ["Hà Nội"],
  })
  location: string[];

  @ApiProperty({ description: "City", example: "Cầu Giấy" })
  city: string;

  @ApiProperty({ description: "Province", example: "Hà Nội" })
  province: string;

  @ApiProperty({ description: "Phone number", example: "02437547817" })
  phone: string;

  @ApiProperty({ description: "Email address", example: "info@vnu.edu.vn" })
  email: string;

  @ApiProperty({ description: "Website URL", example: "https://vnu.edu.vn" })
  website: string;

  @ApiProperty({
    description: "Facebook page URL",
    example: "https://facebook.com/vnu.edu.vn",
  })
  facebook: string;

  @ApiProperty({
    description: "Logo URL",
    example: "https://example.com/logo.png",
  })
  logo_url: string;

  @ApiProperty({
    description: "Banner URL",
    example: "https://example.com/banner.png",
  })
  banner_url: string;

  @ApiProperty({
    description: "University description",
    example: "Trường đại học hàng đầu Việt Nam",
  })
  description: string;

  @ApiProperty({
    description: "University history",
    example: "Lịch sử phát triển của ĐHQGHN...",
  })
  history: string;

  @ApiProperty({
    description: "University mission",
    example: "Sứ mệnh của ĐHQGHN...",
  })
  mission: string;

  @ApiProperty({
    description: "University vision",
    example: "Tầm nhìn của ĐHQGHN...",
  })
  vision: string;

  @ApiProperty({
    description: "University type",
    enum: UniversityType,
    example: UniversityType.PUBLIC,
  })
  type: UniversityType;

  @ApiProperty({
    description: "University status",
    enum: UniversityStatus,
    example: UniversityStatus.ACTIVE,
  })
  status: UniversityStatus;

  @ApiProperty({ description: "Founded year", example: 1906 })
  founded_year: number;

  @ApiProperty({ description: "Accreditation body", example: "Bộ GD&ĐT" })
  accreditation: string;

  @ApiProperty({
    description: "Specializations",
    type: [String],
    example: ["Công nghệ thông tin", "Kinh tế", "Y học"],
  })
  specializations: string[];

  @ApiProperty({
    description: "Facilities",
    type: [String],
    example: ["Thư viện", "Phòng lab", "Ký túc xá"],
  })
  facilities: string[];

  @ApiProperty({
    description: "Achievements",
    type: [String],
    example: ["Top 100 châu Á", "Giải thưởng quốc gia"],
  })
  achievements: string[];

  @ApiProperty({ description: "National ranking", example: "Top 1" })
  ranking_national: string;

  @ApiProperty({
    description: "International ranking",
    example: "Top 500 thế giới",
  })
  ranking_international: string;

  @ApiProperty({ description: "Student count", example: 50000 })
  student_count: number;

  @ApiProperty({ description: "Faculty count", example: 2000 })
  faculty_count: number;

  @ApiProperty({ description: "Acceptance rate (%)", example: 15.5 })
  acceptance_rate: number;

  @ApiProperty({ description: "Minimum tuition fee", example: 5000000 })
  tuition_fee_min: number;

  @ApiProperty({ description: "Maximum tuition fee", example: 15000000 })
  tuition_fee_max: number;

  @ApiProperty({ description: "Currency", example: "VND" })
  currency: string;

  @ApiProperty({
    description: "Admission requirements",
    type: [String],
    example: ["Tốt nghiệp THPT", "Điểm thi đại học"],
  })
  admission_requirements: string[];

  @ApiProperty({
    description: "Scholarships",
    type: [String],
    example: ["Học bổng khuyến khích học tập", "Học bổng tài năng"],
  })
  scholarships: string[];

  @ApiProperty({
    description: "International partnerships",
    type: [String],
    example: ["Đại học Tokyo", "Đại học Harvard"],
  })
  international_partnerships: string[];

  @ApiProperty({
    description: "Campus map URL",
    example: "https://maps.google.com/...",
  })
  campus_map_url: string;

  @ApiProperty({ description: "Latitude", example: 21.0285 })
  latitude: number;

  @ApiProperty({ description: "Longitude", example: 105.8542 })
  longitude: number;

  @ApiProperty({ description: "Is featured university", example: false })
  is_featured: boolean;

  @ApiProperty({ description: "Is verified university", example: false })
  is_verified: boolean;

  @ApiProperty({ description: "View count", example: 1000 })
  view_count: number;

  @ApiProperty({ description: "Total number of reviews", example: 150 })
  review_count: number;

  @ApiProperty({ description: "Average rating score", example: 4.2 })
  average_rating: number;

  @ApiProperty({ description: "Total rating", example: 630 })
  total_rating: number;

  @ApiProperty({
    description: "Created date",
    example: "2024-01-01T00:00:00.000Z",
  })
  created_at: Date;

  @ApiProperty({
    description: "Updated date",
    example: "2024-01-01T00:00:00.000Z",
  })
  updated_at: Date;
}
