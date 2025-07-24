import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blog } from "../entities/blog.entity";
import { IBlogRepository } from "@/domain/repositories/blog.repository.interface";

@Injectable()
export class BlogRepository implements IBlogRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly repo: Repository<Blog>
  ) {}

  async create(blog: Partial<Blog>): Promise<Blog> {
    return this.repo.save(blog);
  }

  async findById(id: number): Promise<Blog | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findAll(params?: { page?: number; limit?: number }): Promise<[Blog[], number]> {
    if (params && params.page && params.limit) {
      const { page, limit } = params;
      return this.repo.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
        order: { createdAt: "DESC" },
      });
    }
    return this.repo.findAndCount({ order: { createdAt: "DESC" } });
  }

  async update(id: number, blog: Partial<Blog>): Promise<Blog> {
    await this.repo.update(id, blog);
    return this.findById(id) as Promise<Blog>;
  }

  async delete(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }
}
