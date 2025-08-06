// Blog Types
export interface Blog {
  id: number;
  title: string;
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
  category: BlogCategory;
  status: BlogStatus;
  moderationReason?: string;
  viewCount: number;
  likeCount: number;
  isLiked?: boolean;
  commentCount: number;
  tags?: Tag[];
  keywords?: string[];
  slug?: string;
  publishedAt?: string;
  moderatedAt?: string;
  authorId: number;
  authorName?: string;
  moderatorId?: number;
  moderatorName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBlogRequest {
  title: string;
  content: string;
  excerpt?: string;
  featuredImage?: string;
  category?: BlogCategory;
  tagIds?: number[];
  keywords?: string[];
  slug?: string;
}

export interface UpdateBlogRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  category?: BlogCategory;
  tagIds?: number[];
  keywords?: string[];
  slug?: string;
}

export interface BlogFilters {
  search?: string;
  authorId?: number;
  category?: BlogCategory;
  status?: BlogStatus;
  tags?: number[];
  publishedAfter?: string;
  publishedBefore?: string;
  page?: number;
  limit?: number;
  sortBy?:
    | "createdAt"
    | "updatedAt"
    | "publishedAt"
    | "viewCount"
    | "likeCount"
    | "title";
  sortOrder?: "asc" | "desc";
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTagRequest {
  name: string;
  color: string;
  description?: string;
}

export interface UpdateTagRequest {
  name?: string;
  color?: string;
  description?: string;
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
  APPROVED = "approved",
  REJECTED = "rejected",
  BANNED = "banned",
}

export interface BlogLike {
  id: number;
  blogId: number;
  userId: number;
  createdAt: string;
}

export interface BlogComment {
  id: number;
  content: string;
  blogId: number;
  userId: number;
  userName: string;
  userAvatar?: string;
  createdAt: string;
  updatedAt: string;
}
