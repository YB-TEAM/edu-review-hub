import { Tag } from "@/infrastructure/database/entities/tag.entity";

export interface ITagRepository {
  create(data: Partial<Tag>): Promise<Tag>;
  findById(id: number): Promise<Tag | undefined>;
  findByName(name: string): Promise<Tag | undefined>;
  findAll(): Promise<Tag[]>;
  findAllPaginated(
    limit: number,
    offset: number,
    filters?: { search?: string }
  ): Promise<{ data: Tag[]; total: number }>;
  update(id: number, data: Partial<Tag>): Promise<Tag>;
  delete(id: number): Promise<void>;
  incrementUsageCount(id: number): Promise<void>;
  decrementUsageCount(id: number): Promise<void>;
  findByIds(ids: number[]): Promise<Tag[]>;
  save(data: Partial<Tag>): Promise<Tag>;
}
