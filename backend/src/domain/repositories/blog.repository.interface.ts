import { Blog } from "@/infrastructure/database/entities/blog.entity";

export interface IBlogRepository {
  create(blog: Partial<Blog>): Promise<Blog>;
  findById(id: number): Promise<Blog | null>;
  findAll(): Promise<Blog[]>;
  update(id: number, blog: Partial<Blog>): Promise<Blog>;
  delete(id: number): Promise<void>;
}
