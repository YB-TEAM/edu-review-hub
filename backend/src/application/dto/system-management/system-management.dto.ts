import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, IsArray, IsNumber, IsEnum } from 'class-validator';

export class SystemSettingsDto {
  @ApiProperty({ description: 'Maintenance mode settings' })
  maintenance: {
    enabled: boolean;
    message?: string;
    allowedIPs?: string[];
  };

  @ApiProperty({ description: 'Security settings' })
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

  @ApiProperty({ description: 'Performance settings' })
  performance: {
    cacheEnabled: boolean;
    cacheTTL: number;
    rateLimitEnabled: boolean;
    maxRequestsPerMinute: number;
  };

  @ApiProperty({ description: 'Notification settings' })
  notifications: {
    emailAlerts: boolean;
    systemAlerts: boolean;
    backupNotifications: boolean;
  };
}

export class UpdateSystemSettingsDto {
  @ApiProperty({ description: 'System settings to update', required: false })
  @IsOptional()
  maintenance?: {
    @IsBoolean()
    enabled: boolean;
    @IsOptional()
    @IsString()
    message?: string;
    @IsOptional()
    @IsArray()
    allowedIPs?: string[];
  };

  @ApiProperty({ description: 'Security settings to update', required: false })
  @IsOptional()
  security?: {
    @IsOptional()
    @IsNumber()
    maxLoginAttempts?: number;
    @IsOptional()
    @IsNumber()
    sessionTimeout?: number;
    @IsOptional()
    passwordPolicy?: {
      @IsNumber()
      minLength: number;
      @IsBoolean()
      requireUppercase: boolean;
      @IsBoolean()
      requireLowercase: boolean;
      @IsBoolean()
      requireNumbers: boolean;
      @IsBoolean()
      requireSpecialChars: boolean;
    };
  };

  @ApiProperty({ description: 'Performance settings to update', required: false })
  @IsOptional()
  performance?: {
    @IsOptional()
    @IsBoolean()
    cacheEnabled?: boolean;
    @IsOptional()
    @IsNumber()
    cacheTTL?: number;
    @IsOptional()
    @IsBoolean()
    rateLimitEnabled?: boolean;
    @IsOptional()
    @IsNumber()
    maxRequestsPerMinute?: number;
  };

  @ApiProperty({ description: 'Notification settings to update', required: false })
  @IsOptional()
  notifications?: {
    @IsOptional()
    @IsBoolean()
    emailAlerts?: boolean;
    @IsOptional()
    @IsBoolean()
    systemAlerts?: boolean;
    @IsOptional()
    @IsBoolean()
    backupNotifications?: boolean;
  };
}

export class MaintenanceModeDto {
  @ApiProperty({ description: 'Whether maintenance mode is enabled' })
  @IsBoolean()
  enabled: boolean;

  @ApiProperty({ description: 'Maintenance message to display', required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ description: 'IP addresses allowed during maintenance', required: false })
  @IsOptional()
  @IsArray()
  allowedIPs?: string[];
}

export class BackupMetadataDto {
  @ApiProperty({ description: 'Unique backup ID' })
  id: string;

  @ApiProperty({ description: 'Backup creation timestamp' })
  timestamp: Date;

  @ApiProperty({ description: 'Backup type' })
  type: string;

  @ApiProperty({ description: 'Backup size in bytes' })
  size: number;

  @ApiProperty({ description: 'Backup status' })
  status: 'creating' | 'completed' | 'failed';

  @ApiProperty({ description: 'Backup description' })
  description: string;
}

export class BanUserDto {
  @ApiProperty({ description: 'Reason for banning the user' })
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Ban duration in seconds', required: false })
  @IsOptional()
  @IsNumber()
  duration?: number;

  @ApiProperty({ description: 'Whether the ban is permanent', required: false })
  @IsOptional()
  @IsBoolean()
  permanent?: boolean;
}

export class BannedUserDto {
  @ApiProperty({ description: 'User ID' })
  id: number;

  @ApiProperty({ description: 'User email' })
  email: string;

  @ApiProperty({ description: 'Username' })
  username: string;

  @ApiProperty({ description: 'User role' })
  role: string;

  @ApiProperty({ description: 'Ban reason' })
  banReason: string;

  @ApiProperty({ description: 'Ban timestamp' })
  bannedAt: Date;

  @ApiProperty({ description: 'Ban expiration timestamp', required: false })
  banExpiresAt?: Date;

  @ApiProperty({ description: 'Whether the ban is permanent' })
  isPermanent: boolean;
}

export class SystemLogDto {
  @ApiProperty({ description: 'Log timestamp' })
  timestamp: Date;

  @ApiProperty({ description: 'Log level' })
  level: 'info' | 'warn' | 'error' | 'debug';

  @ApiProperty({ description: 'Log message' })
  message: string;

  @ApiProperty({ description: 'Log source' })
  source: string;

  @ApiProperty({ description: 'User ID associated with log', required: false })
  userId?: number;
}

export class SystemLogsResponseDto {
  @ApiProperty({ description: 'List of system logs', type: [SystemLogDto] })
  logs: SystemLogDto[];

  @ApiProperty({ description: 'Total number of logs' })
  total: number;

  @ApiProperty({ description: 'Applied filters' })
  filters: {
    level?: string;
    startDate?: string;
    endDate?: string;
    limit: number;
  };
}

export class DatabaseStatusDto {
  @ApiProperty({ description: 'Database connection status' })
  status: 'connected' | 'disconnected';

  @ApiProperty({ description: 'Database connection details' })
  connection: {
    host: string;
    port: number;
    database: string;
    isConnected: boolean;
  };

  @ApiProperty({ description: 'Database statistics' })
  statistics: {
    totalUsers: number;
    totalBlogs: number;
    totalReviews: number;
    totalUniversities: number;
  };

  @ApiProperty({ description: 'Database size information' })
  size: {
    total: string;
    tables: Record<string, string>;
  };

  @ApiProperty({ description: 'Last status check timestamp' })
  lastChecked: Date;
}

export class CacheTypeDto {
  @ApiProperty({ description: 'Type of cache to clear', enum: ['all', 'database', 'memory', 'files'] })
  @IsEnum(['all', 'database', 'memory', 'files'])
  type: 'all' | 'database' | 'memory' | 'files';
}

export class ReportTypeDto {
  @ApiProperty({ description: 'Type of report to generate', enum: ['users', 'content', 'activity', 'system'] })
  @IsEnum(['users', 'content', 'activity', 'system'])
  type: 'users' | 'content' | 'activity' | 'system';

  @ApiProperty({ description: 'Report format', enum: ['json', 'csv', 'pdf'], required: false })
  @IsOptional()
  @IsEnum(['json', 'csv', 'pdf'])
  format?: 'json' | 'csv' | 'pdf';

  @ApiProperty({ description: 'Start date for report', required: false })
  @IsOptional()
  @IsString()
  startDate?: string;

  @ApiProperty({ description: 'End date for report', required: false })
  @IsOptional()
  @IsString()
  endDate?: string;
} 