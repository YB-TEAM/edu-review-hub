import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Like, Repository } from "typeorm";
import { Tag } from "../entities/tag.entity";

@Injectable()
export class TagRepository {
  constructor(
    @InjectRepository(Tag)
    private readonly repository: Repository<Tag>
  ) {}

  async create(data: Partial<Tag>): Promise<Tag> {
    const tag = this.repository.create(data);
    return this.repository.save(tag);
  }

  async findById(id: number): Promise<Tag | undefined> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Tag | undefined> {
    return this.repository.findOne({ where: { name } });
  }

  async findAll(): Promise<Tag[]> {
    return this.repository.find({
      where: { isActive: true },
      order: { usageCount: "DESC", name: "ASC" },
    });
  }

  async findAllPaginated(
    limit: number,
    offset: number,
    filters?: { search?: string }
  ): Promise<{ data: Tag[]; total: number }> {
    const where: any = { isActive: true };
    if (filters?.search) {
      where.name = Like(`%${filters.search}%`);
    }

    const [data, total] = await this.repository.findAndCount({
      where,
      order: { usageCount: "DESC", name: "ASC" },
      take: limit,
      skip: offset,
    });
    return { data, total };
  }

  async update(id: number, data: Partial<Tag>): Promise<Tag> {
    await this.repository.update(id, data);
    return this.findById(id) as Promise<Tag>;
  }

  async delete(id: number): Promise<void> {
    await this.repository.update(id, { isActive: false });
  }

  async incrementUsageCount(id: number): Promise<void> {
    await this.repository.increment({ id }, "usageCount", 1);
  }

  async decrementUsageCount(id: number): Promise<void> {
    await this.repository.decrement({ id }, "usageCount", 1);
  }

  async findByIds(ids: number[]): Promise<Tag[]> {
    return this.repository.findByIds(ids);
  }

  async save(data: Partial<Tag>): Promise<Tag> {
    const tag = this.repository.create(data);
    return this.repository.save(tag);
  }
}
