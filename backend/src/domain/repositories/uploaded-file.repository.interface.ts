import { UploadedFile } from "@/infrastructure/database/entities/uploaded-file.entity";

export interface IUploadedFileRepository {
  create(data: Partial<UploadedFile>): UploadedFile;
  save(uploadedFile: UploadedFile): Promise<UploadedFile>;
  findById(id: number): Promise<UploadedFile | null>;
  findByPublicId(publicId: string): Promise<UploadedFile | null>;
  findByUserId(userId: number): Promise<UploadedFile[]>;
  findAll(): Promise<UploadedFile[]>;
  delete(id: number): Promise<void>;
  hardDelete(id: number): Promise<void>;
}
