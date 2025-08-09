import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
  ParseIntPipe,
  Inject,
} from "@nestjs/common";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";
import { RolesGuard } from "@/presentation/guards/role.guard";
import { Roles } from "@/presentation/decorators/roles.decorator";
import { RequirePermissions } from "@/presentation/decorators/permissions.decorator";
import { UserRole } from "@/infrastructure/database/entities/user.entity";
import { UserActivityRepository } from "@/infrastructure/database/repositories/user-activity.repository";
import { PaginationDto } from "@/application/dto/pagination/pagination.dto";
import {
  ApiBearerAuth,
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiOkResponse,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@Controller("activities")
export class ActivityController {
  constructor(
    @Inject(UserActivityRepository)
    private readonly userActivityRepository: UserActivityRepository
  ) {}

  @Get("my")
  @ApiTags("Activity - User")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    UserRole.SUPER_ADMIN,
    UserRole.ADMIN,
    UserRole.MODERATOR,
    UserRole.UNIVERSITY_REP,
    UserRole.STUDENT
  )
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get my activities",
    description: "Retrieve activities for the authenticated user",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 50)",
  })
  @ApiQuery({
    name: "activityType",
    required: false,
    type: String,
    description: "Filter by activity type",
  })
  @ApiOkResponse({
    description: "User activities retrieved successfully",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              activityType: { type: "string" },
              description: { type: "string" },
              metadata: { type: "object" },
              ipAddress: { type: "string" },
              userAgent: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
        },
        metadata: {
          type: "object",
          properties: {
            totalItems: { type: "number" },
            pageSize: { type: "number" },
            currentPage: { type: "number" },
            totalPages: { type: "number" },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async getMyActivities(
    @Request() req,
    @Query() pagination: PaginationDto,
    @Query("activityType") activityType?: string
  ) {
    const { page = 1, limit = 50 } = pagination;
    const offset = (page - 1) * limit;

    const activities = await this.userActivityRepository.findByUserId(
      req.user.id,
      limit,
      offset
    );

    const total = await this.userActivityRepository.getActivityCount(
      req.user.id
    );

    return {
      data: activities,
      metadata: {
        totalItems: total,
        pageSize: limit,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get("all")
  @ApiTags("Activity - Admin")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get all activities (admin only)",
    description: "Retrieve all user activities (super admin and admin only)",
  })
  @ApiQuery({
    name: "page",
    required: false,
    type: Number,
    description: "Page number (default: 1)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Items per page (default: 50)",
  })
  @ApiQuery({
    name: "userId",
    required: false,
    type: Number,
    description: "Filter by user ID",
  })
  @ApiQuery({
    name: "activityType",
    required: false,
    type: String,
    description: "Filter by activity type",
  })
  @ApiOkResponse({
    description: "All activities retrieved successfully",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              userId: { type: "number" },
              activityType: { type: "string" },
              description: { type: "string" },
              metadata: { type: "object" },
              ipAddress: { type: "string" },
              userAgent: { type: "string" },
              createdAt: { type: "string", format: "date-time" },
            },
          },
        },
        metadata: {
          type: "object",
          properties: {
            totalItems: { type: "number" },
            pageSize: { type: "number" },
            currentPage: { type: "number" },
            totalPages: { type: "number" },
          },
        },
      },
    },
  })
  @ApiUnauthorizedResponse({ description: "Unauthorized" })
  @ApiForbiddenResponse({ description: "Insufficient permissions" })
  async getAllActivities(
    @Query() pagination: PaginationDto,
    @Query("userId") userId?: number,
    @Query("activityType") activityType?: string
  ) {
    const { page = 1, limit = 50 } = pagination;
    const offset = (page - 1) * limit;

    // This would need to be implemented in the repository
    const activities = await this.userActivityRepository.findAll(
      limit,
      offset,
      {
        userId,
        activityType,
      }
    );

    const total = await this.userActivityRepository.getTotalCount({
      userId,
      activityType,
    });

    return {
      data: activities,
      metadata: {
        totalItems: total,
        pageSize: limit,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
