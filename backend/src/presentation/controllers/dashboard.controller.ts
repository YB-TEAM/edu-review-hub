import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  Inject,
  Param,
} from "@nestjs/common";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";
import { RolesGuard } from "@/presentation/guards/role.guard";
import { Roles } from "@/presentation/decorators/roles.decorator";
import { RequirePermissions } from "@/presentation/decorators/permissions.decorator";
import { UserRole } from "@/infrastructure/database/entities/user.entity";
import {
  ApiBearerAuth,
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
  ApiParam,
} from "@nestjs/swagger";
import { IDashboardService } from "@/application/services/dashboard.service.interface";

@Controller("dashboard")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth("JWT-auth")
export class DashboardController {
  constructor(
    @Inject("IDashboardService")
    private readonly dashboardService: IDashboardService
  ) {}

  @Get("overview")
  @ApiTags("Dashboard - Admin")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get dashboard overview statistics",
    description: "Get comprehensive system overview for admin dashboard",
  })
  @ApiOkResponse({
    description: "Dashboard overview statistics",
    schema: {
      type: "object",
      properties: {
        overview: {
          type: "object",
          properties: {
            totalUsers: { type: "number" },
            activeUsers: { type: "number" },
            totalBlogs: { type: "number" },
            publishedBlogs: { type: "number" },
            totalReviews: { type: "number" },
            totalUniversities: { type: "number" },
            systemHealth: { type: "object" },
          },
        },
        recentActivities: { type: "array" },
        lastUpdated: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async getOverview() {
    return this.dashboardService.getOverview();
  }

  @Get("statistics")
  @ApiTags("Dashboard - Admin")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get detailed system statistics",
    description: "Get detailed statistics for charts and analytics",
  })
  @ApiOkResponse({
    description: "Detailed system statistics",
    schema: {
      type: "object",
      properties: {
        userStats: { type: "object" },
        contentStats: { type: "object" },
        engagementStats: { type: "object" },
        systemStats: { type: "object" },
        lastUpdated: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async getStatistics() {
    return this.dashboardService.getStatistics();
  }

  @Get("users/analytics")
  @ApiTags("Dashboard - Admin")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get user analytics and demographics",
    description: "Get detailed user analytics including growth, activity, and demographics",
  })
  @ApiOkResponse({
    description: "User analytics data",
    schema: {
      type: "object",
      properties: {
        userGrowth: { type: "object" },
        userActivity: { type: "object" },
        userEngagement: { type: "object" },
        userDemographics: { type: "object" },
        lastUpdated: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async getUserAnalytics() {
    return this.dashboardService.getUserAnalytics();
  }

  @Get("content/analytics")
  @ApiTags("Dashboard - Admin")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get content analytics",
    description: "Get analytics for reviews, blogs, and content moderation",
  })
  @ApiOkResponse({
    description: "Content analytics data",
    schema: {
      type: "object",
      properties: {
        contentGrowth: { type: "object" },
        contentPerformance: { type: "object" },
        contentEngagement: { type: "object" },
        contentQuality: { type: "object" },
        lastUpdated: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async getContentAnalytics() {
    return this.dashboardService.getContentAnalytics();
  }

  @Get("system/health")
  @ApiTags("Dashboard - Admin")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get system health status",
    description: "Get detailed system health and performance metrics",
  })
  @ApiOkResponse({
    description: "System health status",
    schema: {
      type: "object",
      properties: {
        databaseStatus: { type: "object" },
        apiPerformance: { type: "object" },
        errorRates: { type: "object" },
        resourceUsage: { type: "object" },
        overallHealth: { type: "number" },
        lastUpdated: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async getSystemHealth() {
    return this.dashboardService.getSystemHealth();
  }

  @Get("reports/:type")
  @ApiTags("Dashboard - Admin")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Generate system reports",
    description: "Generate various system reports for admin",
  })
  @ApiParam({
    name: "type",
    description: "Report type: user, content, system, engagement",
    example: "user",
  })
  @ApiOkResponse({
    description: "Generated report",
    schema: {
      type: "object",
      properties: {
        type: { type: "string" },
        generatedAt: { type: "string", format: "date-time" },
        summary: { type: "object" },
        details: { type: "object" },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async generateReport(@Param("type") type: string) {
    return this.dashboardService.generateReport(type);
  }

  @Get("alerts")
  @ApiTags("Dashboard - Admin")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get system alerts",
    description: "Get active system alerts and notifications",
  })
  @ApiOkResponse({
    description: "System alerts",
    schema: {
      type: "object",
      properties: {
        alerts: { type: "array" },
        totalAlerts: { type: "number" },
        criticalAlerts: { type: "number" },
        lastUpdated: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async getAlerts() {
    return this.dashboardService.getAlerts();
  }

  @Get("performance")
  @ApiTags("Dashboard - Admin")
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get performance metrics",
    description: "Get detailed performance metrics and KPIs",
  })
  @ApiOkResponse({
    description: "Performance metrics",
    schema: {
      type: "object",
      properties: {
        responseTimes: { type: "object" },
        throughput: { type: "object" },
        errorRates: { type: "object" },
        resourceMetrics: { type: "object" },
        lastUpdated: { type: "string", format: "date-time" },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async getPerformanceMetrics() {
    return this.dashboardService.getPerformanceMetrics();
  }
} 