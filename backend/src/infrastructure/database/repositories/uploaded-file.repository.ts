import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { UploadedFile, FileStatus } from "../entities/uploaded-file.entity";
import { IUploadedFileRepository } from "@/domain/repositories/uploaded-file.repository.interface";

@Injectable()
export class UploadedFileRepository implements IUploadedFileRepository {
  constructor(
    @InjectRepository(UploadedFile)
    private readonly repository: Repository<UploadedFile>
  ) {}

  create(data: Partial<UploadedFile>): UploadedFile {
    return this.repository.create(data);
  }

  async save(uploadedFile: UploadedFile): Promise<UploadedFile> {
    return this.repository.save(uploadedFile);
  }

  async findById(id: number): Promise<UploadedFile | null> {
    return this.repository.findOne({
      where: { id },
      relations: ["user"],
    });
  }

  async findByPublicId(publicId: string): Promise<UploadedFile | null> {
    return this.repository.findOne({
      where: { publicId },
      relations: ["user"],
    });
  }

  async findByUserId(userId: number): Promise<UploadedFile[]> {
    return this.repository.find({
      where: { userId, status: FileStatus.ACTIVE },
      relations: ["user"],
      order: { createdAt: "DESC" },
    });
  }

  async findAll(): Promise<UploadedFile[]> {
    return this.repository.find({
      where: { status: FileStatus.ACTIVE },
      relations: ["user"],
      order: { createdAt: "DESC" },
    });
  }

  async delete(id: number): Promise<void> {
    await this.repository.update(id, { status: FileStatus.DELETED });
  }

  async hardDelete(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
