import { Blog } from "@/infrastructure/database/entities/blog.entity";

export interface IBlogRepository {
  create(blog: Partial<Blog>): Promise<Blog>;
  findById(id: number): Promise<Blog | null>;
  findAll(params?: { page?: number; limit?: number }): Promise<[Blog[], number]>;
  update(id: number, blog: Partial<Blog>): Promise<Blog>;
  delete(id: number): Promise<void>;
}
