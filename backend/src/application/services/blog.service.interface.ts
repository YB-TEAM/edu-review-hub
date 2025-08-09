import { CreateBlogDto } from "../dto/blog/create-blog.dto";
import { UpdateBlogDto } from "../dto/blog/update-blog.dto";
import { BlogResponseDto } from "@/application/dto/blog/blog-response.dto";
import { ApproveBlogDto, RejectBlogDto, BanBlogDto, UnbanBlogDto } from "../dto/blog/moderate-blog.dto";
import { PaginationDto } from "../dto/pagination/pagination.dto";
import {
  BlogStatus,
  BlogCategory,
} from "@/infrastructure/database/entities/blog.entity";

export interface IBlogService {
  create(
    dto: CreateBlogDto,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<BlogResponseDto>;
  findById(id: number, user?: any): Promise<BlogResponseDto>;
  findAll(
    user: any,
    pagination: PaginationDto,
    filters?: {
      status?: BlogStatus;
      category?: BlogCategory;
      authorId?: number;
      search?: string;
    }
  ): Promise<{ data: BlogResponseDto[]; metadata: any }>;
  update(
    id: number,
    dto: UpdateBlogDto,
    userId: number
  ): Promise<BlogResponseDto>;
  delete(id: number, userId: number): Promise<void>;
  // New specific moderation methods
  approve(
    id: number,
    moderatorId: number,
    dto: ApproveBlogDto
  ): Promise<BlogResponseDto>;
  reject(
    id: number,
    moderatorId: number,
    dto: RejectBlogDto
  ): Promise<BlogResponseDto>;
  ban(
    id: number,
    moderatorId: number,
    dto: BanBlogDto
  ): Promise<BlogResponseDto>;
  unban(
    id: number,
    moderatorId: number,
    dto: UnbanBlogDto
  ): Promise<BlogResponseDto>;
  publish(id: number, userId: number): Promise<BlogResponseDto>;
  like(
    id: number,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<void>;
  getMyBlogs(
    userId: number,
    pagination: PaginationDto
  ): Promise<{ data: BlogResponseDto[]; metadata: any }>;
  getPendingModeration(
    pagination: PaginationDto
  ): Promise<{ data: BlogResponseDto[]; metadata: any }>;
}
