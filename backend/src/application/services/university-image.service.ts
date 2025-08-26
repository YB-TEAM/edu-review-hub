import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  UniversityImage,
  ImageType,
} from "@/infrastructure/database/entities/university-image.entity";
import { UniversityImageRepository } from "@/infrastructure/database/repositories/university-image.repository";
import { CloudinaryService } from "@/infrastructure/services/cloudinary.service";
import {
  UploadUniversityImageDto,
  UniversityImageResponseDto,
} from "@/application/dto/university/upload-university-image.dto";

@Injectable()
export class UniversityImageService {
  constructor(
    @InjectRepository(UniversityImage)
    private readonly imageRepository: Repository<UniversityImage>,
    private readonly universityImageRepository: UniversityImageRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async uploadImage(
    universityId: number,
    file: Express.Multer.File,
    uploadData: UploadUniversityImageDto,
    userId: number,
    ipAddress: string,
    userAgent: string
  ): Promise<UniversityImageResponseDto> {
    // Upload ảnh lên Cloudinary
    const folder = `universities/${universityId}/${uploadData.imageType}`;
    const result = await this.cloudinaryService.uploadImage(file, folder);

    // Tạo record trong database
    const imageData: Partial<UniversityImage> = {
      university_id: universityId,
      image_url: result.secure_url,
      cloudinary_public_id: result.public_id,
      image_type: uploadData.imageType,
      title: uploadData.title,
      description: uploadData.description,
      alt_text: uploadData.altText,
      sort_order: uploadData.sortOrder || 0,
      is_primary: uploadData.isPrimary || false,
      uploaded_by: userId.toString(),
      ip_address: ipAddress,
      user_agent: userAgent,
    };

    // Nếu đây là ảnh primary, reset các ảnh khác cùng loại
    if (uploadData.isPrimary) {
      await this.universityImageRepository.setPrimaryImage(
        universityId,
        uploadData.imageType,
        0 // Sẽ được set sau khi tạo
      );
    }

    const image = await this.universityImageRepository.create(imageData);

    // Nếu đây là ảnh primary, set primary cho ảnh vừa tạo
    if (uploadData.isPrimary) {
      await this.universityImageRepository.setPrimaryImage(
        universityId,
        uploadData.imageType,
        image.id
      );
    }

    return this.mapToResponseDto(image);
  }

  async updateImage(
    imageId: number,
    updateData: Partial<UploadUniversityImageDto>,
    userId: number,
    ipAddress: string,
    userAgent: string
  ): Promise<UniversityImageResponseDto> {
    const image = await this.universityImageRepository.findById(imageId);
    if (!image) {
      throw new NotFoundException("Image not found");
    }

    // Nếu thay đổi isPrimary, cần reset các ảnh khác
    if (updateData.isPrimary && !image.is_primary) {
      await this.universityImageRepository.setPrimaryImage(
        image.university_id,
        image.image_type,
        imageId
      );
    }

    const updateFields: Partial<UniversityImage> = {
      title: updateData.title,
      description: updateData.description,
      alt_text: updateData.altText,
      sort_order: updateData.sortOrder,
      is_primary: updateData.isPrimary,
    };

    const updatedImage = await this.universityImageRepository.update(
      imageId,
      updateFields
    );

    if (!updatedImage) {
      throw new NotFoundException("Failed to update image");
    }

    return this.mapToResponseDto(updatedImage);
  }

  async deleteImage(imageId: number, userId: number): Promise<void> {
    const image = await this.universityImageRepository.findById(imageId);
    if (!image) {
      throw new NotFoundException("Image not found");
    }

    // Xóa ảnh khỏi Cloudinary
    try {
      await this.cloudinaryService.deleteImage(image.cloudinary_public_id);
    } catch (error) {
      console.error("Failed to delete image from Cloudinary:", error);
    }

    // Xóa record khỏi database
    await this.universityImageRepository.delete(imageId);
  }

  async getImagesByUniversity(
    universityId: number
  ): Promise<UniversityImageResponseDto[]> {
    const images =
      await this.universityImageRepository.findByUniversityId(universityId);
    return images.map((image) => this.mapToResponseDto(image));
  }

  async getImagesByUniversityAndType(
    universityId: number,
    imageType: ImageType
  ): Promise<UniversityImageResponseDto[]> {
    const images =
      await this.universityImageRepository.findByUniversityIdAndType(
        universityId,
        imageType
      );
    return images.map((image) => this.mapToResponseDto(image));
  }

  async getPrimaryImage(
    universityId: number,
    imageType: ImageType
  ): Promise<UniversityImageResponseDto | null> {
    const image =
      await this.universityImageRepository.findPrimaryByUniversityIdAndType(
        universityId,
        imageType
      );
    return image ? this.mapToResponseDto(image) : null;
  }

  async setPrimaryImage(
    universityId: number,
    imageType: ImageType,
    imageId: number
  ): Promise<void> {
    const image = await this.universityImageRepository.findById(imageId);
    if (!image) {
      throw new NotFoundException("Image not found");
    }

    if (image.university_id !== universityId) {
      throw new BadRequestException("Image does not belong to this university");
    }

    if (image.image_type !== imageType) {
      throw new BadRequestException("Image type mismatch");
    }

    await this.universityImageRepository.setPrimaryImage(
      universityId,
      imageType,
      imageId
    );
  }

  async reorderImages(
    universityId: number,
    imageOrders: { imageId: number; sortOrder: number }[]
  ): Promise<void> {
    for (const order of imageOrders) {
      await this.universityImageRepository.update(order.imageId, {
        sort_order: order.sortOrder,
      });
    }
  }

  async bulkUpdateStatus(
    imageIds: number[],
    isActive: boolean
  ): Promise<number> {
    return await this.universityImageRepository.bulkUpdateStatus(
      imageIds,
      isActive
    );
  }

  async getImageStats(universityId: number): Promise<{
    totalImages: number;
    imagesByType: Record<ImageType, number>;
    primaryImages: Record<ImageType, string | null>;
  }> {
    const images =
      await this.universityImageRepository.findByUniversityId(universityId);

    const imagesByType: Record<ImageType, number> = {
      [ImageType.LOGO]: 0,
      [ImageType.BANNER]: 0,
      [ImageType.CAMPUS]: 0,
      [ImageType.FACILITY]: 0,
      [ImageType.EVENT]: 0,
      [ImageType.OTHER]: 0,
    };

    const primaryImages: Record<ImageType, string | null> = {
      [ImageType.LOGO]: null,
      [ImageType.BANNER]: null,
      [ImageType.CAMPUS]: null,
      [ImageType.FACILITY]: null,
      [ImageType.EVENT]: null,
      [ImageType.OTHER]: null,
    };

    images.forEach((image) => {
      imagesByType[image.image_type]++;
      if (image.is_primary) {
        primaryImages[image.image_type] = image.image_url;
      }
    });

    return {
      totalImages: images.length,
      imagesByType,
      primaryImages,
    };
  }

  private mapToResponseDto(image: UniversityImage): UniversityImageResponseDto {
    return {
      id: image.id,
      universityId: image.university_id,
      imageUrl: image.image_url,
      cloudinaryPublicId: image.cloudinary_public_id,
      imageType: image.image_type,
      title: image.title,
      description: image.description,
      altText: image.alt_text,
      sortOrder: image.sort_order,
      isPrimary: image.is_primary,
      isActive: image.is_active,
      uploadedBy: image.uploaded_by,
      createdAt: image.created_at,
      updatedAt: image.updated_at,
    };
  }
}
