export interface ISystemManagementService {
  getSystemSettings(): Promise<{
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    emailVerificationRequired: boolean;
    maxFileUploadSize: number;
    sessionTimeout: number;
    rateLimiting: {
      enabled: boolean;
      maxRequests: number;
      windowMs: number;
    };
    security: {
      passwordMinLength: number;
      requireSpecialChars: boolean;
      maxLoginAttempts: number;
    };
  }>;

  updateSystemSettings(settings: any): Promise<{ message: string; updatedSettings: any }>;

  createBackup(): Promise<{
    id: string;
    timestamp: Date;
    type: string;
    size: number;
    status: string;
    description: string;
  }>;

  getBackups(): Promise<{
    backups: Array<{
      id: string;
      timestamp: Date;
      type: string;
      size: number;
      status: string;
      description: string;
    }>;
    totalBackups: number;
    totalSize: number;
  }>;

  restoreBackup(backupId: string): Promise<{ message: string; restoredBackup: any }>;

  deleteBackup(backupId: string): Promise<{ message: string; deletedBackupId: string }>;

  setMaintenanceMode(enabled: boolean, message?: string): Promise<{ message: string; maintenanceMode: boolean }>;

  getMaintenanceStatus(): Promise<{
    isEnabled: boolean;
    message?: string;
    enabledAt?: Date;
    enabledBy?: string;
  }>;

  clearCache(cacheType?: string): Promise<{ message: string; clearedCaches: string[] }>;

  getSystemLogs(level?: string, limit?: number): Promise<{
    logs: Array<{
      timestamp: Date;
      level: string;
      message: string;
      context?: string;
    }>;
    totalLogs: number;
    logLevels: {
      error: number;
      warn: number;
      info: number;
      debug: number;
    };
  }>;

  banUser(userId: number, reason: string, duration?: number): Promise<{ message: string; bannedUser: any }>;

  unbanUser(userId: number): Promise<{ message: string; unbannedUser: any }>;

  getBannedUsers(): Promise<{
    bannedUsers: Array<{
      id: number;
      email: string;
      banReason: string;
      bannedAt: Date;
      banExpiresAt?: Date;
    }>;
    totalBannedUsers: number;
  }>;

  restartSystem(): Promise<{ message: string; restartTime: Date }>;

  getDatabaseStatus(): Promise<{
    status: string;
    version: string;
    size: number;
    connections: number;
    slowQueries: number;
    lastOptimization: Date;
  }>;

  optimizeDatabase(): Promise<{ message: string; optimizationResults: any }>;
} 