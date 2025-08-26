import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, In } from "typeorm";
import {
  UniversityImage,
  ImageType,
} from "../entities/university-image.entity";

@Injectable()
export class UniversityImageRepository {
  constructor(
    @InjectRepository(UniversityImage)
    private readonly repository: Repository<UniversityImage>
  ) {}

  async create(imageData: Partial<UniversityImage>): Promise<UniversityImage> {
    const image = this.repository.create(imageData);
    return await this.repository.save(image);
  }

  async findById(id: number): Promise<UniversityImage | null> {
    return await this.repository.findOne({
      where: { id },
      relations: ["university"],
    });
  }

  async findByUniversityId(universityId: number): Promise<UniversityImage[]> {
    return await this.repository.find({
      where: { university_id: universityId, is_active: true },
      order: { sort_order: "ASC", created_at: "DESC" },
    });
  }

  async findByUniversityIdAndType(
    universityId: number,
    imageType: ImageType
  ): Promise<UniversityImage[]> {
    return await this.repository.find({
      where: {
        university_id: universityId,
        image_type: imageType,
        is_active: true,
      },
      order: { sort_order: "ASC", created_at: "DESC" },
    });
  }

  async findPrimaryByUniversityIdAndType(
    universityId: number,
    imageType: ImageType
  ): Promise<UniversityImage | null> {
    return await this.repository.findOne({
      where: {
        university_id: universityId,
        image_type: imageType,
        is_primary: true,
        is_active: true,
      },
    });
  }

  async update(
    id: number,
    updateData: Partial<UniversityImage>
  ): Promise<UniversityImage | null> {
    await this.repository.update(id, updateData);
    return await this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }

  async softDelete(id: number): Promise<boolean> {
    const result = await this.repository.update(id, { is_active: false });
    return result.affected > 0;
  }

  async setPrimaryImage(
    universityId: number,
    imageType: ImageType,
    imageId: number
  ): Promise<void> {
    // Reset tất cả ảnh cùng loại thành không phải primary
    await this.repository.update(
      { university_id: universityId, image_type: imageType },
      { is_primary: false }
    );

    // Set ảnh được chọn thành primary
    await this.repository.update(imageId, { is_primary: true });
  }

  async getImageCountByUniversity(universityId: number): Promise<number> {
    return await this.repository.count({
      where: { university_id: universityId, is_active: true },
    });
  }

  async getImagesByType(imageType: ImageType): Promise<UniversityImage[]> {
    return await this.repository.find({
      where: { image_type: imageType, is_active: true },
      relations: ["university"],
      order: { created_at: "DESC" },
    });
  }

  async findInactiveImages(): Promise<UniversityImage[]> {
    return await this.repository.find({
      where: { is_active: false },
      relations: ["university"],
    });
  }

  async bulkUpdateStatus(
    imageIds: number[],
    isActive: boolean
  ): Promise<number> {
    const result = await this.repository.update(
      { id: In(imageIds) },
      { is_active: isActive }
    );
    return result.affected || 0;
  }
}
