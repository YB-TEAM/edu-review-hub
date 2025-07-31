import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { BlogLike } from "../entities/blog-like.entity";

@Injectable()
export class BlogLikeRepository {
  constructor(
    @InjectRepository(BlogLike)
    private readonly repository: Repository<BlogLike>
  ) {}

  async create(data: Partial<BlogLike>): Promise<BlogLike> {
    const like = this.repository.create(data);
    return this.repository.save(like);
  }

  async findByUserAndBlog(
    userId: number,
    blogId: number
  ): Promise<BlogLike | undefined> {
    return this.repository.findOne({
      where: { userId, blogId },
    });
  }

  async findByBlogId(blogId: number): Promise<BlogLike[]> {
    return this.repository.find({
      where: { blogId },
      relations: ["user"],
      order: { createdAt: "DESC" },
    });
  }

  async findByUserId(userId: number): Promise<BlogLike[]> {
    return this.repository.find({
      where: { userId },
      relations: ["blog"],
      order: { createdAt: "DESC" },
    });
  }

  async deleteByUserAndBlog(userId: number, blogId: number): Promise<void> {
    await this.repository.delete({ userId, blogId });
  }

  async countByBlogId(blogId: number): Promise<number> {
    return this.repository.count({ where: { blogId } });
  }

  async hasUserLiked(userId: number, blogId: number): Promise<boolean> {
    const count = await this.repository.count({ where: { userId, blogId } });
    return count > 0;
  }

  async save(data: Partial<BlogLike>): Promise<BlogLike> {
    const like = this.repository.create(data);
    return this.repository.save(like);
  }
}
