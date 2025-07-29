import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blog, BlogStatus, BlogCategory } from "../entities/blog.entity";
import { IBlogRepository } from "@/domain/repositories/blog.repository.interface";

@Injectable()
export class BlogRepository implements IBlogRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly repo: Repository<Blog>
  ) {}

  async create(blog: Partial<Blog>): Promise<Blog> {
    // Extract tags from blog data
    const { tags, ...blogData } = blog;

    // Create blog without tags first
    const createdBlog = await this.repo.save(blogData);

    // If tags are provided, add them to the blog
    if (tags && tags.length > 0) {
      createdBlog.tags = tags;
      await this.repo.save(createdBlog);
    }

    // Return blog with relations
    return this.findById(createdBlog.id) as Promise<Blog>;
  }

  async findById(id: number): Promise<Blog | null> {
    return this.repo.findOne({
      where: { id },
      relations: ["author", "moderator", "tags"],
    });
  }

  async findAll(params?: {
    page?: number;
    limit?: number;
    filters?: {
      status?: BlogStatus;
      category?: BlogCategory;
      authorId?: number;
      search?: string;
      tagIds?: string;
    };
  }): Promise<[Blog[], number]> {
    const queryBuilder = this.repo
      .createQueryBuilder("blog")
      .leftJoinAndSelect("blog.author", "author")
      .leftJoinAndSelect("blog.moderator", "moderator")
      .leftJoinAndSelect("blog.tags", "tags");

    // Apply filters
    if (params?.filters) {
      const { status, category, authorId, search, tagIds } = params.filters;

      if (status) {
        queryBuilder.andWhere("blog.status = :status", { status });
      }

      if (category) {
        queryBuilder.andWhere("blog.category = :category", { category });
      }

      if (authorId) {
        queryBuilder.andWhere("blog.authorId = :authorId", { authorId });
      }

      if (search) {
        queryBuilder.andWhere(
          "(blog.title ILIKE :search OR blog.content ILIKE :search OR blog.excerpt ILIKE :search)",
          { search: `%${search}%` }
        );
      }

      if (tagIds) {
        const tagIdArray = tagIds.split(",").map((id) => parseInt(id.trim()));
        queryBuilder.andWhere("tags.id IN (:...tagIds)", {
          tagIds: tagIdArray,
        });
      }
    }

    queryBuilder.orderBy("blog.createdAt", "DESC");

    if (params?.page && params?.limit) {
      const { page, limit } = params;
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    return queryBuilder.getManyAndCount();
  }

  async update(id: number, blog: Partial<Blog>): Promise<Blog> {
    await this.repo.update(id, blog);
    return this.findById(id) as Promise<Blog>;
  }

  async delete(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.repo.increment({ id }, "viewCount", 1);
  }

  async toggleLike(id: number, userId: number): Promise<void> {
    // This is a placeholder - in a real implementation, you'd have a separate likes table
    // For now, we'll just increment the like count
    await this.repo.increment({ id }, "likeCount", 1);
  }
}
