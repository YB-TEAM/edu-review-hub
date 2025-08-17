export interface BlogImageTrackerServiceInterface {
  /**
   * Extract image URLs from markdown content
   */
  extractImageUrls(content: string): string[];

  /**
   * Track images used in blog content
   */
  trackImagesInBlog(blogId: number, content: string): Promise<void>;

  /**
   * Find orphaned images (not used in any blog)
   */
  findOrphanedImages(): Promise<string[]>;

  /**
   * Clean up orphaned images
   */
  cleanupOrphanedImages(): Promise<void>;

  /**
   * Get all images used in a specific blog
   */
  getBlogImages(blogId: number): Promise<string[]>;

  /**
   * Remove image tracking for a deleted blog
   */
  removeBlogImageTracking(blogId: number): Promise<void>;
}
