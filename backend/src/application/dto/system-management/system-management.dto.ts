import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsOptional,
  IsString,
  IsArray,
  IsNumber,
  IsEnum,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class SystemSettingsDto {
  @ApiProperty({ description: "Maintenance mode settings" })
  maintenance: {
    enabled: boolean;
    message?: string;
    allowedIPs?: string[];
  };

  @ApiProperty({ description: "Security settings" })
  security: {
    maxLoginAttempts: number;
    sessionTimeout: number;
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSpecialChars: boolean;
    };
  };

  @ApiProperty({ description: "Performance settings" })
  performance: {
    cacheEnabled: boolean;
    cacheTTL: number;
    rateLimitEnabled: boolean;
    maxRequestsPerMinute: number;
  };

  @ApiProperty({ description: "Notification settings" })
  notifications: {
    emailAlerts: boolean;
    systemAlerts: boolean;
    backupNotifications: boolean;
  };
}

export class UpdateMaintenanceDto {
  @ApiProperty({
    description: "Whether maintenance mode is enabled",
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @ApiProperty({
    description: "Maintenance message to display",
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: "IP addresses allowed during maintenance",
    required: false,
  })
  @IsOptional()
  @IsArray()
  allowedIPs?: string[];
}

export class UpdatePasswordPolicyDto {
  @ApiProperty({ description: "Minimum password length", required: false })
  @IsOptional()
  @IsNumber()
  minLength?: number;

  @ApiProperty({ description: "Require uppercase letters", required: false })
  @IsOptional()
  @IsBoolean()
  requireUppercase?: boolean;

  @ApiProperty({ description: "Require lowercase letters", required: false })
  @IsOptional()
  @IsBoolean()
  requireLowercase?: boolean;

  @ApiProperty({ description: "Require numbers", required: false })
  @IsOptional()
  @IsBoolean()
  requireNumbers?: boolean;

  @ApiProperty({ description: "Require special characters", required: false })
  @IsOptional()
  @IsBoolean()
  requireSpecialChars?: boolean;
}

export class UpdateSecurityDto {
  @ApiProperty({ description: "Maximum login attempts", required: false })
  @IsOptional()
  @IsNumber()
  maxLoginAttempts?: number;

  @ApiProperty({ description: "Session timeout in minutes", required: false })
  @IsOptional()
  @IsNumber()
  sessionTimeout?: number;

  @ApiProperty({ description: "Password policy settings", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePasswordPolicyDto)
  passwordPolicy?: UpdatePasswordPolicyDto;
}

export class UpdatePerformanceDto {
  @ApiProperty({ description: "Enable caching", required: false })
  @IsOptional()
  @IsBoolean()
  cacheEnabled?: boolean;

  @ApiProperty({ description: "Cache TTL in seconds", required: false })
  @IsOptional()
  @IsNumber()
  cacheTTL?: number;

  @ApiProperty({ description: "Enable rate limiting", required: false })
  @IsOptional()
  @IsBoolean()
  rateLimitEnabled?: boolean;

  @ApiProperty({ description: "Maximum requests per minute", required: false })
  @IsOptional()
  @IsNumber()
  maxRequestsPerMinute?: number;
}

export class UpdateNotificationsDto {
  @ApiProperty({ description: "Enable email alerts", required: false })
  @IsOptional()
  @IsBoolean()
  emailAlerts?: boolean;

  @ApiProperty({ description: "Enable system alerts", required: false })
  @IsOptional()
  @IsBoolean()
  systemAlerts?: boolean;

  @ApiProperty({ description: "Enable backup notifications", required: false })
  @IsOptional()
  @IsBoolean()
  backupNotifications?: boolean;
}

export class UpdateSystemSettingsDto {
  @ApiProperty({
    description: "Maintenance settings to update",
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateMaintenanceDto)
  maintenance?: UpdateMaintenanceDto;

  @ApiProperty({ description: "Security settings to update", required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateSecurityDto)
  security?: UpdateSecurityDto;

  @ApiProperty({
    description: "Performance settings to update",
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdatePerformanceDto)
  performance?: UpdatePerformanceDto;

  @ApiProperty({
    description: "Notification settings to update",
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => UpdateNotificationsDto)
  notifications?: UpdateNotificationsDto;
}

export class MaintenanceModeDto {
  @ApiProperty({ description: "Whether maintenance mode is enabled" })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({
    description: "Maintenance message to display",
    required: false,
  })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({
    description: "IP addresses allowed during maintenance",
    required: false,
  })
  @IsOptional()
  @IsArray()
  allowedIPs?: string[];
}

export class BackupMetadataDto {
  @ApiProperty({ description: "Unique backup ID" })
  id: string;

  @ApiProperty({ description: "Backup creation timestamp" })
  timestamp: Date;

  @ApiProperty({ description: "Backup type" })
  type: string;

  @ApiProperty({ description: "Backup size in bytes" })
  size: number;

  @ApiProperty({ description: "Backup status" })
  status: "creating" | "completed" | "failed";

  @ApiProperty({ description: "Backup description" })
  description: string;
}

export class BanUserDto {
  @ApiProperty({ description: "Reason for banning the user" })
  @IsString()
  reason: string;

  @ApiProperty({ description: "Ban duration in seconds", required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ description: "Whether the ban is permanent", required: false })
  @IsOptional()
  @IsBoolean()
  permanent?: boolean;
}

export class BannedUserDto {
  @ApiProperty({ description: "User ID" })
  id: number;

  @ApiProperty({ description: "User email" })
  email: string;

  @ApiProperty({ description: "Username" })
  username: string;

  @ApiProperty({ description: "User role" })
  role: string;

  @ApiProperty({ description: "Ban reason" })
  banReason: string;

  @ApiProperty({ description: "Ban timestamp" })
  bannedAt: Date;

  @ApiProperty({ description: "Ban expiration timestamp", required: false })
  banExpiresAt?: Date;

  @ApiProperty({ description: "Whether the ban is permanent" })
  isPermanent: boolean;
}

export class SystemLogDto {
  @ApiProperty({ description: "Log timestamp" })
  timestamp: Date;

  @ApiProperty({ description: "Log level" })
  level: "info" | "warn" | "error" | "debug";

  @ApiProperty({ description: "Log message" })
  message: string;

  @ApiProperty({ description: "Log source" })
  source: string;

  @ApiProperty({ description: "User ID associated with log", required: false })
  userId?: number;
}

export class SystemLogsResponseDto {
  @ApiProperty({ description: "List of system logs", type: [SystemLogDto] })
  logs: SystemLogDto[];

  @ApiProperty({ description: "Total number of logs" })
  total: number;

  @ApiProperty({ description: "Applied filters" })
  filters: {
    level?: string;
    startDate?: string;
    endDate?: string;
    limit: number;
  };
}

export class DatabaseStatusDto {
  @ApiProperty({ description: "Database connection status" })
  status: "connected" | "disconnected";

  @ApiProperty({ description: "Database connection details" })
  connection: {
    host: string;
    port: number;
    database: string;
    isConnected: boolean;
  };

  @ApiProperty({ description: "Database statistics" })
  statistics: {
    totalUsers: number;
    totalBlogs: number;
    totalReviews: number;
    totalUniversities: number;
  };

  @ApiProperty({ description: "Database size information" })
  size: {
    total: string;
    tables: Record<string, string>;
  };

  @ApiProperty({ description: "Last status check timestamp" })
  lastChecked: Date;
}

export class CacheTypeDto {
  @ApiProperty({
    description: "Type of cache to clear",
    enum: ["all", "database", "memory", "files"],
  })
  @IsEnum(["all", "database", "memory", "files"])
  type: "all" | "database" | "memory" | "files";
}

export class ReportTypeDto {
  @ApiProperty({
    description: "Type of report to generate",
    enum: ["users", "content", "activity", "system"],
  })
  @IsEnum(["users", "content", "activity", "system"])
  type: "users" | "content" | "activity" | "system";

  @ApiProperty({
    description: "Report format",
    enum: ["json", "csv", "pdf"],
    required: false,
  })
  @IsOptional()
  @IsEnum(["json", "csv", "pdf"])
  format?: "json" | "csv" | "pdf";

  @ApiProperty({ description: "Start date for report", required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ description: "End date for report", required: false })
  @IsOptional()
  @IsString()
  endDate?: string;
}
