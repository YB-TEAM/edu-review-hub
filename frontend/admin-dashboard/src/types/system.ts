// System management types for admin dashboard

// System overview
export interface SystemOverview {
  version: string;
  environment: 'development' | 'staging' | 'production';
  uptime: number;
  startTime: Date;
  lastRestart: Date;
  totalRequests: number;
  activeConnections: number;
}

// Database status
export interface DatabaseStatus {
  status: 'connected' | 'disconnected' | 'error';
  connectionPool: {
    total: number;
    active: number;
    idle: number;
    waiting: number;
  };
  performance: {
    queryTime: number;
    slowQueries: number;
    deadlocks: number;
  };
  lastBackup?: Date;
  nextBackup?: Date;
}

// Memory usage
export interface MemoryUsage {
  total: number;
  used: number;
  free: number;
  available: number;
  cached: number;
  buffers: number;
  swap: {
    total: number;
    used: number;
    free: number;
  };
  percentage: number;
}

// CPU usage
export interface CpuUsage {
  cores: number;
  usage: {
    user: number;
    system: number;
    idle: number;
    iowait: number;
  };
  loadAverage: {
    '1min': number;
    '5min': number;
    '15min': number;
  };
  temperature?: number;
}

// Disk usage
export interface DiskUsage {
  total: number;
  used: number;
  free: number;
  percentage: number;
  partitions: Array<{
    device: string;
    mountpoint: string;
    filesystem: string;
    total: number;
    used: number;
    free: number;
    percentage: number;
  }>;
}

// Network status
export interface NetworkStatus {
  interfaces: Array<{
    name: string;
    status: 'up' | 'down';
    ipAddresses: string[];
    macAddress: string;
    speed: number;
    duplex: string;
    rxBytes: number;
    txBytes: number;
    rxPackets: number;
    txPackets: number;
    errors: number;
    dropped: number;
  }>;
  connections: {
    established: number;
    listening: number;
    timeWait: number;
    closeWait: number;
  };
}

// Security status
export interface SecurityStatus {
  sslCertificates: Array<{
    domain: string;
    issuer: string;
    validFrom: Date;
    validTo: Date;
    daysUntilExpiry: number;
    status: 'valid' | 'expired' | 'expiring_soon';
  }>;
  firewall: {
    status: 'active' | 'inactive';
    rules: number;
    blockedIPs: number;
    lastUpdate: Date;
  };
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    lastScan: Date;
  };
}

// Backup status
export interface BackupStatus {
  lastBackup: Date;
  nextBackup: Date;
  backupSize: number;
  backupDuration: number;
  status: 'success' | 'failed' | 'in_progress';
  retention: {
    daily: number;
    weekly: number;
    monthly: number;
    yearly: number;
  };
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
}

// Log management
export interface LogInfo {
  level: 'error' | 'warn' | 'info' | 'debug';
  count: number;
  lastOccurrence: Date;
  size: number;
  rotation: {
    maxSize: number;
    maxFiles: number;
    currentFile: string;
  };
}

export interface LogEntry {
  timestamp: Date;
  level: string;
  message: string;
  context?: Record<string, any>;
  trace?: string;
}

// Cache status
export interface CacheStatus {
  type: 'redis' | 'memory' | 'database';
  status: 'connected' | 'disconnected' | 'error';
  keys: number;
  memory: {
    used: number;
    peak: number;
    limit: number;
  };
  performance: {
    hits: number;
    misses: number;
    hitRate: number;
    avgResponseTime: number;
  };
  evictions: number;
  expired: number;
}

// Queue status
export interface QueueStatus {
  name: string;
  status: 'active' | 'paused' | 'error';
  jobs: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  };
  workers: {
    total: number;
    active: number;
    idle: number;
  };
  performance: {
    processedPerMinute: number;
    avgProcessingTime: number;
    failureRate: number;
  };
}

// Email service status
export interface EmailServiceStatus {
  status: 'active' | 'inactive' | 'error';
  provider: string;
  quota: {
    used: number;
    limit: number;
    percentage: number;
  };
  sentToday: number;
  sentThisMonth: number;
  failedToday: number;
  lastSent: Date;
  lastError?: {
    message: string;
    timestamp: Date;
  };
}

// File storage status
export interface FileStorageStatus {
  provider: 'local' | 's3' | 'cloudinary' | 'gcs';
  status: 'connected' | 'disconnected' | 'error';
  storage: {
    used: number;
    total: number;
    percentage: number;
  };
  files: {
    total: number;
    images: number;
    documents: number;
    videos: number;
    others: number;
  };
  bandwidth: {
    upload: number;
    download: number;
  };
}

// System configuration
export interface SystemConfig {
  key: string;
  value: any;
  description?: string;
  category: string;
  isPublic: boolean;
  isRequired: boolean;
  validation?: {
    type: string;
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
  };
  updatedAt: Date;
  updatedBy?: number;
}

// Feature flags
export interface FeatureFlag {
  key: string;
  name: string;
  description?: string;
  isEnabled: boolean;
  isPublic: boolean;
  category: string;
  dependencies?: string[];
  rolloutPercentage?: number;
  targetUsers?: number[];
  targetEnvironments?: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: number;
  updatedBy?: number;
}

// Maintenance mode
export interface MaintenanceMode {
  isEnabled: boolean;
  message?: string;
  allowedIPs?: string[];
  allowedUsers?: number[];
  startTime?: Date;
  endTime?: Date;
  reason?: string;
  createdBy?: number;
  createdAt: Date;
  updatedAt: Date;
}

// System health summary
export interface SystemHealthSummary {
  overall: 'healthy' | 'degraded' | 'unhealthy';
  services: Array<{
    name: string;
    status: 'healthy' | 'degraded' | 'unhealthy';
    responseTime: number;
    lastChecked: Date;
    details?: any;
  }>;
  alerts: Array<{
    id: string;
    severity: 'low' | 'medium' | 'high';
    message: string;
    timestamp: Date;
  }>;
  lastUpdated: Date;
}
