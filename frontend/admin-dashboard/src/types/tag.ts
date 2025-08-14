// Tag response matching backend TagResponseDto
export interface Tag {
  id: number;
  name: string;
  description?: string;
  color?: string;
  isActive: boolean;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Tag response wrapper
export interface TagResponse {
  success: boolean;
  message: string;
  data: Tag;
}

// Create tag request
export interface CreateTagRequest {
  name: string;
  description?: string;
  color?: string;
}

// Update tag request
export interface UpdateTagRequest {
  name?: string;
  description?: string;
  color?: string;
  isActive?: boolean;
}

// Tag list response
export interface TagListResponse {
  tags: Tag[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Tag filter options
export interface TagFilter {
  search?: string;
  isActive?: boolean;
  minUsageCount?: number;
}

// Tag query parameters
export interface TagQuery {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: TagFilter;
}

// Tag query parameters for API
export interface TagQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  minUsageCount?: number;
  maxUsageCount?: number;
  createdAfter?: string;
  createdBefore?: string;
  updatedAfter?: string;
  updatedBefore?: string;
}

// Tag statistics
export interface TagStats {
  total: number;
  active: number;
  inactive: number;
  averageUsageCount: number;
  topTags: Array<{
    id: number;
    name: string;
    usageCount: number;
  }>;
}

// Tag statistics for API
export interface TagStatistics {
  totalTags: number;
  activeTags: number;
  inactiveTags: number;
  totalUsage: number;
  averageUsagePerTag: number;
  topTags: Array<{
    id: number;
    name: string;
    usageCount: number;
    percentage: number;
  }>;
  usageDistribution: Array<{
    range: string;
    count: number;
    percentage: number;
  }>;
  growthRate: number;
  monthlyGrowth: Array<{
    month: string;
    newTags: number;
    totalTags: number;
    growthRate: number;
  }>;
}

// Tag analytics
export interface TagAnalytics {
  totalTags: number;
  totalUsage: number;
  mostUsedTags: Array<{
    id: number;
    name: string;
    usageCount: number;
    percentage: number;
  }>;
  usageTrend: Array<{
    month: string;
    newTags: number;
    totalUsage: number;
  }>;
}

// Tag usage information
export interface TagUsage {
  id: number;
  name: string;
  usageCount: number;
  usagePercentage: number;
  lastUsed: Date;
  usageHistory: Array<{
    date: string;
    count: number;
    contentType: string;
    contentId: number;
  }>;
  relatedTags: Array<{
    id: number;
    name: string;
    correlation: number;
  }>;
  contentTypes: Array<{
    type: string;
    count: number;
    percentage: number;
  }>;
}

// Tag suggestions
export interface TagSuggestion {
  id: number;
  name: string;
  confidence: number;
  reason: string;
  alternatives: Array<{
    id: number;
    name: string;
    similarity: number;
  }>;
  usageContext: Array<{
    contentType: string;
    contentId: number;
    relevance: number;
  }>;
}

// Tag relationships
export interface TagRelationship {
  id: number;
  name: string;
  relationshipType: 'synonym' | 'antonym' | 'related' | 'hierarchical';
  strength: number;
  bidirectional: boolean;
}

// Tag content association
export interface TagContent {
  id: number;
  name: string;
  contentType: 'blog' | 'university' | 'review' | 'comment';
  contentId: number;
  contentTitle: string;
  relevance: number;
  addedAt: Date;
}

// Tag bulk operations
export interface TagBulkOperation {
  tagIds: number[];
  operation: 'activate' | 'deactivate' | 'delete' | 'merge' | 'export';
  options?: Record<string, any>;
}

// Tag import/export
export interface TagImportRequest {
  tags: Array<{
    name: string;
    description?: string;
    color?: string;
  }>;
  options: {
    skipDuplicates: boolean;
    updateExisting: boolean;
    validateOnly: boolean;
  };
}

export interface TagExportRequest {
  tagIds?: number[];
  format: 'csv' | 'json' | 'xml';
  includeMetadata: boolean;
  filters?: TagFilter;
}

// Tag moderation
export interface TagModerationRequest {
  tagId: number;
  action: 'approve' | 'reject' | 'flag' | 'ban';
  reason?: string;
  moderatorId: number;
}

// Tag reports
export interface TagReport {
  id: number;
  tagId: number;
  reporterId: number;
  reason: string;
  description?: string;
  status: 'pending' | 'investigating' | 'resolved' | 'dismissed';
  createdAt: Date;
  resolvedAt?: Date;
  moderatorId?: number;
  resolution?: string;
}

// Tag cleanup
export interface TagCleanupRequest {
  criteria: {
    minUsageCount: number;
    inactiveDays: number;
    orphanedOnly: boolean;
  };
  action: 'flag' | 'merge' | 'delete';
  dryRun: boolean;
}

// Tag validation
export interface TagValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  suggestions: string[];
}
