export interface IDashboardService {
  getOverview(): Promise<{
    overview: {
      totalUsers: number;
      activeUsers: number;
      totalBlogs: number;
      publishedBlogs: number;
      totalReviews: number;
      totalUniversities: number;
      systemHealth: any;
    };
    recentActivities: any[];
    lastUpdated: Date;
  }>;

  getStatistics(): Promise<{
    userStats: any;
    contentStats: any;
    engagementStats: any;
    systemStats: any;
    lastUpdated: Date;
  }>;

  getUserAnalytics(): Promise<{
    userGrowth: any;
    userActivity: any;
    userEngagement: any;
    userDemographics: any;
    lastUpdated: Date;
  }>;

  getContentAnalytics(): Promise<{
    contentGrowth: any;
    contentPerformance: any;
    contentEngagement: any;
    contentQuality: any;
    lastUpdated: Date;
  }>;

  getSystemHealth(): Promise<{
    databaseStatus: any;
    apiPerformance: any;
    errorRates: any;
    resourceUsage: any;
    overallHealth: number;
    lastUpdated: Date;
  }>;

  generateReport(type: string): Promise<any>;

  getAlerts(): Promise<{
    alerts: any[];
    totalAlerts: number;
    criticalAlerts: number;
    lastUpdated: Date;
  }>;

  getPerformanceMetrics(): Promise<{
    responseTimes: any;
    throughput: any;
    errorRates: any;
    resourceMetrics: any;
    lastUpdated: Date;
  }>;
} 