import { ApiProperty } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsArray,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsUrl,
  Min,
  Max,
} from "class-validator";
import {
  UniversityType,
  UniversityStatus,
} from "../../../infrastructure/database/entities/university.entity";

export class CreateUniversityDto {
  @ApiProperty({
    example: "Đại học Quốc gia Hà Nội",
    description: "University name",
  })
  @IsString()
  name: string;

  @ApiProperty({
    example: "ĐHQGHN",
    required: false,
    description: "Short name/abbreviation",
  })
  @IsOptional()
  @IsString()
  short_name?: string;

  @ApiProperty({
    example: "Vietnam National University, Hanoi",
    required: false,
    description: "English name",
  })
  @IsOptional()
  @IsString()
  english_name?: string;

  @ApiProperty({
    example: "144 Xuân Thủy, Cầu Giấy, Hà Nội",
    required: false,
    description: "Full address",
  })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiProperty({
    example: ["Hà Nội"],
    required: false,
    type: [String],
    description: "Location/provinces",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  location?: string[];

  @ApiProperty({
    example: "Cầu Giấy",
    required: false,
    description: "City",
  })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiProperty({
    example: "Hà Nội",
    required: false,
    description: "Province",
  })
  @IsOptional()
  @IsString()
  province?: string;

  @ApiProperty({
    example: "02437547817",
    required: false,
    description: "Phone number",
  })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({
    example: "info@vnu.edu.vn",
    required: false,
    description: "Email address",
  })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiProperty({
    example: "https://vnu.edu.vn",
    required: false,
    description: "Website URL",
  })
  @IsOptional()
  @IsUrl()
  website?: string;

  @ApiProperty({
    example: "https://facebook.com/vnu.edu.vn",
    required: false,
    description: "Facebook page URL",
  })
  @IsOptional()
  @IsUrl()
  facebook?: string;

  @ApiProperty({
    example: "https://example.com/logo.png",
    required: false,
    description: "Logo URL",
  })
  @IsOptional()
  @IsUrl()
  logo_url?: string;

  @ApiProperty({
    example: "https://example.com/banner.png",
    required: false,
    description: "Banner URL",
  })
  @IsOptional()
  @IsUrl()
  banner_url?: string;

  @ApiProperty({
    example: "Trường đại học hàng đầu Việt Nam",
    required: false,
    description: "University description",
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: "Lịch sử phát triển của ĐHQGHN...",
    required: false,
    description: "University history",
  })
  @IsOptional()
  @IsString()
  history?: string;

  @ApiProperty({
    example: "Sứ mệnh của ĐHQGHN...",
    required: false,
    description: "University mission",
  })
  @IsOptional()
  @IsString()
  mission?: string;

  @ApiProperty({
    example: "Tầm nhìn của ĐHQGHN...",
    required: false,
    description: "University vision",
  })
  @IsOptional()
  @IsString()
  vision?: string;

  @ApiProperty({
    example: UniversityType.PUBLIC,
    enum: UniversityType,
    required: false,
    description: "University type",
  })
  @IsOptional()
  @IsEnum(UniversityType)
  type?: UniversityType;

  @ApiProperty({
    example: UniversityStatus.ACTIVE,
    enum: UniversityStatus,
    required: false,
    description: "University status",
  })
  @IsOptional()
  @IsEnum(UniversityStatus)
  status?: UniversityStatus;

  @ApiProperty({
    example: 1906,
    required: false,
    description: "Founded year",
  })
  @IsOptional()
  @IsNumber()
  founded_year?: number;

  @ApiProperty({
    example: "Bộ GD&ĐT",
    required: false,
    description: "Accreditation body",
  })
  @IsOptional()
  @IsString()
  accreditation?: string;

  @ApiProperty({
    example: ["Công nghệ thông tin", "Kinh tế", "Y học"],
    required: false,
    type: [String],
    description: "Specializations",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  specializations?: string[];

  @ApiProperty({
    example: ["Thư viện", "Phòng lab", "Ký túc xá"],
    required: false,
    type: [String],
    description: "Facilities",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  facilities?: string[];

  @ApiProperty({
    example: ["Top 100 châu Á", "Giải thưởng quốc gia"],
    required: false,
    type: [String],
    description: "Achievements",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  achievements?: string[];

  @ApiProperty({
    example: "Top 1",
    required: false,
    description: "National ranking",
  })
  @IsOptional()
  @IsString()
  ranking_national?: string;

  @ApiProperty({
    example: "Top 500 thế giới",
    required: false,
    description: "International ranking",
  })
  @IsOptional()
  @IsString()
  ranking_international?: string;

  @ApiProperty({
    example: 50000,
    required: false,
    description: "Student count",
  })
  @IsOptional()
  @IsNumber()
  student_count?: number;

  @ApiProperty({
    example: 2000,
    required: false,
    description: "Faculty count",
  })
  @IsOptional()
  @IsNumber()
  faculty_count?: number;

  @ApiProperty({
    example: 15.5,
    required: false,
    description: "Acceptance rate (%)",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  acceptance_rate?: number;

  @ApiProperty({
    example: 5000000,
    required: false,
    description: "Minimum tuition fee",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tuition_fee_min?: number;

  @ApiProperty({
    example: 15000000,
    required: false,
    description: "Maximum tuition fee",
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  tuition_fee_max?: number;

  @ApiProperty({
    example: "VND",
    required: false,
    description: "Currency",
  })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({
    example: ["Tốt nghiệp THPT", "Điểm thi đại học"],
    required: false,
    type: [String],
    description: "Admission requirements",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  admission_requirements?: string[];

  @ApiProperty({
    example: ["Học bổng khuyến khích học tập", "Học bổng tài năng"],
    required: false,
    type: [String],
    description: "Scholarships",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  scholarships?: string[];

  @ApiProperty({
    example: ["Đại học Tokyo", "Đại học Harvard"],
    required: false,
    type: [String],
    description: "International partnerships",
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  international_partnerships?: string[];

  @ApiProperty({
    example: "https://maps.google.com/...",
    required: false,
    description: "Campus map URL",
  })
  @IsOptional()
  @IsUrl()
  campus_map_url?: string;

  @ApiProperty({
    example: 21.0285,
    required: false,
    description: "Latitude",
  })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({
    example: 105.8542,
    required: false,
    description: "Longitude",
  })
  @IsOptional()
  @IsNumber()
  longitude?: number;

  @ApiProperty({
    example: false,
    required: false,
    description: "Is featured university",
  })
  @IsOptional()
  @IsBoolean()
  is_featured?: boolean;

  @ApiProperty({
    example: false,
    required: false,
    description: "Is verified university",
  })
  @IsOptional()
  @IsBoolean()
  is_verified?: boolean;
}
