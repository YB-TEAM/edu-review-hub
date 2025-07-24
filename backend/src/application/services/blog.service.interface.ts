import { CreateBlogDto } from "../dto/blog/create-blog.dto";
import { UpdateBlogDto } from "../dto/blog/update-blog.dto";
import { BlogResponseDto } from "@/application/dto/blog/blog-response.dto";
import { ModerateBlogDto } from "../dto/blog/moderate-blog.dto";
import { PaginationDto } from "../dto/pagination/pagination.dto";

export interface IBlogService {
  create(dto: CreateBlogDto, userId: number): Promise<BlogResponseDto>;
  findById(id: number): Promise<BlogResponseDto>;
  findAll(pagination: PaginationDto): Promise<{ data: BlogResponseDto[]; metadata: any }>;
  update(
    id: number,
    dto: UpdateBlogDto,
    userId: number
  ): Promise<BlogResponseDto>;
  delete(id: number, userId: number): Promise<void>;
  moderate(
    id: number,
    userId: number,
    dto: ModerateBlogDto
  ): Promise<BlogResponseDto>;
}
