import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
} from "@nestjs/common";
import { IBlogService } from "./blog.service.interface";
import { IBlogRepository } from "@/domain/repositories/blog.repository.interface";
import { CreateBlogDto } from "../dto/blog/create-blog.dto";
import { UpdateBlogDto } from "../dto/blog/update-blog.dto";
import { BlogResponseDto } from "../dto/blog/blog-response.dto";
import { Blog } from "@/infrastructure/database/entities/blog.entity";
import { ModerateBlogDto } from "../dto/blog/moderate-blog.dto";

@Injectable()
export class BlogService implements IBlogService {
  constructor(
    @Inject("IBlogRepository")
    private readonly blogRepository: IBlogRepository
  ) {}

  async create(dto: CreateBlogDto, userId: number): Promise<BlogResponseDto> {
    const blog = await this.blogRepository.create({ ...dto });
    return this.toResponseDto(blog);
  }

  async findById(id: number): Promise<BlogResponseDto> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException("Blog not found");
    return this.toResponseDto(blog);
  }

  async findAll(): Promise<BlogResponseDto[]> {
    const blogs = await this.blogRepository.findAll();
    return blogs.map(this.toResponseDto);
  }

  async update(
    id: number,
    dto: UpdateBlogDto,
    userId: number
  ): Promise<BlogResponseDto> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException("Blog not found");
    // TODO: check permission by userId
    const updated = await this.blogRepository.update(id, dto);
    return this.toResponseDto(updated);
  }

  async delete(id: number, userId: number): Promise<void> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException("Blog not found");
    // TODO: check permission by userId
    await this.blogRepository.delete(id);
  }

  async moderate(
    id: number,
    userId: number,
    dto: ModerateBlogDto
  ): Promise<BlogResponseDto> {
    // TODO: implement moderate logic
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException("Blog not found");
    // TODO: check permission by userId, update status/reason
    return this.toResponseDto(blog);
  }

  private toResponseDto(blog: Blog): BlogResponseDto {
    return {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      image: blog.image,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  }
}
