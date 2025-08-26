import { ApiProperty } from "@nestjs/swagger";
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  IsBoolean,
} from "class-validator";
import { ImageType } from "@/infrastructure/database/entities/university-image.entity";

export class UploadUniversityImageDto {
  @ApiProperty({
    description: "Loại ảnh",
    enum: ImageType,
    example: ImageType.LOGO,
  })
  @IsEnum(ImageType)
  imageType: ImageType;

  @ApiProperty({
    description: "Tiêu đề ảnh",
    example: "Logo chính thức của trường",
    required: false,
  })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    description: "Mô tả ảnh",
    example: "Logo chính thức của trường đại học",
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    description: "Alt text cho ảnh (SEO)",
    example: "Logo trường đại học ABC",
    required: false,
  })
  @IsOptional()
  @IsString()
  altText?: string;

  @ApiProperty({
    description: "Thứ tự sắp xếp",
    example: 1,
    required: false,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  sortOrder?: number;

  @ApiProperty({
    description: "Có phải ảnh chính không",
    example: true,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;
}

export class UniversityImageResponseDto {
  @ApiProperty({ description: "ID của ảnh" })
  id: number;

  @ApiProperty({ description: "ID của trường đại học" })
  universityId: number;

  @ApiProperty({ description: "URL của ảnh" })
  imageUrl: string;

  @ApiProperty({ description: "Cloudinary public ID" })
  cloudinaryPublicId: string;

  @ApiProperty({ description: "Loại ảnh", enum: ImageType })
  imageType: ImageType;

  @ApiProperty({ description: "Tiêu đề ảnh" })
  title?: string;

  @ApiProperty({ description: "Mô tả ảnh" })
  description?: string;

  @ApiProperty({ description: "Alt text" })
  altText?: string;

  @ApiProperty({ description: "Thứ tự sắp xếp" })
  sortOrder: number;

  @ApiProperty({ description: "Có phải ảnh chính không" })
  isPrimary: boolean;

  @ApiProperty({ description: "Trạng thái hoạt động" })
  isActive: boolean;

  @ApiProperty({ description: "Người upload" })
  uploadedBy?: string;

  @ApiProperty({ description: "Thời gian tạo" })
  createdAt: Date;

  @ApiProperty({ description: "Thời gian cập nhật" })
  updatedAt: Date;
}
