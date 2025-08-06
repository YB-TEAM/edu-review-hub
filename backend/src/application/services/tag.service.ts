import {
  Injectable,
  NotFoundException,
  Inject,
  ConflictException,
} from "@nestjs/common";
import { ITagService } from "./tag.service.interface";
import { ITagRepository } from "@/domain/repositories/tag.repository.interface";
import { CreateTagDto } from "../dto/tag/create-tag.dto";
import { UpdateTagDto } from "../dto/tag/update-tag.dto";
import { TagResponseDto } from "../dto/tag/tag-response.dto";
import { Tag } from "@/infrastructure/database/entities/tag.entity";
import { UserActivityRepository } from "@/infrastructure/database/repositories/user-activity.repository";
import { UserDeviceRepository } from "@/infrastructure/database/repositories/user-device.repository";
import { ActivityType } from "@/infrastructure/database/entities/user-activity.entity";

@Injectable()
export class TagService implements ITagService {
  constructor(
    @Inject("ITagRepository")
    private readonly tagRepository: ITagRepository,
    private readonly userActivityRepository: UserActivityRepository,
    private readonly userDeviceRepository: UserDeviceRepository
  ) {}

  async create(
    dto: CreateTagDto,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<TagResponseDto> {
    // Check if tag name already exists
    const existingTag = await this.tagRepository.findByName(dto.name);
    if (existingTag) {
      throw new ConflictException("Tag name already exists");
    }

    const tag = await this.tagRepository.create(dto);

    // Track activity
    try {
      await this.userActivityRepository.create({
        userId: userId,
        activityType: ActivityType.TAG_CREATED,
        description: `Created tag "${dto.name}"`,
        metadata: {
          tagId: tag.id,
          tagName: dto.name,
          tagDescription: dto.description,
          tagColor: dto.color,
        },
        ipAddress: ip,
        userAgent: userAgent,
      });
    } catch (error) {
      console.error("❌ Failed to track activity:", error);
    }

    return this.toResponseDto(tag);
  }

  async findAll(): Promise<TagResponseDto[]> {
    const tags = await this.tagRepository.findAll();
    return tags.map(this.toResponseDto);
  }

  async findById(id: number): Promise<TagResponseDto> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundException("Tag not found");
    }
    return this.toResponseDto(tag);
  }

  async update(
    id: number,
    dto: UpdateTagDto,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<TagResponseDto> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundException("Tag not found");
    }

    // Check if new name conflicts with existing tag
    if (dto.name && dto.name !== tag.name) {
      const existingTag = await this.tagRepository.findByName(dto.name);
      if (existingTag) {
        throw new ConflictException("Tag name already exists");
      }
    }

    const updatedTag = await this.tagRepository.update(id, dto);

    // Track activity
    try {
      await this.userActivityRepository.create({
        userId: userId,
        activityType: ActivityType.TAG_UPDATED,
        description: `Updated tag "${tag.name}" to "${dto.name || tag.name}"`,
        metadata: {
          tagId: tag.id,
          oldTagName: tag.name,
          newTagName: dto.name,
          changes: dto,
        },
        ipAddress: ip,
        userAgent: userAgent,
      });
    } catch (error) {
      console.error("❌ Failed to track activity:", error);
    }

    return this.toResponseDto(updatedTag);
  }

  async delete(
    id: number,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<void> {
    const tag = await this.tagRepository.findById(id);
    if (!tag) {
      throw new NotFoundException("Tag not found");
    }

    // Check if tag is being used
    if (tag.usageCount > 0) {
      throw new ConflictException(
        "Cannot delete tag that is being used by blogs"
      );
    }

    await this.tagRepository.delete(id);

    // Track activity
    try {
      await this.userActivityRepository.create({
        userId: userId,
        activityType: ActivityType.TAG_DELETED,
        description: `Deleted tag "${tag.name}"`,
        metadata: {
          tagId: tag.id,
          tagName: tag.name,
          tagDescription: tag.description,
          tagColor: tag.color,
        },
        ipAddress: ip,
        userAgent: userAgent,
      });
    } catch (error) {
      console.error("❌ Failed to track activity:", error);
    }
  }

  async findByIds(ids: number[]): Promise<TagResponseDto[]> {
    const tags = await this.tagRepository.findByIds(ids);
    return tags.map(this.toResponseDto);
  }

  private toResponseDto(tag: Tag): TagResponseDto {
    return {
      id: tag.id,
      name: tag.name,
      description: tag.description,
      color: tag.color,
      isActive: tag.isActive,
      usageCount: tag.usageCount,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
    };
  }
}
