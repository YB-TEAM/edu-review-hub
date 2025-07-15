import {
  Controller,
  Get,
  UseGuards,
  Request,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from "@nestjs/common";
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiQuery,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@/presentation/guards/jwt-auth.guard";
import { IUserActivityService } from "@/application/services/user-activity.service.interface";
import { Inject } from "@nestjs/common";

@ApiTags("User Activity")
@Controller("activity")
export class UserActivityController {
  constructor(
    @Inject("IUserActivityService")
    private readonly userActivityService: IUserActivityService
  ) {}

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user activity history" })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Number of activities to return (default: 50)",
  })
  @ApiQuery({
    name: "offset",
    required: false,
    type: Number,
    description: "Number of activities to skip (default: 0)",
  })
  @ApiResponse({
    status: 200,
    description: "User activity history",
    schema: {
      type: "object",
      properties: {
        activities: {
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
        total: { type: "number" },
        limit: { type: "number" },
        offset: { type: "number" },
      },
    },
  })
  async getMyActivities(
    @Request() req,
    @Query("limit", new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query("offset", new DefaultValuePipe(0), ParseIntPipe) offset: number
  ): Promise<{
    activities: any[];
    total: number;
    limit: number;
    offset: number;
  }> {
    const [activities, total] = await Promise.all([
      this.userActivityService.getUserActivities(req.user.id, limit, offset),
      this.userActivityService.getActivityCount(req.user.id),
    ]);

    return {
      activities,
      total,
      limit,
      offset,
    };
  }

  @Get("me/count")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get current user activity count" })
  @ApiResponse({ status: 200, description: "Activity count", type: Number })
  async getMyActivityCount(@Request() req): Promise<{ count: number }> {
    const count = await this.userActivityService.getActivityCount(req.user.id);
    return { count };
  }
}
