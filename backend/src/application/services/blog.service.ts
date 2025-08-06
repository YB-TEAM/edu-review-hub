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
import {
  ApproveBlogDto,
  RejectBlogDto,
  BanBlogDto,
} from "../dto/blog/moderate-blog.dto";
import { IUploadedFileRepository } from "@/domain/repositories/uploaded-file.repository.interface";
import { PublishBlogDto } from "../dto/blog/publish-blog.dto";

@Injectable()
export class BlogService implements IBlogService {
  constructor(
    @Inject("IBlogRepository")
    private readonly blogRepository: IBlogRepository,
    @Inject("ITagRepository")
    private readonly tagRepository: ITagRepository,
    private readonly blogLikeRepository: BlogLikeRepository,
    private readonly userActivityRepository: UserActivityRepository,
    private readonly cloudinaryService: CloudinaryService,
    @Inject("IUploadedFileRepository")
    private readonly uploadedFileRepository: IUploadedFileRepository
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
    // fix conflict
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

    // Check if user is the author of the blog
    const isAuthor = user && blog.authorId === user.id;

    // Access control logic:
    // - Admin/Moderator: can see all blogs
    // - Author: can see their own blogs (any status)
    // - Regular users: can only see APPROVED blogs
    if (!isAdmin && !isAuthor && blog.status !== BlogStatus.APPROVED) {
      throw new ForbiddenException("Blog not accessible");
    }

    // Increment view count
    await this.blogRepository.incrementViewCount(id);

    return await this.toResponseDtoWithUser(blog, user);
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
    // Check if user is admin/moderator
    const isAdmin = user?.roles?.some(
      (role: any) =>
        role.name === "admin" ||
        role.name === "moderator" ||
        role.name === "super_admin"
    );

    // For public API (user = null), always show only approved blogs
    // For admin, allow filtering by any status
    if (!user || !isAdmin) {
      filters = { ...filters, status: BlogStatus.APPROVED };
    }

    const { page = 1, limit = 10 } = pagination;
    const [blogs, total] = await this.blogRepository.findAll({
      page,
      limit,
      filters,
    });

    // Check like status for authenticated users
    let likeStatusMap = new Map<number, boolean>();
    if (user && user.id) {
      likeStatusMap = await this.checkLikeStatusForBlogs(blogs, user.id);
    }

    const data = blogs.map((blog) => {
      const blogDto = this.toResponseDto(blog);
      // Add isLiked field if user is authenticated
      if (user && user.id) {
        blogDto.isLiked = likeStatusMap.get(blog.id) || false;
      }
      return blogDto;
    });

    const metadata = {
      totalItems: total,
      pageSize: limit,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
    return { data, metadata };
  }

  // Helper method to check like status for multiple blogs
  private async checkLikeStatusForBlogs(
    blogs: Blog[],
    userId: number
  ): Promise<Map<number, boolean>> {
    if (!userId || blogs.length === 0) {
      return new Map();
    }

    try {
      const blogIds = blogs.map((blog) => blog.id);
      // This would need a new method in BlogLikeRepository to get multiple likes at once
      // For now, we'll check individually (can be optimized later)
      const likeStatusMap = new Map<number, boolean>();

      for (const blog of blogs) {
        const existingLike = await this.blogLikeRepository.findByUserAndBlog(
          userId,
          blog.id
        );
        likeStatusMap.set(blog.id, !!existingLike);
      }

      return likeStatusMap;
    } catch (error) {
      console.error("Failed to check like status for blogs:", error);
      return new Map();
    }
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
      const oldFeaturedImage = blog.featuredImage;

      if (dto.featuredImage) {
        // Validate that the new image exists on Cloudinary
        try {
          await this.cloudinaryService.getImageInfo(dto.featuredImage);
        } catch (error) {
          throw new BadRequestException(
            "Invalid featured image. Image not found on Cloudinary."
          );
        }

        // If changing to a different image, delete the old one
        if (oldFeaturedImage && oldFeaturedImage !== dto.featuredImage) {
          try {
            await this.cloudinaryService.deleteImage(oldFeaturedImage);

            // Mark old image as deleted in uploaded_files table
            const oldUploadedFile =
              await this.uploadedFileRepository.findByPublicId(
                oldFeaturedImage
              );
            if (oldUploadedFile) {
              await this.uploadedFileRepository.delete(oldUploadedFile.id);
            }
          } catch (error) {
            // Don't throw error, continue with update
          }
        }
      } else {
        // If setting featuredImage to null/empty, delete the old image
        if (oldFeaturedImage) {
          try {
            await this.cloudinaryService.deleteImage(oldFeaturedImage);

            // Mark old image as deleted in uploaded_files table
            const oldUploadedFile =
              await this.uploadedFileRepository.findByPublicId(
                oldFeaturedImage
              );
            if (oldUploadedFile) {
              await this.uploadedFileRepository.delete(oldUploadedFile.id);
            }
          } catch (error) {
            // Don't throw error, continue with update
          }
        }
      }
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

        // Mark image as deleted in uploaded_files table
        const uploadedFile = await this.uploadedFileRepository.findByPublicId(
          blog.featuredImage
        );
        if (uploadedFile) {
          await this.uploadedFileRepository.delete(uploadedFile.id);
        }
      } catch (error) {
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

  async approve(
    id: number,
    moderatorId: number,
    dto: ApproveBlogDto
  ): Promise<BlogResponseDto> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException("Blog not found");

    // Only published blogs can be approved
    if (blog.status !== BlogStatus.PUBLISHED) {
      throw new BadRequestException("Only published blogs can be approved");
    }

    const updateData: any = {
      status: BlogStatus.APPROVED,
      moderatorId: moderatorId,
      moderatedAt: new Date(),
      publishedAt: blog.publishedAt || new Date(), // Set publishedAt if not already set
    };

    if (dto.moderationReason) {
      updateData.moderationReason = dto.moderationReason;
    }

    const updated = await this.blogRepository.update(id, updateData);
    return this.toResponseDto(updated);
  }

  async reject(
    id: number,
    moderatorId: number,
    dto: RejectBlogDto
  ): Promise<BlogResponseDto> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException("Blog not found");

    // Only published blogs can be rejected
    if (blog.status !== BlogStatus.PUBLISHED) {
      throw new BadRequestException("Only published blogs can be rejected");
    }

    const updateData: any = {
      status: BlogStatus.REJECTED,
      moderatorId: moderatorId,
      moderatedAt: new Date(),
      moderationReason: dto.moderationReason,
    };

    const updated = await this.blogRepository.update(id, updateData);
    return this.toResponseDto(updated);
  }

  async ban(
    id: number,
    moderatorId: number,
    dto: BanBlogDto
  ): Promise<BlogResponseDto> {
    const blog = await this.blogRepository.findById(id);
    if (!blog) throw new NotFoundException("Blog not found");

    // Blog can be banned from any status except already banned
    if (blog.status === BlogStatus.BANNED) {
      throw new BadRequestException("Blog is already banned");
    }

    const updateData: any = {
      status: BlogStatus.BANNED,
      moderatorId: moderatorId,
      moderatedAt: new Date(),
      moderationReason: dto.banReason,
    };

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

  async publishBlog(
    id: number,
    userId: number,
    dto: PublishBlogDto
  ): Promise<BlogResponseDto> {
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

    const updateData = {
      title: dto.title,
      content: dto.content,
      excerpt: dto.excerpt,
      featuredImage: dto.featuredImage,
      category: dto.category as BlogCategory,
      status: BlogStatus.PUBLISHED,
      publishedAt: new Date(),
    };

    const updated = await this.blogRepository.update(id, updateData);

    // Handle tags if provided
    if (dto.tagIds && dto.tagIds.length > 0) {
      await this.blogRepository.updateTags(id, dto.tagIds);
    }

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

    // Check like status for user's own blogs
    const likeStatusMap = await this.checkLikeStatusForBlogs(blogs, userId);

    const data = blogs.map((blog) => {
      const blogDto = this.toResponseDto(blog);
      blogDto.isLiked = likeStatusMap.get(blog.id) || false;
      return blogDto;
    });

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

  async findMyDrafts(
    userId: number,
    pagination: PaginationDto
  ): Promise<{ data: BlogResponseDto[]; metadata: any }> {
    const { page = 1, limit = 10 } = pagination;
    const [blogs, total] = await this.blogRepository.findAll({
      page,
      limit,
      filters: {
        authorId: userId,
        status: BlogStatus.DRAFT,
      },
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

  async findForModeration(
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
    // Generate featured image URLs if public_id exists
    let featuredImageUrl = null;
    let featuredImageUrls = null;

    if (blog.featuredImage) {
      try {
        featuredImageUrl = this.cloudinaryService.generateImageUrl(
          blog.featuredImage,
          {
            quality: "auto",
            crop: "fill",
          }
        );

        featuredImageUrls = this.cloudinaryService.generateResponsiveUrls(
          blog.featuredImage
        );
      } catch (error) {
        console.error("Failed to generate image URLs:", error);
      }
    }

    return {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      featuredImage: blog.featuredImage,
      featuredImageUrl: featuredImageUrl,
      featuredImageUrls: featuredImageUrls,
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

  private async toResponseDtoWithUser(
    blog: Blog,
    user?: any
  ): Promise<BlogResponseDto> {
    // Generate featured image URLs if public_id exists
    let featuredImageUrl = null;
    let featuredImageUrls = null;

    if (blog.featuredImage) {
      try {
        featuredImageUrl = this.cloudinaryService.generateImageUrl(
          blog.featuredImage,
          {
            quality: "auto",
            crop: "fill",
          }
        );

        featuredImageUrls = this.cloudinaryService.generateResponsiveUrls(
          blog.featuredImage
        );
      } catch (error) {
        console.error("Failed to generate image URLs:", error);
      }
    }

    // Check if user has liked this blog
    let isLiked = null;
    if (user && user.id) {
      try {
        const existingLike = await this.blogLikeRepository.findByUserAndBlog(
          user.id,
          blog.id
        );
        isLiked = !!existingLike;
      } catch (error) {
        console.error("Failed to check like status:", error);
        isLiked = null;
      }
    }

    return {
      id: blog.id,
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      featuredImage: blog.featuredImage,
      featuredImageUrl: featuredImageUrl,
      featuredImageUrls: featuredImageUrls,
      category: blog.category,
      status: blog.status,
      moderationReason: blog.moderationReason,
      viewCount: blog.viewCount,
      likeCount: blog.likeCount,
      isLiked: isLiked,
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
