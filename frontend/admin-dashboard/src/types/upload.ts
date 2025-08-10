// Upload types for admin dashboard

// File upload response matching backend UploadImageDto
export interface UploadResponse {
  success: boolean;
  message: string;
  data?: {
    publicId: string;
    url: string;
    secureUrl: string;
    width: number;
    height: number;
    format: string;
    size: number;
    resourceType: string;
    createdAt: Date;
  };
  error?: string;
}

// File upload request
export interface UploadRequest {
  file: File;
  folder?: string;
  allowedTypes?: string[];
  maxSize?: number;
  transformation?: ImageTransformation;
  tags?: string[];
  context?: Record<string, string>;
}

// Image transformation options
export interface ImageTransformation {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'limit' | 'thumb' | 'scale';
  gravity?: 'auto' | 'top' | 'bottom' | 'left' | 'right' | 'center';
  quality?: number;
  format?: 'auto' | 'jpg' | 'png' | 'webp' | 'gif';
  effect?: string;
  overlay?: string;
  underlay?: string;
  border?: string;
  radius?: number;
  angle?: number;
  opacity?: number;
  background?: string;
  color?: string;
  dpr?: number;
  fetchFormat?: 'auto' | 'jpg' | 'png' | 'webp' | 'gif';
  flags?: string[];
}

// File metadata
export interface FileMetadata {
  id: string;
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  dimensions?: {
    width: number;
    height: number;
  };
  url: string;
  thumbnailUrl?: string;
  publicId?: string;
  folder: string;
  tags: string[];
  context: Record<string, string>;
  uploadedBy: number;
  uploadedAt: Date;
  lastAccessed?: Date;
  accessCount: number;
  isPublic: boolean;
  isDeleted: boolean;
}

// File upload progress
export interface UploadProgress {
  loaded: number;
  total: number;
  percentage: number;
  speed: number;
  estimatedTime: number;
  status: 'pending' | 'uploading' | 'processing' | 'completed' | 'error';
}

// File validation
export interface FileValidation {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  maxSize: number;
  allowedTypes: string[];
  allowedExtensions: string[];
}

// Bulk upload request
export interface BulkUploadRequest {
  files: File[];
  folder: string;
  tags?: string[];
  context?: Record<string, string>;
  transformation?: ImageTransformation;
  onProgress?: (progress: UploadProgress) => void;
}

// Bulk upload response
export interface BulkUploadResponse {
  success: boolean;
  results: Array<{
    originalName: string;
    success: boolean;
    data?: any;
    error?: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
  };
}

// File management
export interface FileListRequest {
  folder?: string;
  tags?: string[];
  search?: string;
  uploadedBy?: number;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface FileListResponse {
  files: FileMetadata[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  folders: string[];
  totalSize: number;
}

// File operations
export interface FileOperation {
  fileIds: string[];
  operation: 'move' | 'copy' | 'delete' | 'restore' | 'updateTags' | 'updateContext';
  destination?: string;
  tags?: string[];
  context?: Record<string, string>;
}

// File statistics
export interface FileStats {
  totalFiles: number;
  totalSize: number;
  byType: Record<string, { count: number; size: number }>;
  byFolder: Record<string, { count: number; size: number }>;
  byUser: Record<number, { count: number; size: number }>;
  uploadTrend: Array<{
    date: string;
    count: number;
    size: number;
  }>;
  topFolders: Array<{
    name: string;
    count: number;
    size: number;
  }>;
  topUsers: Array<{
    userId: number;
    username: string;
    count: number;
    size: number;
  }>;
}

// Storage quota
export interface StorageQuota {
  used: number;
  limit: number;
  percentage: number;
  byUser: Record<number, { used: number; limit: number }>;
  byFolder: Record<string, { used: number; limit: number }>;
  warnings: Array<{
    userId: number;
    username: string;
    used: number;
    limit: number;
    percentage: number;
  }>;
}

// File cleanup
export interface FileCleanup {
  orphanedFiles: Array<{
    id: string;
    filename: string;
    size: number;
    lastAccessed: Date;
    reason: string;
  }>;
  duplicateFiles: Array<{
    id: string;
    filename: string;
    size: number;
    duplicates: Array<{
      id: string;
      filename: string;
      uploadedAt: Date;
    }>;
  }>;
  unusedFiles: Array<{
    id: string;
    filename: string;
    size: number;
    lastAccessed: Date;
    accessCount: number;
  }>;
  totalSpaceToFree: number;
}

// CDN configuration
export interface CdnConfig {
  provider: 'cloudinary' | 'aws' | 'gcs' | 'azure';
  baseUrl: string;
  secureUrl: string;
  apiKey: string;
  apiSecret: string;
  cloudName?: string;
  region?: string;
  bucket?: string;
  isActive: boolean;
  settings: {
    autoOptimization: boolean;
    formatOptimization: boolean;
    qualityOptimization: boolean;
    responsiveImages: boolean;
    lazyLoading: boolean;
  };
}

// Image optimization
export interface ImageOptimization {
  enabled: boolean;
  quality: number;
  formats: string[];
  sizes: number[];
  lazyLoading: boolean;
  responsiveImages: boolean;
  webpConversion: boolean;
  compression: {
    jpeg: number;
    png: number;
    webp: number;
  };
}
