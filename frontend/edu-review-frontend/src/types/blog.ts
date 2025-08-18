export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  featuredImageUrl?: string;
  featuredImageUrls?: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
  category?: BlogCategory;
  status: BlogStatus;
  moderationReason?: string | null;
  moderatorId?: number | null;
  moderatedAt?: string | null;
  publishedAt?: string | null;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isLiked?: boolean;
  authorId: number;
  authorName?: string;
  author?: {
    id: number;
    username: string;
    avatar?: string;
  };
  tags?: Tag[];
  createdAt: string;
  updatedAt: string;
}

export interface BlogListResponse {
  data: Blog[];
  metadata: {
    totalItems: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  tagIds?: number[];
  category?: BlogCategory;
}

export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  tagIds?: number[];
}

export interface BlogFilters {
  search?: string;
  status?: BlogStatus;
  authorId?: number;
  tags?: number[];
  page?: number;
  limit?: number;
  sort_by?: "created_at" | "updated_at" | "published_at" | "likes" | "views";
  sort_order?: "asc" | "desc";
}

export interface Tag {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagRequest {
  name: string;
  description?: string;
}

export interface UpdateTagRequest {
  name?: string;
  description?: string;
}

export interface BlogLike {
  id: number;
  blogId: number;
  userId: number;
  createdAt: string;
}

export interface BlogComment {
  id: number;
  blogId: number;
  userId: number;
  content: string;
  user?: {
    id: number;
    username: string;
    avatar?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export enum BlogCategory {
  GUIDE = "guide",
  REVIEW = "review",
  NEWS = "news",
  TUTORIAL = "tutorial",
  INTERVIEW = "interview",
  CASE_STUDY = "case_study",
  OTHER = "other",
}

export enum BlogStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
  PENDING = "pending",
  REJECTED = "rejected",
  BANNED = "banned",
  APPROVED = "approved",
}
