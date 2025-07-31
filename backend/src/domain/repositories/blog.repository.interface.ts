import {
  Blog,
  BlogStatus,
  BlogCategory,
} from "@/infrastructure/database/entities/blog.entity";

export interface IBlogRepository {
  create(blog: Partial<Blog>): Promise<Blog>;
  findById(id: number): Promise<Blog | null>;
  findAll(params?: {
    page?: number;
    limit?: number;
    filters?: {
      status?: BlogStatus;
      category?: BlogCategory;
      authorId?: number;
      search?: string;
      tagIds?: string;
    };
  }): Promise<[Blog[], number]>;
  update(id: number, blog: Partial<Blog>): Promise<Blog>;
  delete(id: number): Promise<void>;
  incrementViewCount(id: number): Promise<void>;
  toggleLike(id: number, userId: number): Promise<void>;
}
