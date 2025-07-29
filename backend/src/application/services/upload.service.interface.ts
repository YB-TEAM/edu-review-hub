import { UploadImageResponseDto } from "../dto/upload/upload-image.dto";

export interface IUploadService {
  uploadImage(
    file: Express.Multer.File,
    folder?: string,
    userId?: number
  ): Promise<UploadImageResponseDto>;
  updateImage(
    publicId: string,
    file: Express.Multer.File,
    userId?: number
  ): Promise<UploadImageResponseDto>;
  deleteImage(publicId: string, userId?: number): Promise<boolean>;
  getImageInfo(publicId: string): Promise<any>;
  getFiles(userId?: number): Promise<UploadImageResponseDto[]>;
}
