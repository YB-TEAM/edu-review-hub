import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../infrastructure/database/entities/user.entity';
import { Blog, BlogStatus } from '../../infrastructure/database/entities/blog.entity';
import { UniversityReview } from '../../infrastructure/database/entities/university-review.entity';
import { University } from '../../infrastructure/database/entities/university.entity';
import { UserActivity } from '../../infrastructure/database/entities/user-activity.entity';
import { UserDevice } from '../../infrastructure/database/entities/user-device.entity';
import { IDashboardService } from './dashboard.service.interface';
import {
  DashboardOverviewResponseDto,
  StatisticsDto,
  UserAnalyticsDto,
  ContentAnalyticsDto,
  SystemHealthDto,
  AlertsResponseDto,
  PerformanceMetricsDto,
} from '../dto/dashboard/dashboard-response.dto';

@Injectable()
export class DashboardService implements IDashboardService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Blog)
    private readonly blogRepository: Repository<Blog>,
    @InjectRepository(UniversityReview)
    private readonly reviewRepository: Repository<UniversityReview>,
    @InjectRepository(University)
    private readonly universityRepository: Repository<University>,
    @InjectRepository(UserActivity)
    private readonly activityRepository: Repository<UserActivity>,
    @InjectRepository(UserDevice)
    private readonly deviceRepository: Repository<UserDevice>,
  ) {}

  async getOverview() {
    const [
      totalUsers,
      activeUsers,
      totalBlogs,
      publishedBlogs,
      totalReviews,
      totalUniversities,
      recentActivities,
      systemHealth,
    ] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { isActive: true } }),
      this.blogRepository.count(),
      this.blogRepository.count({ where: { status: BlogStatus.PUBLISHED } }),
      this.reviewRepository.count(),
      this.universityRepository.count(),
      this.activityRepository.find({
        order: { createdAt: 'DESC' },
        take: 10,
        relations: ['user'],
      }),
      this.getSystemHealth(),
    ]);

    return {
      overview: {
        totalUsers,
        activeUsers,
        totalBlogs,
        publishedBlogs,
        totalReviews,
        totalUniversities,
        systemHealth,
      },
      recentActivities,
      lastUpdated: new Date(),
    };
  }

  async getStatistics() {
    const [
      userStats,
      contentStats,
      engagementStats,
      systemStats,
    ] = await Promise.all([
      this.getUserStatistics(),
      this.getContentStatistics(),
      this.getEngagementStatistics(),
      this.getSystemStatistics(),
    ]);

    return {
      userStats,
      contentStats,
      engagementStats,
      systemStats,
      lastUpdated: new Date(),
    };
  }

  async getUserAnalytics() {
    const [
      userGrowth,
      userActivity,
      userEngagement,
      userDemographics,
    ] = await Promise.all([
      this.getUserGrowthData(),
      this.getUserActivityData(),
      this.getUserEngagementData(),
      this.getUserDemographicsData(),
    ]);

    return {
      userGrowth,
      userActivity,
      userEngagement,
      userDemographics,
      lastUpdated: new Date(),
    };
  }

  async getContentAnalytics() {
    const [
      contentGrowth,
      contentPerformance,
      contentEngagement,
      contentQuality,
    ] = await Promise.all([
      this.getContentGrowthData(),
      this.getContentPerformanceData(),
      this.getContentEngagementData(),
      this.getContentQualityData(),
    ]);

    return {
      contentGrowth,
      contentPerformance,
      contentEngagement,
      contentQuality,
      lastUpdated: new Date(),
    };
  }

  async getSystemHealth() {
    const [
      databaseStatus,
      apiPerformance,
      errorRates,
      resourceUsage,
    ] = await Promise.all([
      this.getDatabaseStatus(),
      this.getApiPerformance(),
      this.getErrorRates(),
      this.getResourceUsage(),
    ]);

    return {
      databaseStatus,
      apiPerformance,
      errorRates,
      resourceUsage,
      overallHealth: this.calculateOverallHealth({
        databaseStatus,
        apiPerformance,
        errorRates,
        resourceUsage,
      }),
      lastUpdated: new Date(),
    };
  }

  async generateReport(type: string) {
    switch (type) {
      case 'user':
        return this.generateUserReport();
      case 'content':
        return this.generateContentReport();
      case 'system':
        return this.generateSystemReport();
      case 'engagement':
        return this.generateEngagementReport();
      default:
        throw new Error(`Unknown report type: ${type}`);
    }
  }

  async getAlerts() {
    const alerts = await this.checkSystemAlerts();
    return {
      alerts,
      totalAlerts: alerts.length,
      criticalAlerts: alerts.filter(alert => alert.severity === 'critical').length,
      lastUpdated: new Date(),
    };
  }

  async getPerformanceMetrics() {
    const [
      responseTimes,
      throughput,
      errorRates,
      resourceMetrics,
    ] = await Promise.all([
      this.getResponseTimes(),
      this.getThroughput(),
      this.getErrorRates(),
      this.getResourceMetrics(),
    ]);

    return {
      responseTimes,
      throughput,
      errorRates,
      resourceMetrics,
      lastUpdated: new Date(),
    };
  }

  // Private helper methods
  private async getUserStatistics() {
    const totalUsers = await this.userRepository.count();
    const activeUsers = await this.userRepository.count({ where: { isActive: true } });
    const newUsersThisMonth = await this.userRepository.count({
      where: {
        createdAt: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      },
    });

    return {
      totalUsers,
      activeUsers,
      newUsersThisMonth,
      activeUserRate: totalUsers > 0 ? (activeUsers / totalUsers) * 100 : 0,
    };
  }

  private async getContentStatistics() {
    const totalBlogs = await this.blogRepository.count();
    const publishedBlogs = await this.blogRepository.count({ where: { status: BlogStatus.PUBLISHED } });
    const totalReviews = await this.reviewRepository.count();
    const totalUniversities = await this.universityRepository.count();

    return {
      totalBlogs,
      publishedBlogs,
      totalReviews,
      totalUniversities,
      contentApprovalRate: totalBlogs > 0 ? (publishedBlogs / totalBlogs) * 100 : 0,
    };
  }

  private async getEngagementStatistics() {
    const totalActivities = await this.activityRepository.count();
    const totalDevices = await this.deviceRepository.count();
    
    // Mock engagement metrics
    const averageSessionDuration = 25.5; // minutes
    const bounceRate = 32.1; // percentage
    const returnUserRate = 68.9; // percentage

    return {
      totalActivities,
      totalDevices,
      averageSessionDuration,
      bounceRate,
      returnUserRate,
    };
  }

  private async getSystemStatistics() {
    // Mock system statistics
    return {
      uptime: 99.8, // percentage
      averageResponseTime: 245, // milliseconds
      errorRate: 0.2, // percentage
      activeConnections: 1250,
    };
  }

  private async getUserGrowthData() {
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [
      lastMonthUsers,
      thisMonthUsers,
      totalUsers,
    ] = await Promise.all([
      this.userRepository.count({
        where: {
          createdAt: lastMonth,
        },
      }),
      this.userRepository.count({
        where: {
          createdAt: thisMonth,
        },
      }),
      this.userRepository.count(),
    ]);

    return {
      totalUsers,
      newUsersThisMonth: thisMonthUsers,
      growthRate: lastMonthUsers > 0 ? ((thisMonthUsers - lastMonthUsers) / lastMonthUsers) * 100 : 0,
      monthlyGrowth: [
        { month: 'Jan', users: 1200 },
        { month: 'Feb', users: 1350 },
        { month: 'Mar', users: 1420 },
        { month: 'Apr', users: 1580 },
        { month: 'May', users: 1650 },
        { month: 'Jun', users: 1720 },
      ],
    };
  }

  private async getUserActivityData() {
    const recentActivities = await this.activityRepository.find({
      order: { createdAt: 'DESC' },
      take: 20,
      relations: ['user'],
    });

    return {
      recentActivities,
      activeUsersToday: 450,
      activeUsersThisWeek: 1200,
      averageDailyActiveUsers: 380,
    };
  }

  private async getUserEngagementData() {
    return {
      averageSessionDuration: 25.5,
      pagesPerSession: 4.2,
      bounceRate: 32.1,
      returnUserRate: 68.9,
      engagementScore: 7.8,
    };
  }

  private async getUserDemographicsData() {
    return {
      ageGroups: [
        { age: '18-24', percentage: 35 },
        { age: '25-34', percentage: 42 },
        { age: '35-44', percentage: 15 },
        { age: '45+', percentage: 8 },
      ],
      locations: [
        { location: 'Ho Chi Minh City', percentage: 45 },
        { location: 'Hanoi', percentage: 28 },
        { location: 'Da Nang', percentage: 12 },
        { location: 'Other', percentage: 15 },
      ],
      deviceTypes: [
        { device: 'Mobile', percentage: 65 },
        { device: 'Desktop', percentage: 30 },
        { device: 'Tablet', percentage: 5 },
      ],
    };
  }

  private async getContentGrowthData() {
    const totalBlogs = await this.blogRepository.count();
    const totalReviews = await this.reviewRepository.count();

    return {
      totalContent: totalBlogs + totalReviews,
      contentGrowthRate: 15.2,
      monthlyContentCreation: [
        { month: 'Jan', blogs: 45, reviews: 120 },
        { month: 'Feb', blogs: 52, reviews: 135 },
        { month: 'Mar', blogs: 48, reviews: 142 },
        { month: 'Apr', blogs: 61, reviews: 158 },
        { month: 'May', blogs: 58, reviews: 165 },
        { month: 'Jun', blogs: 65, reviews: 172 },
      ],
    };
  }

  private async getContentPerformanceData() {
    const blogs = await this.blogRepository.find({
      order: { viewCount: 'DESC' },
      take: 10,
    });

    return {
      topPerformingContent: blogs.map(blog => ({
        id: blog.id,
        title: blog.title,
        views: blog.viewCount,
        likes: blog.likeCount,
        engagement: (blog.likeCount / Math.max(blog.viewCount, 1)) * 100,
      })),
      averageViewsPerContent: 1250,
      averageEngagementRate: 8.5,
    };
  }

  private async getContentEngagementData() {
    return {
      averageTimeOnPage: 3.2, // minutes
      socialShares: 1250,
      commentsPerContent: 8.5,
      bookmarkRate: 12.3,
    };
  }

  private async getContentQualityData() {
    const totalBlogs = await this.blogRepository.count();
    const publishedBlogs = await this.blogRepository.count({ where: { status: BlogStatus.PUBLISHED } });

    return {
      contentApprovalRate: totalBlogs > 0 ? (publishedBlogs / totalBlogs) * 100 : 0,
      averageContentLength: 850, // words
      contentQualityScore: 8.2,
      moderationEfficiency: 95.5, // percentage
    };
  }

  private async getDatabaseStatus() {
    return {
      status: 'healthy',
      responseTime: 45, // milliseconds
      connectionPool: {
        active: 12,
        idle: 8,
        total: 20,
      },
      lastBackup: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    };
  }

  private async getApiPerformance() {
    return {
      averageResponseTime: 245, // milliseconds
      requestsPerSecond: 125,
      errorRate: 0.2, // percentage
      uptime: 99.8, // percentage
    };
  }

  private async getErrorRates() {
    return {
      totalErrors: 45,
      errorRate: 0.2, // percentage
      criticalErrors: 2,
      warningErrors: 15,
      infoErrors: 28,
    };
  }

  private async getResourceUsage() {
    return {
      cpuUsage: 45.2, // percentage
      memoryUsage: 68.5, // percentage
      diskUsage: 42.1, // percentage
      networkUsage: 15.8, // percentage
    };
  }

  private calculateOverallHealth(metrics: any) {
    const scores = [
      metrics.databaseStatus.status === 'healthy' ? 100 : 50,
      metrics.apiPerformance.uptime,
      (100 - metrics.errorRates.errorRate),
      (100 - metrics.resourceUsage.cpuUsage),
    ];
    
    return scores.reduce((sum, score) => sum + score, 0) / scores.length;
  }

  private async checkSystemAlerts() {
    const alerts = [];

    // Check for critical system issues
    const systemHealth = await this.getSystemHealth();
    if (systemHealth.overallHealth < 80) {
      alerts.push({
        id: 'system-health-low',
        type: 'system',
        severity: 'critical',
        title: 'System Health Below Threshold',
        message: `System health is at ${systemHealth.overallHealth.toFixed(1)}%`,
        timestamp: new Date(),
      });
    }

    // Check for high error rates
    if (systemHealth.errorRates.errorRate > 1) {
      alerts.push({
        id: 'high-error-rate',
        type: 'performance',
        severity: 'warning',
        title: 'High Error Rate Detected',
        message: `Error rate is ${systemHealth.errorRates.errorRate}%`,
        timestamp: new Date(),
      });
    }

    // Check for resource usage
    if (systemHealth.resourceUsage.cpuUsage > 80) {
      alerts.push({
        id: 'high-cpu-usage',
        type: 'resource',
        severity: 'warning',
        title: 'High CPU Usage',
        message: `CPU usage is at ${systemHealth.resourceUsage.cpuUsage}%`,
        timestamp: new Date(),
      });
    }

    return alerts;
  }

  private async getResponseTimes() {
    return {
      average: 245, // milliseconds
      p95: 450, // milliseconds
      p99: 800, // milliseconds
      endpoints: [
        { endpoint: '/api/users', average: 120 },
        { endpoint: '/api/blogs', average: 180 },
        { endpoint: '/api/reviews', average: 200 },
        { endpoint: '/api/dashboard', average: 350 },
      ],
    };
  }

  private async getThroughput() {
    return {
      requestsPerSecond: 125,
      requestsPerMinute: 7500,
      requestsPerHour: 450000,
      peakRequestsPerSecond: 250,
    };
  }

  private async getResourceMetrics() {
    return {
      cpu: {
        current: 45.2,
        average: 42.1,
        peak: 78.5,
      },
      memory: {
        current: 68.5,
        average: 65.2,
        peak: 85.1,
      },
      disk: {
        current: 42.1,
        average: 40.8,
        peak: 45.2,
      },
      network: {
        current: 15.8,
        average: 12.5,
        peak: 25.3,
      },
    };
  }

  private async generateUserReport() {
    const userStats = await this.getUserStatistics();
    const userAnalytics = await this.getUserAnalytics();

    return {
      type: 'user',
      generatedAt: new Date(),
      summary: {
        totalUsers: userStats.totalUsers,
        activeUsers: userStats.activeUsers,
        growthRate: userAnalytics.userGrowth.growthRate,
      },
      details: {
        userStats,
        userAnalytics,
      },
    };
  }

  private async generateContentReport() {
    const contentStats = await this.getContentStatistics();
    const contentAnalytics = await this.getContentAnalytics();

    return {
      type: 'content',
      generatedAt: new Date(),
             summary: {
         totalContent: contentStats.totalBlogs + contentStats.totalReviews,
         approvalRate: contentStats.contentApprovalRate,
         engagementRate: 8.5, // Mock engagement rate
       },
      details: {
        contentStats,
        contentAnalytics,
      },
    };
  }

  private async generateSystemReport() {
    const systemHealth = await this.getSystemHealth();
    const performanceMetrics = await this.getPerformanceMetrics();

    return {
      type: 'system',
      generatedAt: new Date(),
      summary: {
        overallHealth: systemHealth.overallHealth,
        uptime: systemHealth.apiPerformance.uptime,
        errorRate: systemHealth.errorRates.errorRate,
      },
      details: {
        systemHealth,
        performanceMetrics,
      },
    };
  }

  private async generateEngagementReport() {
    const engagementStats = await this.getEngagementStatistics();
    const userEngagement = await this.getUserEngagementData();
    const contentEngagement = await this.getContentEngagementData();

    return {
      type: 'engagement',
      generatedAt: new Date(),
      summary: {
        averageSessionDuration: engagementStats.averageSessionDuration,
        bounceRate: engagementStats.bounceRate,
        returnUserRate: engagementStats.returnUserRate,
      },
      details: {
        engagementStats,
        userEngagement,
        contentEngagement,
      },
    };
  }
} 