import { Command, CommandRunner } from 'nest-commander';
import { Injectable } from '@nestjs/common';
import { BlogImageTrackerService } from '@/domain/services/blog-image-tracker.service';

@Injectable()
@Command({
  name: 'cleanup-orphaned-images',
  description: 'Clean up orphaned images that are no longer used in any blog',
})
export class CleanupOrphanedImagesCommand extends CommandRunner {
  constructor(
    private readonly blogImageTrackerService: BlogImageTrackerService,
  ) {
    super();
  }

  async run(): Promise<void> {
    try {
      console.log('🔍 Starting orphaned images cleanup...');
      
      await this.blogImageTrackerService.cleanupOrphanedImages();
      
      console.log('✅ Orphaned images cleanup completed successfully!');
    } catch (error) {
      console.error('❌ Error during orphaned images cleanup:', error);
      process.exit(1);
    }
  }
}
