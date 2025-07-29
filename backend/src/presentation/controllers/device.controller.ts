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
import { UserRole } from "@/infrastructure/database/entities/user.entity";
import { UserDeviceRepository } from "@/infrastructure/database/repositories/user-device.repository";
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

@ApiTags("Device")
@Controller("devices")
export class DeviceController {
  constructor(
    @Inject(UserDeviceRepository)
    private readonly userDeviceRepository: UserDeviceRepository
  ) {}

  @Get("my")
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
    summary: "Get my devices",
    description: "Retrieve devices for the authenticated user",
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
    description: "Items per page (default: 20)",
  })
  @ApiOkResponse({
    description: "User devices retrieved successfully",
    schema: {
      type: "object",
      properties: {
        data: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              deviceId: { type: "string" },
              deviceName: { type: "string" },
              deviceType: { type: "string" },
              platform: { type: "string" },
              browser: { type: "string" },
              isTrusted: { type: "boolean" },
              lastUsedAt: { type: "string", format: "date-time" },
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
  async getMyDevices(@Request() req, @Query() pagination: PaginationDto) {
    const { page = 1, limit = 20 } = pagination;
    const offset = (page - 1) * limit;

    const devices = await this.userDeviceRepository.findByUserId(req.user.id);
    const total = devices.length;

    // Simple pagination for devices
    const paginatedDevices = devices.slice(offset, offset + limit);

    return {
      data: paginatedDevices,
      metadata: {
        totalItems: total,
        pageSize: limit,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get("all")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({
    summary: "Get all devices (admin only)",
    description: "Retrieve all user devices (super admin and admin only)",
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
    name: "deviceType",
    required: false,
    type: String,
    description: "Filter by device type",
  })
  @ApiOkResponse({
    description: "All devices retrieved successfully",
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
              deviceId: { type: "string" },
              deviceName: { type: "string" },
              deviceType: { type: "string" },
              platform: { type: "string" },
              browser: { type: "string" },
              isTrusted: { type: "boolean" },
              lastUsedAt: { type: "string", format: "date-time" },
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
  async getAllDevices(
    @Query() pagination: PaginationDto,
    @Query("userId") userId?: number,
    @Query("deviceType") deviceType?: string
  ) {
    const { page = 1, limit = 50 } = pagination;
    const offset = (page - 1) * limit;

    // This would need to be implemented in the repository
    const devices = await this.userDeviceRepository.findAll(limit, offset, {
      userId,
      deviceType,
    });

    const total = await this.userDeviceRepository.getTotalCount({
      userId,
      deviceType,
    });

    return {
      data: devices,
      metadata: {
        totalItems: total,
        pageSize: limit,
        currentPage: page,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
