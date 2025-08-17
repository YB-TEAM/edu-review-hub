// Blog status enum
export enum BlogStatus {
  DRAFT = 'draft',
  PENDING = 'published',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  BANNED = 'banned',
}

// Blog visibility enum
export enum BlogVisibility {
  PUBLIC = 'public',
  PRIVATE = 'private',
  UNLISTED = 'unlisted',
}

// Blog category enum
export enum BlogCategory {
  NEWS = 'news',
  GUIDE = 'guide',
  REVIEW = 'review',
  INTERVIEW = 'interview',
  OPINION = 'opinion',
  TUTORIAL = 'tutorial',
  OTHER = 'other',
}

// Blog tag interface
export interface BlogTag {
  id: number;
  name: string;
  slug: string;
  color?: string;
  description?: string;
}

// Blog author interface
export interface BlogAuthor {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  displayName?: string;
  accountType: string;
  isVerified: boolean;
}

// Blog response interface matching backend BlogResponseDto
export interface BlogResponse {
  id: number;
  title: string;
  slug?: string;
  excerpt: string;
  content: string;
  status: BlogStatus;
  visibility?: BlogVisibility;
  category: BlogCategory;
  featuredImage?: string;
  featuredImageUrl?: string;
  featuredImageUrls?: {
    thumbnail: string;
    medium: string;
    large: string;
    original: string;
  };
  tags: BlogTag[];
  author?: BlogAuthor; // Optional for backward compatibility
  authorId?: number; // New field from API
  authorName?: string; // New field from API
  viewCount: number;
  likeCount: number;
  commentCount: number;
  isFeatured?: boolean;
  isPublished?: boolean;
  publishedAt?: string;
  moderatedAt?: string;
  moderationReason?: string;
  moderatorId?: number;
  createdAt: string;
  updatedAt: string;
  isLiked?: boolean;
}

// Blog list response with pagination
export interface BlogListResponse {
  blogs: BlogResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Create blog request matching backend CreateBlogDto
export interface CreateBlogRequest {
  title: string;
  excerpt?: string;
  content: string;
  category?: BlogCategory;
  featuredImage?: string;
  tagIds?: number[];
}

// Update blog request matching backend UpdateBlogDto
export interface UpdateBlogRequest {
  title?: string;
  excerpt?: string;
  content?: string;
  category?: BlogCategory;
  visibility?: BlogVisibility;
  featuredImage?: string;
  tagIds?: number[];
  status?: BlogStatus;
}

// Blog query parameters for admin
export interface BlogQueryParams {
  page?: number;
  limit?: number;
  status?: BlogStatus;
  category?: BlogCategory;
  authorId?: number;
  tagId?: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'publishedAt' | 'viewCount' | 'likeCount';
  sortOrder?: 'asc' | 'desc';
  startDate?: string;
  endDate?: string;
}

// Blog moderation request matching backend ApproveBlogDto
export interface ApproveBlogRequest {
  approvedAt: string;
  approvedBy: number;
  notes?: string;
}

// Blog rejection request matching backend RejectBlogDto
export interface RejectBlogRequest {
  rejectedAt: string;
  rejectedBy: number;
  reason: string;
  notes?: string;
}

// Blog ban request matching backend BanBlogDto
export interface BanBlogRequest {
  bannedAt: string;
  bannedBy: number;
  reason: string;
  notes?: string;
  banDuration?: number; // in days, 0 for permanent
}

// Blog unban request matching backend UnbanBlogDto
export interface UnbanBlogRequest {
  unbannedAt: string;
  unbannedBy: number;
  notes?: string;
}

// Blog statistics
export interface BlogStatistics {
  total: number;
  published: number;
  pending: number;
  rejected: number;
  banned: number;
  draft: number;
  featured: number;
  totalViews: number;
  totalLikes: number;
  totalComments: number;
}

// Blog analytics
export interface BlogAnalytics {
  viewsByDate: Array<{ date: string; count: number }>;
  likesByDate: Array<{ date: string; count: number }>;
  commentsByDate: Array<{ date: string; count: number }>;
  topPosts: BlogResponse[];
  categoryDistribution: Array<{ category: BlogCategory; count: number }>;
  authorPerformance: Array<{ author: BlogAuthor; postCount: number; totalViews: number }>;
}
