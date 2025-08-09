import { TagResponseDto } from "../dto/tag/tag-response.dto";
import { CreateTagDto } from "../dto/tag/create-tag.dto";
import { UpdateTagDto } from "../dto/tag/update-tag.dto";

export interface ITagService {
  create(
    dto: CreateTagDto,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<TagResponseDto>;
  findAll(): Promise<TagResponseDto[]>;
  findAllPaginated(
    pagination: { page?: number; limit?: number },
    filters?: { search?: string }
  ): Promise<{ data: TagResponseDto[]; metadata: any }>;
  findById(id: number): Promise<TagResponseDto>;
  update(
    id: number,
    dto: UpdateTagDto,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<TagResponseDto>;
  delete(
    id: number,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<void>;
  findByIds(ids: number[]): Promise<TagResponseDto[]>;
}
