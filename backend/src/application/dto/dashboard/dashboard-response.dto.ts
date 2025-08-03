import { ApiProperty } from '@nestjs/swagger';

export class OverviewDto {
  @ApiProperty({ description: 'Total number of users' })
  totalUsers: number;

  @ApiProperty({ description: 'Number of active users' })
  activeUsers: number;

  @ApiProperty({ description: 'Total number of blogs' })
  totalBlogs: number;

  @ApiProperty({ description: 'Number of published blogs' })
  publishedBlogs: number;

  @ApiProperty({ description: 'Total number of reviews' })
  totalReviews: number;

  @ApiProperty({ description: 'Total number of universities' })
  totalUniversities: number;

  @ApiProperty({ description: 'System health status' })
  systemHealth: any;
}

export class DashboardOverviewResponseDto {
  @ApiProperty({ description: 'System overview data' })
  overview: OverviewDto;

  @ApiProperty({ description: 'Recent activities', type: [Object] })
  recentActivities: any[];

  @ApiProperty({ description: 'Last updated timestamp' })
  lastUpdated: Date;
}

export class StatisticsDto {
  @ApiProperty({ description: 'Period of statistics' })
  period: string;

  @ApiProperty({ description: 'Date range for statistics' })
  dateRange: {
    start: Date;
    end: Date;
  };

  @ApiProperty({ description: 'Statistics data' })
  statistics: {
    users: any;
    blogs: any;
    reviews: any;
    activities: any;
  };
}

export class UserAnalyticsDto {
  @ApiProperty({ description: 'Total number of users' })
  totalUsers: number;

  @ApiProperty({ description: 'Distribution of users by role' })
  roleDistribution: Record<string, number>;

  @ApiProperty({ description: 'Distribution of users by status' })
  statusDistribution: {
    active: number;
    inactive: number;
  };

  @ApiProperty({ description: 'User registration trend' })
  registrationTrend: any[];

  @ApiProperty({ description: 'List of users (limited to 50)' })
  users: any[];
}

export class ContentAnalyticsDto {
  @ApiProperty({ description: 'Blog statistics' })
  blogs: {
    total: number;
    published: number;
    pending: number;
    rejected: number;
    banned: number;
  };

  @ApiProperty({ description: 'Review statistics' })
  reviews: {
    total: number;
    approved: number;
    pending: number;
    rejected: number;
  };

  @ApiProperty({ description: 'Content creation trend' })
  contentTrend: {
    blogs: any[];
    reviews: any[];
  };

  @ApiProperty({ description: 'Moderation queue status' })
  moderationQueue: {
    blogs: number;
    reviews: number;
  };
}

export class SystemHealthDto {
  @ApiProperty({ description: 'Database health status' })
  database: {
    status: string;
    message: string;
  };

  @ApiProperty({ description: 'Memory usage information' })
  memory: {
    used: number;
    total: number;
    external: number;
    rss: number;
  };

  @ApiProperty({ description: 'CPU usage information' })
  cpu: {
    user: number;
    system: number;
  };

  @ApiProperty({ description: 'System uptime in seconds' })
  uptime: number;

  @ApiProperty({ description: 'Health check timestamp' })
  timestamp: Date;
}

export class AlertDto {
  @ApiProperty({ description: 'Unique alert ID' })
  id: string;

  @ApiProperty({ description: 'Alert type' })
  type: string;

  @ApiProperty({ description: 'Alert severity level' })
  severity: 'low' | 'medium' | 'high';

  @ApiProperty({ description: 'Alert title' })
  title: string;

  @ApiProperty({ description: 'Alert message' })
  message: string;

  @ApiProperty({ description: 'Alert timestamp' })
  timestamp: Date;

  @ApiProperty({ description: 'Alert status' })
  status: string;
}

export class AlertsResponseDto {
  @ApiProperty({ description: 'List of alerts', type: [AlertDto] })
  alerts: AlertDto[];

  @ApiProperty({ description: 'Total number of alerts' })
  total: number;

  @ApiProperty({ description: 'Alert summary by severity' })
  summary: {
    high: number;
    medium: number;
    low: number;
  };
}

export class PerformanceMetricsDto {
  @ApiProperty({ description: 'Performance period' })
  period: string;

  @ApiProperty({ description: 'Performance metrics' })
  metrics: {
    responseTimes: {
      average: number;
      p95: number;
      p99: number;
    };
    errorRates: {
      rate: number;
      totalErrors: number;
    };
    throughput: {
      requestsPerSecond: number;
      totalRequests: number;
    };
    resourceUsage: {
      memory: {
        used: number;
        total: number;
        percentage: number;
      };
      cpu: {
        user: number;
        system: number;
      };
    };
  };

  @ApiProperty({ description: 'Metrics timestamp' })
  timestamp: Date;
} 