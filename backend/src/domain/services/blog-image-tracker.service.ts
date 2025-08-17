import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlogImageTrackerServiceInterface } from './blog-image-tracker.service.interface';
import { CloudinaryService } from '../../infrastructure/services/cloudinary.service';
import { BlogImage } from '../../infrastructure/database/entities/blog-image.entity';

@Injectable()
export class BlogImageTrackerService implements BlogImageTrackerServiceInterface {
  constructor(
    @InjectRepository(BlogImage)
    private readonly blogImageRepository: Repository<BlogImage>,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  /**
   * Extract image URLs from markdown content
   * Matches patterns like ![alt](url) or ![alt text](https://example.com/image.jpg)
   */
  extractImageUrls(content: string): string[] {
    if (!content) return [];

    const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    const urls: string[] = [];
    let match;

    while ((match = imageRegex.exec(content)) !== null) {
      const url = match[2];
      if (url && !urls.includes(url)) {
        urls.push(url);
      }
    }

    return urls;
  }

  /**
   * Track images used in blog content
   * This method should be called when creating or updating a blog
   */
  async trackImagesInBlog(blogId: number, content: string): Promise<void> {
    try {
      const imageUrls = this.extractImageUrls(content);
      
      // Get existing tracked images for this blog
      const existingImages = await this.blogImageRepository.find({
        where: { blogId, isActive: true }
      });

      // Deactivate images that are no longer in content
      const existingUrls = existingImages.map(img => img.imageUrl);
      const removedUrls = existingUrls.filter(url => !imageUrls.includes(url));
      
      if (removedUrls.length > 0) {
        await this.blogImageRepository.update(
          { blogId, imageUrl: removedUrls as any },
          { isActive: false }
        );
        console.log(`Deactivated ${removedUrls.length} removed images for blog ${blogId}`);
      }

      // Add new images
      for (const imageUrl of imageUrls) {
        const existingImage = existingImages.find(img => img.imageUrl === imageUrl);
        
        if (!existingImage) {
          // Extract alt text from markdown
          const altText = this.extractAltText(content, imageUrl);
          
          const blogImage = this.blogImageRepository.create({
            blogId,
            imageUrl,
            altText,
            isActive: true
          });
          
          await this.blogImageRepository.save(blogImage);
          console.log(`Added new image tracking for blog ${blogId}: ${imageUrl}`);
        } else if (!existingImage.isActive) {
          // Reactivate existing image
          await this.blogImageRepository.update(
            { id: existingImage.id },
            { isActive: true }
          );
          console.log(`Reactivated image for blog ${blogId}: ${imageUrl}`);
        }
      }
      
      console.log(`Tracking ${imageUrls.length} images for blog ${blogId}:`, imageUrls);
      
    } catch (error) {
      console.error(`Error tracking images for blog ${blogId}:`, error);
      throw error;
    }
  }

  /**
   * Find orphaned images (not used in any blog)
   */
  async findOrphanedImages(): Promise<string[]> {
    try {
      // Get all active images from our tracking system
      const trackedImages = await this.blogImageRepository.find({
        where: { isActive: true },
        select: ['imageUrl']
      });
      
      const trackedUrls = trackedImages.map(img => img.imageUrl);
      
      // TODO: Get all images from Cloudinary and compare
      // For now, return empty array as placeholder
      console.log(`Found ${trackedUrls.length} tracked images`);
      
      return [];
      
    } catch (error) {
      console.error('Error finding orphaned images:', error);
      throw error;
    }
  }

  /**
   * Clean up orphaned images
   */
  async cleanupOrphanedImages(): Promise<void> {
    try {
      const orphanedImages = await this.findOrphanedImages();
      
      if (orphanedImages.length === 0) {
        console.log('No orphaned images found');
        return;
      }

      console.log(`Found ${orphanedImages.length} orphaned images, cleaning up...`);

      for (const imageUrl of orphanedImages) {
        try {
          // Extract public_id from Cloudinary URL
          const publicId = this.extractCloudinaryPublicId(imageUrl);
          if (publicId) {
            await this.cloudinaryService.deleteImage(publicId);
            console.log(`Deleted orphaned image: ${publicId}`);
          }
        } catch (deleteError) {
          console.error(`Failed to delete orphaned image ${imageUrl}:`, deleteError);
        }
      }

      console.log('Orphaned images cleanup completed');
      
    } catch (error) {
      console.error('Error cleaning up orphaned images:', error);
      throw error;
    }
  }

  /**
   * Get all images used in a specific blog
   */
  async getBlogImages(blogId: number): Promise<string[]> {
    try {
      const blogImages = await this.blogImageRepository.find({
        where: { blogId, isActive: true },
        select: ['imageUrl']
      });
      
      return blogImages.map(img => img.imageUrl);
      
    } catch (error) {
      console.error(`Error getting images for blog ${blogId}:`, error);
      throw error;
    }
  }

  /**
   * Remove image tracking for a deleted blog
   */
  async removeBlogImageTracking(blogId: number): Promise<void> {
    try {
      // Delete all image tracking records for this blog
      await this.blogImageRepository.delete({ blogId });
      console.log(`Removed image tracking for deleted blog ${blogId}`);
      
    } catch (error) {
      console.error(`Error removing image tracking for blog ${blogId}:`, error);
      throw error;
    }
  }

  /**
   * Extract alt text from markdown content for a specific image URL
   */
  private extractAltText(content: string, imageUrl: string): string {
    const imageRegex = new RegExp(`!\\[([^\\]]*)\\]\\(${imageUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\)`, 'g');
    const match = imageRegex.exec(content);
    return match ? match[1] : '';
  }

  /**
   * Extract Cloudinary public_id from URL
   */
  private extractCloudinaryPublicId(url: string): string | null {
    try {
      // Handle different Cloudinary URL formats
      if (url.includes('cloudinary.com')) {
        // Extract the path after /upload/ and before the version
        const match = url.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z]+)?$/);
        if (match && match[1]) {
          return match[1];
        }
      }
      return null;
    } catch (error) {
      console.error('Error extracting Cloudinary public_id:', error);
      return null;
    }
  }
}
