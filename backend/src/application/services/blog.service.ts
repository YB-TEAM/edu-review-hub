import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  Inject,
  BadRequestException,
} from "@nestjs/common";
import { IBlogService } from "./blog.service.interface";
import { IBlogRepository } from "@/domain/repositories/blog.repository.interface";
import { ITagRepository } from "@/domain/repositories/tag.repository.interface";
import { BlogLikeRepository } from "@/infrastructure/database/repositories/blog-like.repository";
import { UserActivityRepository } from "@/infrastructure/database/repositories/user-activity.repository";
import { ActivityType } from "@/infrastructure/database/entities/user-activity.entity";
import { CreateBlogDto } from "../dto/blog/create-blog.dto";
import { UpdateBlogDto } from "../dto/blog/update-blog.dto";
import { BlogResponseDto } from "../dto/blog/blog-response.dto";
import {
  Blog,
  BlogStatus,
  BlogCategory,
} from "@/infrastructure/database/entities/blog.entity";
import { ModerateBlogDto } from "../dto/blog/moderate-blog.dto";
import { PaginationDto } from "../dto/pagination/pagination.dto";
import { UserRole } from "@/infrastructure/database/entities/user.entity";
import { CloudinaryService } from "@/infrastructure/services/cloudinary.service";

@Injectable()
export class BlogService implements IBlogService {
  constructor(
    @Inject("IBlogRepository")
    private readonly blogRepository: IBlogRepository,
    @Inject("ITagRepository")
    private readonly tagRepository: ITagRepository,
    private readonly blogLikeRepository: BlogLikeRepository,
    private readonly userActivityRepository: UserActivityRepository,
    private readonly cloudinaryService: CloudinaryService
  ) {}

  async create(
    dto: CreateBlogDto,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<BlogResponseDto> {
    // Handle tags if provided
    let tags = [];
    if (dto.tagIds && dto.tagIds.length > 0) {
      tags = await this.tagRepository.findByIds(dto.tagIds);
      // Increment usage count for each tag
      for (const tag of tags) {
        await this.tagRepository.incrementUsageCount(tag.id);
      }
    }

    // Handle featuredImage if provided (should be Cloudinary public_id)
    let featuredImage = null;
    if (dto.featuredImage) {
      // Validate that the image exists on Cloudinary
      try {
        await this.cloudinaryService.getImageInfo(dto.featuredImage);
        featuredImage = dto.featuredImage;
      } catch (error) {
        throw new BadRequestException(
          "Invalid featured image. Image not found on Cloudinary."
        );
      }
    }

    const blog = await this.blogRepository.create({
      ...dto,
      featuredImage,
      authorId: userId,
      status: BlogStatus.DRAFT,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      tags: tags,
    });

    // Track activity
    try {
      await this.userActivityRepository.create({
        userId: userId,
        activityType: ActivityType.BLOG_CREATED,
        description: `Created blog "${dto.title}"`,
        metadata: {
          blogId: blog.id,
          blogTitle: dto.title,
          blogCategory: dto.category,
          tagIds: dto.tagIds,
          tagCount: tags.length,
        },
        ipAddress: ip,
        userAgent: userAgent,
      });
      console.log("✅ Activity tracked: BLOG_CREATED for user", userId);
    } catch (error) {
      console.error("❌ Failed to track activity:", error);
    }

    return this.toResponseDto(blog);
  }

  async findById(id: number, user?: any): Promise<BlogResponseDto> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException("Blog not found");

    // Check if user is admin/moderator
    const isAdmin = user?.roles?.some(
      (role: any) =>
        role.name === "admin" ||
        role.name === "moderator" ||
        role.name === "super_admin"
    );

    // If not admin and blog is not published, deny access
    if (!isAdmin && blog.status !== BlogStatus.PUBLISHED) {
      throw new ForbiddenException("Blog not accessible");
    }

    // Increment view count
    await this.blogRepository.incrementViewCount(id);

    return this.toResponseDto(blog);
  }

  async findAll(
    user: any,
    pagination: PaginationDto,
    filters?: {
      status?: BlogStatus;
      category?: BlogCategory;
      authorId?: number;
      search?: string;
      tagIds?: string;
    }
  ): Promise<{ data: BlogResponseDto[]; metadata: any }> {
    // For public API, always show only approved blogs
    filters = { ...filters, status: BlogStatus.APPROVED };

    const { page = 1, limit = 10 } = pagination;
    const [blogs, total] = await this.blogRepository.findAll({
      page,
      limit,
      filters,
    });

    const data = blogs.map((blog) => this.toResponseDto(blog));
    const metadata = {
      totalItems: total,
      pageSize: limit,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
    return { data, metadata };
  }

  async update(
    id: number,
    dto: UpdateBlogDto,
    userId: number
  ): Promise<BlogResponseDto> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException("Blog not found");

    // Check if user is the author or has admin privileges
    if (blog.authorId !== userId) {
      throw new ForbiddenException("You can only edit your own blogs");
    }

    // Handle featuredImage if provided
    if (dto.featuredImage !== undefined) {
      if (dto.featuredImage) {
        // Validate that the new image exists on Cloudinary
        try {
          await this.cloudinaryService.getImageInfo(dto.featuredImage);
        } catch (error) {
          throw new BadRequestException(
            "Invalid featured image. Image not found on Cloudinary."
          );
        }
      }
      // If featuredImage is null/empty, it will be cleared
    }

    // If blog is published, changing content requires re-moderation
    if (blog.status === BlogStatus.PUBLISHED && (dto.content || dto.title)) {
      dto.status = BlogStatus.PUBLISHED; // Keep as published, waiting for moderation
    }

    const updated = await this.blogRepository.update(id, dto);
    return this.toResponseDto(updated);
  }

  async delete(id: number, userId: number): Promise<void> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException("Blog not found");

    // Check if user is the author or has admin privileges
    if (blog.authorId !== userId) {
      throw new ForbiddenException("You can only delete your own blogs");
    }

    // Delete featured image from Cloudinary if exists
    if (blog.featuredImage) {
      try {
        await this.cloudinaryService.deleteImage(blog.featuredImage);
        console.log(
          "✅ Deleted featured image from Cloudinary:",
          blog.featuredImage
        );
      } catch (error) {
        console.error(
          "❌ Failed to delete featured image from Cloudinary:",
          error
        );
        // Don't throw error, continue with blog deletion
      }
    }

    await this.blogRepository.delete(id);
  }

  async moderate(
    id: number,
    moderatorId: number,
    dto: ModerateBlogDto
  ): Promise<BlogResponseDto> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException("Blog not found");

    // Validate moderation reason for rejected blogs
    if (dto.status === BlogStatus.REJECTED && !dto.moderationReason) {
      throw new BadRequestException(
        "Moderation reason is required when rejecting a blog"
      );
    }

    const updateData: any = {
      status: dto.status,
      moderatorId: moderatorId,
      moderatedAt: new Date(),
    };

    if (dto.moderationReason) {
      updateData.moderationReason = dto.moderationReason;
    }

    // Set publishedAt if status is APPROVED
    if (dto.status === BlogStatus.APPROVED && !blog.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updated = await this.blogRepository.update(id, updateData);
    return this.toResponseDto(updated);
  }

  async publish(id: number, userId: number): Promise<BlogResponseDto> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException("Blog not found");

    // Check if user is the author
    if (blog.authorId !== userId) {
      throw new ForbiddenException("You can only publish your own blogs");
    }

    // Only draft blogs can be published
    if (blog.status !== BlogStatus.DRAFT) {
      throw new BadRequestException("Only draft blogs can be published");
    }

    const updated = await this.blogRepository.update(id, {
      status: BlogStatus.PUBLISHED,
    });

    return this.toResponseDto(updated);
  }

  async like(
    id: number,
    userId: number,
    ip?: string,
    userAgent?: string
  ): Promise<void> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException("Blog not found");

    // Check if user already liked this blog
    const existingLike = await this.blogLikeRepository.findByUserAndBlog(
      userId,
      id
    );

    if (existingLike) {
      // Unlike: remove the like
      await this.blogLikeRepository.deleteByUserAndBlog(userId, id);
      await this.blogRepository.update(id, { likeCount: blog.likeCount - 1 });

      // Track unlike activity
      try {
        await this.userActivityRepository.create({
          userId: userId,
          activityType: ActivityType.BLOG_UNLIKED,
          description: `Unliked blog "${blog.title}"`,
          metadata: {
            blogId: blog.id,
            blogTitle: blog.title,
            action: "unlike",
          },
          ipAddress: ip,
          userAgent: userAgent,
        });
        console.log("✅ Activity tracked: BLOG_UNLIKED for user", userId);
      } catch (error) {
        console.error("❌ Failed to track activity:", error);
      }
    } else {
      // Like: add the like
      await this.blogLikeRepository.create({ userId, blogId: id });
      await this.blogRepository.update(id, { likeCount: blog.likeCount + 1 });

      // Track like activity
      try {
        await this.userActivityRepository.create({
          userId: userId,
          activityType: ActivityType.BLOG_LIKED,
          description: `Liked blog "${blog.title}"`,
          metadata: {
            blogId: blog.id,
            blogTitle: blog.title,
            action: "like",
          },
          ipAddress: ip,
          userAgent: userAgent,
        });
        console.log("✅ Activity tracked: BLOG_LIKED for user", userId);
      } catch (error) {
        console.error("❌ Failed to track activity:", error);
      }
    }
  }

  async getMyBlogs(
    userId: number,
    pagination: PaginationDto
  ): Promise<{ data: BlogResponseDto[]; metadata: any }> {
    const { page = 1, limit = 10 } = pagination;
    const [blogs, total] = await this.blogRepository.findAll({
      page,
      limit,
      filters: { authorId: userId },
    });

    const data = blogs.map(this.toResponseDto);
    const metadata = {
      totalItems: total,
      pageSize: limit,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
    return { data, metadata };
  }

  async getPendingModeration(
    pagination: PaginationDto
  ): Promise<{ data: BlogResponseDto[]; metadata: any }> {
    const { page = 1, limit = 10 } = pagination;
    const [blogs, total] = await this.blogRepository.findAll({
      page,
      limit,
      filters: { status: BlogStatus.PUBLISHED },
    });

    const data = blogs.map(this.toResponseDto);
    const metadata = {
      totalItems: total,
      pageSize: limit,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
    return { data, metadata };
  }

  private toResponseDto(blog: Blog): BlogResponseDto {
    return {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      featuredImage: blog.featuredImage,
      category: blog.category,
      status: blog.status,
      moderationReason: blog.moderationReason,
      viewCount: blog.viewCount,
      likeCount: blog.likeCount,
      commentCount: blog.commentCount,
      tags: blog.tags?.map((tag) => ({
        id: tag.id,
        name: tag.name,
        description: tag.description,
        color: tag.color,
        isActive: tag.isActive,
        usageCount: tag.usageCount,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
      })),
      publishedAt: blog.publishedAt,
      moderatedAt: blog.moderatedAt,
      authorId: blog.authorId,
      authorName: blog.author?.username,
      moderatorId: blog.moderatorId,
      moderatorName: blog.moderator?.username,
      createdAt: blog.createdAt,
      updatedAt: blog.updatedAt,
    };
  }
}
