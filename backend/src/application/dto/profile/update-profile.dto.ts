import { IsString, IsOptional, IsDateString, MaxLength } from "class-validator";
import { ApiPropertyOptional } from "@nestjs/swagger";

export class UpdateProfileDto {
  @ApiPropertyOptional({ description: "Họ" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @ApiPropertyOptional({ description: "Tên" })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({ description: "Tên hiển thị" })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  displayName?: string;

  @ApiPropertyOptional({ description: "URL avatar" })
  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiPropertyOptional({ description: "URL ảnh bìa" })
  @IsOptional()
  @IsString()
  coverImageUrl?: string;

  @ApiPropertyOptional({ description: "Bio" })
  @IsOptional()
  @IsString()
  bio?: string;

  @ApiPropertyOptional({ description: "Ngày sinh" })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiPropertyOptional({ description: "Giới tính" })
  @IsOptional()
  @IsString()
  gender?: string;

  @ApiPropertyOptional({ description: "Quốc gia" })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiPropertyOptional({ description: "Thành phố" })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: "Địa chỉ" })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ description: "Múi giờ" })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({ description: "Ngôn ngữ" })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiPropertyOptional({ description: "Tên trường đại học" })
  @IsOptional()
  @IsString()
  universityName?: string;

  @ApiPropertyOptional({ description: "Chuyên ngành" })
  @IsOptional()
  @IsString()
  major?: string;

  @ApiPropertyOptional({ description: "Năm tốt nghiệp" })
  @IsOptional()
  graduationYear?: number;

  @ApiPropertyOptional({ description: "Mã sinh viên" })
  @IsOptional()
  @IsString()
  studentId?: string;

  @ApiPropertyOptional({ description: "Đã xác thực sinh viên" })
  @IsOptional()
  isStudentVerified?: boolean;

  @ApiPropertyOptional({ description: "Cài đặt riêng tư" })
  @IsOptional()
  privacySettings?: any;

  @ApiPropertyOptional({ description: "Cài đặt thông báo" })
  @IsOptional()
  notificationSettings?: any;
}
