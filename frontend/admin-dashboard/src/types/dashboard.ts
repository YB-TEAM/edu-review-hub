// Dashboard overview response matching backend DashboardResponseDto
export interface DashboardResponse {
  overview: DashboardOverview;
  statistics: DashboardStatistics;
  userAnalytics: UserAnalytics;
  contentAnalytics: ContentAnalytics;
  systemHealth: SystemHealth;
  recentActivities: RecentActivity[];
  alerts: SystemAlert[];
  performanceMetrics: PerformanceMetrics;
}

// Dashboard overview section
export interface DashboardOverview {
  totalUsers: number;
  totalBlogs: number;
  totalUniversities: number;
  totalReviews: number;
  activeUsers: number;
  newUsersToday: number;
  newBlogsToday: number;
  newUniversitiesToday: number;
  systemStatus: 'healthy' | 'warning' | 'critical';
  lastUpdated: string;
}

// Dashboard statistics section
export interface DashboardStatistics {
  userStats: UserStatistics;
  blogStats: BlogStatistics;
  universityStats: UniversityStatistics;
  reviewStats: ReviewStatistics;
  engagementStats: EngagementStatistics;
  growthStats: GrowthStatistics;
}

// User statistics
export interface UserStatistics {
  total: number;
  active: number;
  inactive: number;
  suspended: number;
  banned: number;
  verified: number;
  unverified: number;
  byRole: {
    [role: string]: number;
  };
  byStatus: {
    [status: string]: number;
  };
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  activeUsersThisWeek: number;
  activeUsersThisMonth: number;
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
  byCategory: {
    [category: string]: number;
  };
  byStatus: {
    [status: string]: number;
  };
  newBlogsThisWeek: number;
  newBlogsThisMonth: number;
}

// University statistics
export interface UniversityStatistics {
  total: number;
  active: number;
  inactive: number;
  pending: number;
  suspended: number;
  banned: number;
  featured: number;
  verified: number;
  totalReviews: number;
  totalViews: number;
  averageRating: number;
  byType: {
    [type: string]: number;
  };
  byStatus: {
    [status: string]: number;
  };
  byCountry: {
    [country: string]: number;
  };
  newUniversitiesThisWeek: number;
  newUniversitiesThisMonth: number;
}

// Review statistics
export interface ReviewStatistics {
  total: number;
  approved: number;
  pending: number;
  rejected: number;
  banned: number;
  averageRating: number;
  ratingDistribution: {
    [rating: number]: number;
  };
  byType: {
    [type: string]: number;
  };
  newReviewsThisWeek: number;
  newReviewsThisMonth: number;
}

// Engagement statistics
export interface EngagementStatistics {
  totalViews: number;
  totalLikes: number;
  totalComments: number;
  totalShares: number;
  averageSessionDuration: number;
  bounceRate: number;
  pagesPerSession: number;
  viewsByDate: Array<{ date: string; count: number }>;
  likesByDate: Array<{ date: string; count: number }>;
  commentsByDate: Array<{ date: string; count: number }>;
}

// Growth statistics
export interface GrowthStatistics {
  userGrowth: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  contentGrowth: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  engagementGrowth: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  revenueGrowth?: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
}

// User analytics section
export interface UserAnalytics {
  userRetention: UserRetention;
  userBehavior: UserBehavior;
  userSegments: UserSegment[];
  topUsers: TopUser[];
  userActivityHeatmap: UserActivityHeatmap;
}

// User retention
export interface UserRetention {
  day1: number;
  day7: number;
  day30: number;
  day90: number;
  day365: number;
  cohortAnalysis: Array<{
    cohort: string;
    users: number;
    day1: number;
    day7: number;
    day30: number;
    day90: number;
  }>;
}

// User behavior
export interface UserBehavior {
  averageSessionDuration: number;
  pagesPerSession: number;
  bounceRate: number;
  returnRate: number;
  conversionRate: number;
  topPages: Array<{
    path: string;
    views: number;
    uniqueViews: number;
    avgTimeOnPage: number;
  }>;
  userJourney: Array<{
    step: string;
    users: number;
    conversionRate: number;
  }>;
}

// User segment
export interface UserSegment {
  id: string;
  name: string;
  description: string;
  criteria: string;
  userCount: number;
  characteristics: {
    [key: string]: any;
  };
  createdAt: string;
}

// Top user
export interface TopUser {
  id: number;
  username: string;
  email: string;
  avatarUrl?: string;
  role: string;
  blogCount: number;
  reviewCount: number;
  totalViews: number;
  totalLikes: number;
  lastActive: string;
}

// User activity heatmap
export interface UserActivityHeatmap {
  hourly: Array<{
    hour: number;
    activity: number;
  }>;
  daily: Array<{
    day: string;
    activity: number;
  }>;
  weekly: Array<{
    week: string;
    activity: number;
  }>;
}

// Content analytics section
export interface ContentAnalytics {
  blogAnalytics: BlogAnalytics;
  universityAnalytics: UniversityAnalytics;
  reviewAnalytics: ReviewAnalytics;
  searchAnalytics: SearchAnalytics;
  contentPerformance: ContentPerformance;
}

// Blog analytics
export interface BlogAnalytics {
  viewsByDate: Array<{ date: string; count: number }>;
  likesByDate: Array<{ date: string; count: number }>;
  commentsByDate: Array<{ date: string; count: number }>;
  topPosts: Array<{
    id: number;
    title: string;
    views: number;
    likes: number;
    comments: number;
    author: string;
  }>;
  categoryDistribution: Array<{ category: string; count: number }>;
  authorPerformance: Array<{
    author: string;
    postCount: number;
    totalViews: number;
    avgViews: number;
  }>;
}

// University analytics
export interface UniversityAnalytics {
  viewsByDate: Array<{ date: string; count: number }>;
  reviewsByDate: Array<{ date: string; count: number }>;
  topUniversities: Array<{
    id: number;
    name: string;
    views: number;
    reviews: number;
    rating: number;
  }>;
  countryDistribution: Array<{ country: string; count: number }>;
  typeDistribution: Array<{ type: string; count: number }>;
  ratingDistribution: Array<{ rating: number; count: number }>;
}

// Review analytics
export interface ReviewAnalytics {
  reviewsByDate: Array<{ date: string; count: number }>;
  ratingDistribution: Array<{ rating: number; count: number }>;
  topReviewers: Array<{
    id: number;
    username: string;
    reviewCount: number;
    avgRating: number;
  }>;
  reviewQuality: {
    helpful: number;
    notHelpful: number;
    reported: number;
  };
}

// Search analytics
export interface SearchAnalytics {
  totalSearches: number;
  uniqueSearchers: number;
  searchQueries: Array<{
    query: string;
    count: number;
    results: number;
    avgClickPosition: number;
  }>;
  searchPerformance: {
    avgResults: number;
    avgClickPosition: number;
    noResultsRate: number;
  };
}

// Content performance
export interface ContentPerformance {
  topContent: Array<{
    id: number;
    type: 'blog' | 'university' | 'review';
    title: string;
    views: number;
    engagement: number;
    conversion: number;
  }>;
  contentTrends: Array<{
    date: string;
    views: number;
    engagement: number;
  }>;
  contentQuality: {
    highQuality: number;
    mediumQuality: number;
    lowQuality: number;
  };
}

// System health section
export interface SystemHealth {
  status: 'healthy' | 'warning' | 'critical';
  uptime: number;
  responseTime: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
  databaseStatus: 'healthy' | 'warning' | 'critical';
  cacheStatus: 'healthy' | 'warning' | 'critical';
  externalServices: Array<{
    name: string;
    status: 'healthy' | 'warning' | 'critical';
    responseTime: number;
    lastChecked: string;
  }>;
  lastHealthCheck: string;
}

// Recent activity
export interface RecentActivity {
  id: number;
  type: 'user' | 'blog' | 'university' | 'review' | 'system';
  action: string;
  description: string;
  userId?: number;
  username?: string;
  targetId?: number;
  targetType?: string;
  metadata?: any;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

// System alert
export interface SystemAlert {
  id: number;
  type: 'info' | 'warning' | 'error' | 'critical';
  title: string;
  message: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  acknowledgedBy?: number;
  acknowledgedAt?: string;
  resolvedBy?: number;
  resolvedAt?: string;
}

// Performance metrics
export interface PerformanceMetrics {
  pageLoadTime: {
    average: number;
    p95: number;
    p99: number;
  };
  apiResponseTime: {
    average: number;
    p95: number;
    p99: number;
  };
  databaseQueryTime: {
    average: number;
    p95: number;
    p99: number;
  };
  cacheHitRate: number;
  errorRate: number;
  throughput: {
    requestsPerSecond: number;
    usersPerMinute: number;
  };
  resourceUsage: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
  };
}
