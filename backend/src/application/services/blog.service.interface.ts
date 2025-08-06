import { CreateBlogDto } from "../dto/blog/create-blog.dto";
import { UpdateBlogDto } from "../dto/blog/update-blog.dto";
import { BlogResponseDto } from "@/application/dto/blog/blog-response.dto";
import {
  ModerateBlogDto,
  ApproveBlogDto,
  RejectBlogDto,
  BanBlogDto,
} from "../dto/blog/moderate-blog.dto";
import { PaginationDto } from "../dto/pagination/pagination.dto";
import {
  BlogStatus,
  BlogCategory,
} from "@/infrastructure/database/entities/blog.entity";
import { PublishBlogDto } from "../dto/blog/publish-blog.dto";

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
      tagIds?: string;
    }
  ): Promise<{ data: BlogResponseDto[]; metadata: any }>;
  
  update(
    id: number,
    dto: UpdateBlogDto,
    userId: number
  ): Promise<BlogResponseDto>;
  
  delete(id: number, userId: number): Promise<void>;
  
  moderate(
    id: number,
    moderatorId: number,
    dto: ModerateBlogDto
  ): Promise<BlogResponseDto>;
  
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
  
  publish(id: number, userId: number): Promise<BlogResponseDto>;
  
  publishBlog(
    id: number,
    userId: number,
    dto: PublishBlogDto
  ): Promise<BlogResponseDto>;
  
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
  
  findMyDrafts(userId: number, pagination: PaginationDto): Promise<{ data: BlogResponseDto[]; metadata: any }>;
  
  findForModeration(pagination: PaginationDto): Promise<{ data: BlogResponseDto[]; metadata: any }>;
}
