import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
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
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
} from "@nestjs/swagger";
import { ISystemManagementService } from "@/application/services/system-management.service.interface";

@ApiTags("System Management")
@Controller("system")
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth("JWT-auth")
export class SystemManagementController {
  constructor(
    @Inject("ISystemManagementService")
    private readonly systemManagementService: ISystemManagementService
  ) {}

  @Get("settings")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get system settings",
    description: "Get all system configuration settings",
  })
  @ApiResponse({
    status: 200,
    description: "System settings retrieved successfully",
    schema: {
      type: "object",
      properties: {
        maintenanceMode: { type: "boolean" },
        registrationEnabled: { type: "boolean" },
        emailVerificationRequired: { type: "boolean" },
        maxFileUploadSize: { type: "number" },
        sessionTimeout: { type: "number" },
        rateLimiting: {
          type: "object",
          properties: {
            enabled: { type: "boolean" },
            maxRequests: { type: "number" },
            windowMs: { type: "number" },
          },
        },
        security: {
          type: "object",
          properties: {
            passwordMinLength: { type: "number" },
            requireSpecialChars: { type: "boolean" },
            maxLoginAttempts: { type: "number" },
          },
        },
      },
    },
  })
  async getSystemSettings() {
    return this.systemManagementService.getSystemSettings();
  }

  @Patch("settings")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Update system settings",
    description: "Update system configuration settings",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        maintenanceMode: { type: "boolean" },
        registrationEnabled: { type: "boolean" },
        emailVerificationRequired: { type: "boolean" },
        maxFileUploadSize: { type: "number" },
        sessionTimeout: { type: "number" },
        rateLimiting: {
          type: "object",
          properties: {
            enabled: { type: "boolean" },
            maxRequests: { type: "number" },
            windowMs: { type: "number" },
          },
        },
        security: {
          type: "object",
          properties: {
            passwordMinLength: { type: "number" },
            requireSpecialChars: { type: "boolean" },
            maxLoginAttempts: { type: "number" },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "System settings updated successfully",
  })
  async updateSystemSettings(@Body() settings: any) {
    return this.systemManagementService.updateSystemSettings(settings);
  }

  @Post("backup")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Create system backup",
    description: "Create a complete system backup including database and files",
  })
  @ApiResponse({
    status: 201,
    description: "Backup created successfully",
    schema: {
      type: "object",
      properties: {
        id: { type: "string" },
        timestamp: { type: "string", format: "date-time" },
        type: { type: "string" },
        size: { type: "number" },
        status: { type: "string" },
        description: { type: "string" },
      },
    },
  })
  async createBackup() {
    return this.systemManagementService.createBackup();
  }

  @Get("backups")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get system backups",
    description: "Get list of all system backups",
  })
  @ApiResponse({
    status: 200,
    description: "Backups retrieved successfully",
    schema: {
      type: "object",
      properties: {
        backups: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "string" },
              timestamp: { type: "string", format: "date-time" },
              type: { type: "string" },
              size: { type: "number" },
              status: { type: "string" },
              description: { type: "string" },
            },
          },
        },
        totalBackups: { type: "number" },
        totalSize: { type: "number" },
      },
    },
  })
  async getBackups() {
    return this.systemManagementService.getBackups();
  }

  @Post("backup/:backupId/restore")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Restore system backup",
    description: "Restore system from a specific backup",
  })
  @ApiParam({
    name: "backupId",
    description: "Backup ID to restore",
  })
  @ApiResponse({
    status: 200,
    description: "Backup restored successfully",
  })
  async restoreBackup(@Param("backupId") backupId: string) {
    return this.systemManagementService.restoreBackup(backupId);
  }

  @Delete("backup/:backupId")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Delete system backup",
    description: "Delete a specific system backup",
  })
  @ApiParam({
    name: "backupId",
    description: "Backup ID to delete",
  })
  @ApiResponse({
    status: 200,
    description: "Backup deleted successfully",
  })
  async deleteBackup(@Param("backupId") backupId: string) {
    return this.systemManagementService.deleteBackup(backupId);
  }

  @Post("maintenance")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Set maintenance mode",
    description: "Enable or disable system maintenance mode",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        enabled: { type: "boolean" },
        message: { type: "string" },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: "Maintenance mode updated successfully",
  })
  async setMaintenanceMode(@Body() maintenance: { enabled: boolean; message?: string }) {
    return this.systemManagementService.setMaintenanceMode(maintenance.enabled, maintenance.message);
  }

  @Get("maintenance")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get maintenance status",
    description: "Get current maintenance mode status",
  })
  @ApiResponse({
    status: 200,
    description: "Maintenance status retrieved successfully",
    schema: {
      type: "object",
      properties: {
        isEnabled: { type: "boolean" },
        message: { type: "string" },
        enabledAt: { type: "string", format: "date-time" },
        enabledBy: { type: "string" },
      },
    },
  })
  async getMaintenanceStatus() {
    return this.systemManagementService.getMaintenanceStatus();
  }

  @Post("cache/clear")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Clear system cache",
    description: "Clear all system caches",
  })
  @ApiQuery({
    name: "cacheType",
    required: false,
    description: "Cache type to clear (all, user-sessions, api-responses, database-queries)",
  })
  @ApiResponse({
    status: 200,
    description: "Cache cleared successfully",
  })
  async clearCache(@Query("cacheType") cacheType?: string) {
    return this.systemManagementService.clearCache(cacheType);
  }

  @Get("logs")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get system logs",
    description: "Get system logs with filtering options",
  })
  @ApiQuery({
    name: "level",
    required: false,
    description: "Log level filter (error, warn, info, debug)",
  })
  @ApiQuery({
    name: "limit",
    required: false,
    type: Number,
    description: "Maximum number of logs to return (default: 100)",
  })
  @ApiResponse({
    status: 200,
    description: "System logs retrieved successfully",
    schema: {
      type: "object",
      properties: {
        logs: {
          type: "array",
          items: {
            type: "object",
            properties: {
              timestamp: { type: "string", format: "date-time" },
              level: { type: "string" },
              message: { type: "string" },
              context: { type: "string" },
            },
          },
        },
        totalLogs: { type: "number" },
        logLevels: {
          type: "object",
          properties: {
            error: { type: "number" },
            warn: { type: "number" },
            info: { type: "number" },
            debug: { type: "number" },
          },
        },
      },
    },
  })
  async getSystemLogs(
    @Query("level") level?: string,
    @Query("limit") limit: number = 100
  ) {
    return this.systemManagementService.getSystemLogs(level, limit);
  }

  @Post("users/:userId/ban")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Ban user",
    description: "Ban a user from the system",
  })
  @ApiParam({
    name: "userId",
    description: "User ID to ban",
  })
  @ApiBody({
    schema: {
      type: "object",
      properties: {
        reason: { type: "string" },
        duration: { type: "number", description: "Ban duration in seconds (optional)" },
      },
      required: ["reason"],
    },
  })
  @ApiResponse({
    status: 200,
    description: "User banned successfully",
  })
  async banUser(
    @Param("userId", ParseIntPipe) userId: number,
    @Body() banData: { reason: string; duration?: number }
  ) {
    return this.systemManagementService.banUser(userId, banData.reason, banData.duration);
  }

  @Post("users/:userId/unban")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Unban user",
    description: "Unban a user from the system",
  })
  @ApiParam({
    name: "userId",
    description: "User ID to unban",
  })
  @ApiResponse({
    status: 200,
    description: "User unbanned successfully",
  })
  async unbanUser(@Param("userId", ParseIntPipe) userId: number) {
    return this.systemManagementService.unbanUser(userId);
  }

  @Get("banned-users")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get banned users",
    description: "Get list of all banned users",
  })
  @ApiResponse({
    status: 200,
    description: "Banned users retrieved successfully",
    schema: {
      type: "object",
      properties: {
        bannedUsers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              email: { type: "string" },
              banReason: { type: "string" },
              bannedAt: { type: "string", format: "date-time" },
              banExpiresAt: { type: "string", format: "date-time" },
            },
          },
        },
        totalBannedUsers: { type: "number" },
      },
    },
  })
  async getBannedUsers() {
    return this.systemManagementService.getBannedUsers();
  }

  @Post("system/restart")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Restart system",
    description: "Restart the entire system (use with caution)",
  })
  @ApiResponse({
    status: 200,
    description: "System restart initiated",
  })
  async restartSystem() {
    return this.systemManagementService.restartSystem();
  }

  @Get("database/status")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Get database status",
    description: "Get detailed database status and performance",
  })
  @ApiResponse({
    status: 200,
    description: "Database status retrieved successfully",
    schema: {
      type: "object",
      properties: {
        status: { type: "string" },
        version: { type: "string" },
        size: { type: "number" },
        connections: { type: "number" },
        slowQueries: { type: "number" },
        lastOptimization: { type: "string", format: "date-time" },
      },
    },
  })
  async getDatabaseStatus() {
    return this.systemManagementService.getDatabaseStatus();
  }

  @Post("database/optimize")
  @Roles(UserRole.SUPER_ADMIN)
  @ApiOperation({
    summary: "Optimize database",
    description: "Run database optimization tasks",
  })
  @ApiResponse({
    status: 200,
    description: "Database optimization completed successfully",
  })
  async optimizeDatabase() {
    return this.systemManagementService.optimizeDatabase();
  }
} 