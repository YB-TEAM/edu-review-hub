import { Injectable, Inject } from "@nestjs/common";
import { IUploadService } from "./upload.service.interface";
import {
  CloudinaryService,
  CloudinaryUploadResult,
} from "@/infrastructure/services/cloudinary.service";
import { UploadImageResponseDto } from "../dto/upload/upload-image.dto";
import { IUserActivityRepository } from "@/domain/repositories/user-activity.repository.interface";
import { ActivityType } from "@/infrastructure/database/entities/user-activity.entity";
import { IUploadedFileRepository } from "@/domain/repositories/uploaded-file.repository.interface";

@Injectable()
export class UploadService implements IUploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryService,
    @Inject("IUserActivityRepository")
    private readonly userActivityRepository: IUserActivityRepository,
    @Inject("IUploadedFileRepository")
    private readonly uploadedFileRepository: IUploadedFileRepository
  ) {}

  async uploadImage(
    file: Express.Multer.File,
    folder = "edu-review-hub",
    userId?: number
  ): Promise<UploadImageResponseDto> {
    const result: CloudinaryUploadResult =
      await this.cloudinaryService.uploadImage(file, folder);

    // Save to database if userId is provided
    if (userId) {
      const uploadedFile = this.uploadedFileRepository.create({
        publicId: result.public_id,
        secureUrl: result.secure_url,
        url: result.url,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        width: result.width,
        height: result.height,
        format: result.format,
        folder,
        userId,
      });
      await this.uploadedFileRepository.save(uploadedFile);

      // Track activity
      await this.userActivityRepository.create({
        userId,
        activityType: ActivityType.UPLOAD_IMAGE,
        description: `Uploaded image: ${result.public_id}`,
        metadata: {
          publicId: result.public_id,
          fileName: file.originalname,
          fileSize: file.size,
          fileType: file.mimetype,
          folder,
        },
      });
    }

    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      createdAt: result.created_at,
    };
  }

  async updateImage(
    publicId: string,
    file: Express.Multer.File,
    userId?: number
  ): Promise<UploadImageResponseDto> {
    const result: CloudinaryUploadResult =
      await this.cloudinaryService.updateImage(publicId, file);

    // Track activity if userId is provided
    if (userId) {
      await this.userActivityRepository.create({
        userId,
        activityType: ActivityType.UPDATE_IMAGE,
        description: `Updated image: ${publicId}`,
        metadata: {
          publicId: result.public_id,
          oldPublicId: publicId,
          fileName: file.originalname,
          fileSize: file.size,
          fileType: file.mimetype,
        },
      });
    }

    return {
      publicId: result.public_id,
      secureUrl: result.secure_url,
      url: result.url,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes,
      createdAt: result.created_at,
    };
  }

  async deleteImage(publicId: string, userId?: number): Promise<boolean> {
    const result = await this.cloudinaryService.deleteImage(publicId);

    // Track activity if userId is provided
    if (userId) {
      await this.userActivityRepository.create({
        userId,
        activityType: ActivityType.DELETE_IMAGE,
        description: `Deleted image: ${publicId}`,
        metadata: {
          publicId,
          success: result,
        },
      });
    }

    return result;
  }

  async getFiles(userId?: number): Promise<UploadImageResponseDto[]> {
    if (!userId) {
      return [];
    }

    const files = await this.uploadedFileRepository.findByUserId(userId);

    return files.map((file) => ({
      publicId: file.publicId,
      secureUrl: file.secureUrl,
      url: file.url,
      width: file.width,
      height: file.height,
      format: file.format,
      bytes: file.fileSize,
      createdAt: file.createdAt.toISOString(),
    }));
  }

  async getImageInfo(publicId: string): Promise<any> {
    return await this.cloudinaryService.getImageInfo(publicId);
  }
}
