import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Blog, BlogStatus, BlogCategory } from "../entities/blog.entity";
import { User } from "../entities/user.entity";
import { IBlogRepository } from "@/domain/repositories/blog.repository.interface";

@Injectable()
export class BlogRepository implements IBlogRepository {
  constructor(
    @InjectRepository(Blog)
    private readonly repo: Repository<Blog>
  ) {}

  async create(blog: Partial<Blog>): Promise<Blog> {
    // Extract tags from blog data
    const { tags, ...blogData } = blog;

    console.log("🔖 Repository create - Tags to assign:", tags?.length || 0);

    // Create blog without tags first
    const createdBlog = await this.repo.save(blogData);

    // If tags are provided, add them to the blog
    if (tags && tags.length > 0) {
      console.log("🔖 Assigning tags to blog:", createdBlog.id);
      
      // Load the blog with relations and assign tags
      const blogWithRelations = await this.repo.findOne({
        where: { id: createdBlog.id },
        relations: ["tags"]
      });
      
      if (blogWithRelations) {
        blogWithRelations.tags = tags;
        await this.repo.save(blogWithRelations);
        console.log("🔖 Tags assigned successfully");
      }
    }

    // Return blog with all relations
    const result = await this.findById(createdBlog.id);
    if (!result) {
      throw new Error(`Failed to retrieve created blog with ID: ${createdBlog.id}`);
    }
    
    console.log("🔖 Final blog tags count:", result.tags?.length || 0);
    
    return result;
  }

  async findById(id: number): Promise<Blog | null> {
    return this.repo.findOne({
      where: { id },
      relations: ["author", "author.profile", "moderator", "moderator.profile", "tags"],
      withDeleted: false,
    });
  }

  async findAll(params?: {
    page?: number;
    limit?: number;
    filters?: {
      status?: BlogStatus;
      category?: BlogCategory;
      authorId?: number;
      search?: string;
      tagIds?: string;
      dateFrom?: string;
      dateTo?: string;
      minViews?: number;
      minLikes?: number;
      minComments?: number;
    };
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }): Promise<[Blog[], number]> {
    const queryBuilder = this.repo
      .createQueryBuilder("blog")
      .leftJoinAndSelect("blog.author", "author")
      .leftJoinAndSelect("blog.moderator", "moderator")
      .leftJoinAndSelect("blog.tags", "tags")
      .where("blog.deletedAt IS NULL"); // Ensure soft deleted blogs are not returned

    // Apply filters
    if (params?.filters) {
      const { status, category, authorId, search, tagIds, dateFrom, dateTo, minViews, minLikes, minComments } = params.filters;

      if (status) {
        queryBuilder.andWhere("blog.status = :status", { status });
      }

      if (category) {
        queryBuilder.andWhere("blog.category = :category", { category });
      }

      if (authorId) {
        queryBuilder.andWhere("blog.authorId = :authorId", { authorId });
      }

      if (search) {
        queryBuilder.andWhere(
          "(blog.title ILIKE :search OR blog.content ILIKE :search OR blog.excerpt ILIKE :search)",
          { search: `%${search}%` }
        );
      }

      if (tagIds) {
        const tagIdArray = tagIds.split(",").map((id) => parseInt(id.trim()));
        queryBuilder.andWhere("tags.id IN (:...tagIds)", {
          tagIds: tagIdArray,
        });
      }

      // Advanced date filtering
      if (dateFrom) {
        queryBuilder.andWhere("blog.createdAt >= :dateFrom", { dateFrom });
      }

      if (dateTo) {
        queryBuilder.andWhere("blog.createdAt <= :dateTo", { dateTo });
      }

      // Advanced count filtering
      if (minViews !== undefined) {
        queryBuilder.andWhere("blog.viewCount >= :minViews", { minViews });
      }

      if (minLikes !== undefined) {
        queryBuilder.andWhere("blog.likeCount >= :minLikes", { minLikes });
      }

      if (minComments !== undefined) {
        queryBuilder.andWhere("blog.commentCount >= :minComments", { minComments });
      }
    }

    // Apply sorting
    const sortBy = params?.sortBy || 'createdAt';
    const sortOrder = params?.sortOrder || 'DESC';
    
    switch (sortBy) {
      case 'title':
        queryBuilder.orderBy("blog.title", sortOrder);
        break;
      case 'viewCount':
        queryBuilder.orderBy("blog.viewCount", sortOrder);
        break;
      case 'likeCount':
        queryBuilder.orderBy("blog.likeCount", sortOrder);
        break;
      case 'commentCount':
        queryBuilder.orderBy("blog.commentCount", sortOrder);
        break;
      case 'publishedAt':
        queryBuilder.orderBy("blog.publishedAt", sortOrder);
        break;
      case 'updatedAt':
        queryBuilder.orderBy("blog.updatedAt", sortOrder);
        break;
      case 'createdAt':
      default:
        queryBuilder.orderBy("blog.createdAt", sortOrder);
        break;
    }

    if (params?.page && params?.limit) {
      const { page, limit } = params;
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    return queryBuilder.getManyAndCount();
  }

  // Count blogs with optional filters
  async count(filters?: {
    status?: BlogStatus;
    category?: BlogCategory;
    authorId?: number;
  }): Promise<number> {
    const queryBuilder = this.repo
      .createQueryBuilder("blog")
      .where("blog.deletedAt IS NULL");

    if (filters) {
      const { status, category, authorId } = filters;

      if (status) {
        queryBuilder.andWhere("blog.status = :status", { status });
      }

      if (category) {
        queryBuilder.andWhere("blog.category = :category", { category });
      }

      if (authorId) {
        queryBuilder.andWhere("blog.authorId = :authorId", { authorId });
      }
    }

    return queryBuilder.getCount();
  }

  // Sum a specific field with optional filters
  async sumField(field: string, filters?: {
    status?: BlogStatus;
    category?: BlogCategory;
    authorId?: number;
  }): Promise<number> {
    const queryBuilder = this.repo
      .createQueryBuilder("blog")
      .select(`SUM(blog.${field})`, "sum")
      .where("blog.deletedAt IS NULL");

    if (filters) {
      const { status, category, authorId } = filters;

      if (status) {
        queryBuilder.andWhere("blog.status = :status", { status });
      }

      if (category) {
        queryBuilder.andWhere("blog.category = :category", { category });
      }

      if (authorId) {
        queryBuilder.andWhere("blog.authorId = :authorId", { authorId });
      }
    }

    const result = await queryBuilder.getRawOne();
    return result?.sum || 0;
  }

  async update(id: number, blog: Partial<Blog>): Promise<Blog> {
    await this.repo.update(id, blog);
    const result = await this.findById(id);
    if (!result) {
      throw new Error(`Failed to retrieve updated blog with ID: ${id}`);
    }
    return result;
  }

  async delete(id: number): Promise<void> {
    await this.repo.softDelete(id);
  }

  async restore(id: number): Promise<void> {
    await this.repo.restore(id);
  }

  async findByIdWithDeleted(id: number): Promise<Blog | null> {
    return this.repo.findOne({
      where: { id },
      relations: ["author", "author.profile", "moderator", "moderator.profile", "tags"],
      withDeleted: true,
    });
  }

  async findAllWithDeleted(params?: {
    page?: number;
    limit?: number;
    filters?: {
      status?: BlogStatus;
      category?: BlogCategory;
      authorId?: number;
      search?: string;
      tagIds?: string;
    };
  }): Promise<[Blog[], number]> {
    const queryBuilder = this.repo
      .createQueryBuilder("blog")
      .leftJoinAndSelect("blog.author", "author")
      .leftJoinAndSelect("author.profile", "authorProfile")
      .leftJoinAndSelect("blog.moderator", "moderator")
      .leftJoinAndSelect("moderator.profile", "moderatorProfile")
      .leftJoinAndSelect("blog.tags", "tags")
      .withDeleted(); // Include soft deleted blogs

    // Apply filters
    if (params?.filters) {
      const { status, category, authorId, search, tagIds } = params.filters;

      if (status) {
        queryBuilder.andWhere("blog.status = :status", { status });
      }

      if (category) {
        queryBuilder.andWhere("blog.category = :category", { category });
      }

      if (authorId) {
        queryBuilder.andWhere("blog.authorId = :authorId", { authorId });
      }

      if (search) {
        queryBuilder.andWhere(
          "(blog.title ILIKE :search OR blog.content ILIKE :search OR blog.excerpt ILIKE :search)",
          { search: `%${search}%` }
        );
      }

      if (tagIds) {
        const tagIdArray = tagIds.split(",").map((id) => parseInt(id.trim()));
        queryBuilder.andWhere("tags.id IN (:...tagIds)", {
          tagIds: tagIdArray,
        });
      }
    }

    queryBuilder.orderBy("blog.createdAt", "DESC");

    if (params?.page && params?.limit) {
      const { page, limit } = params;
      queryBuilder.skip((page - 1) * limit).take(limit);
    }

    return queryBuilder.getManyAndCount();
  }

  async incrementViewCount(id: number): Promise<void> {
    await this.repo.increment({ id }, "viewCount", 1);
  }

  async toggleLike(id: number, userId: number): Promise<void> {
    // This is a placeholder - in a real implementation, you'd have a separate likes table
    // For now, we'll just increment the like count
    await this.repo.increment({ id }, "likeCount", 1);
  }
}
