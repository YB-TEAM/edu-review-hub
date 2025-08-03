import { DataSource } from 'typeorm';
import { EnhancedUniversitySeeder } from './enhanced-university.seeder';
import { dataSource } from '../data-source';

async function runEnhancedSeeder() {
  console.log('🚀 Starting Enhanced University Seeder...');
  
  try {
    // Initialize database connection
    await dataSource.initialize();
    console.log('✅ Database connection established');

    // Create and run the enhanced seeder
    const seeder = new EnhancedUniversitySeeder(dataSource);
    await seeder.run();

    console.log('🎉 Enhanced University Seeder completed successfully!');
  } catch (error) {
    console.error('❌ Error running enhanced seeder:', error);
    process.exit(1);
  } finally {
    // Close database connection
    if (dataSource.isInitialized) {
      await dataSource.destroy();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the seeder if this file is executed directly
if (require.main === module) {
  runEnhancedSeeder();
}

export { runEnhancedSeeder }; 