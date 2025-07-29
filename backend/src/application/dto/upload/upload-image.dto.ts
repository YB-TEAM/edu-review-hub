import { ApiProperty } from "@nestjs/swagger";

export class UploadImageResponseDto {
  @ApiProperty({
    description: "Cloudinary public ID",
    example: "edu-review-hub/abc123",
  })
  publicId: string;

  @ApiProperty({
    description: "Secure URL of the uploaded image",
    example:
      "https://res.cloudinary.com/example/image/upload/v123/edu-review-hub/abc123.jpg",
  })
  secureUrl: string;

  @ApiProperty({
    description: "Regular URL of the uploaded image",
    example:
      "http://res.cloudinary.com/example/image/upload/v123/edu-review-hub/abc123.jpg",
  })
  url: string;

  @ApiProperty({
    description: "Image width in pixels",
    example: 1920,
  })
  width: number;

  @ApiProperty({
    description: "Image height in pixels",
    example: 1080,
  })
  height: number;

  @ApiProperty({
    description: "Image format",
    example: "jpg",
  })
  format: string;

  @ApiProperty({
    description: "File size in bytes",
    example: 1024000,
  })
  bytes: number;

  @ApiProperty({
    description: "Upload timestamp",
    example: "2025-01-29T10:30:00.000Z",
  })
  createdAt: string;
}
