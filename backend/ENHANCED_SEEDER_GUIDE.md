# Enhanced University Seeder Guide

## Overview

The Enhanced University Seeder is designed to integrate crawled university data from the enhanced crawler with the database seeding process. It automatically reads the most recent crawled data file and transforms it into the proper database format.

## Features

- **Automatic Data Discovery**: Automatically finds the most recent crawled data file
- **Data Transformation**: Converts crawled data to match the University entity schema
- **Duplicate Prevention**: Skips universities that already exist in the database
- **Error Handling**: Gracefully handles missing or corrupted data files
- **Backup Data**: Includes manual university data as fallback
- **Review Criteria**: Seeds university review criteria for the rating system

## File Structure

```
backend/src/infrastructure/database/seeds/
├── enhanced-university.seeder.ts    # Main enhanced seeder
├── run-enhanced-seeder.ts           # Script to run the seeder
└── university.seeder.ts             # Original seeder (for reference)
```

## How It Works

### 1. Data Discovery
The seeder automatically looks for crawled data files in these locations:
- `enhanced_crawled_data/enhanced_universities_*.json`
- `crawled_data/universities_*.json`
- `../enhanced_crawled_data/enhanced_universities_*.json`
- `../crawled_data/universities_*.json`

It selects the most recent file based on timestamp.

### 2. Data Transformation
The seeder transforms crawled data to match the University entity:

```typescript
// Example transformation
{
  name: "Đại học Bách khoa Hà Nội",
  short_name: "BKHN",                    // Auto-generated
  english_name: "Hanoi University of Science and Technology", // Auto-generated
  type: UniversityType.PUBLIC,           // Mapped from string
  status: UniversityStatus.ACTIVE,       // Default to active
  // ... other fields
}
```

### 3. Data Validation
- Skips universities with empty names
- Checks for existing universities to prevent duplicates
- Handles missing or null values gracefully

## Usage

### Method 1: Using the Run Script

```bash
# Navigate to backend directory
cd backend

# Run the enhanced seeder
npx ts-node src/infrastructure/database/seeds/run-enhanced-seeder.ts
```

### Method 2: Programmatic Usage

```typescript
import { DataSource } from 'typeorm';
import { EnhancedUniversitySeeder } from './enhanced-university.seeder';
import { dataSource } from '../data-source';

async function seedUniversities() {
  await dataSource.initialize();
  
  const seeder = new EnhancedUniversitySeeder(dataSource);
  await seeder.run();
  
  await dataSource.destroy();
}
```

### Method 3: Integration with Existing Seeders

```typescript
// In your main seeder file
import { EnhancedUniversitySeeder } from './enhanced-university.seeder';

export class MainSeeder {
  async run() {
    // Run enhanced university seeder
    const universitySeeder = new EnhancedUniversitySeeder(this.dataSource);
    await universitySeeder.run();
    
    // Run other seeders...
  }
}
```

## Data Flow

```
Enhanced Crawler → JSON File → Enhanced Seeder → Database
     ↓              ↓              ↓              ↓
  Crawl Data → Save to JSON → Read & Transform → Insert to DB
```

## Expected Output

When running the seeder, you should see output like:

```
🚀 Starting Enhanced University Seeder...
✅ Database connection established
🌱 Enhanced University Seeder starting...
📁 Loading crawled data from: /path/to/enhanced_universities_20250803_220331.json
📊 Found 107 universities in crawled data
✅ Created university: Khoa học Tự nhiên
✅ Created university: Khoa học Xã hội và Nhân văn
✅ Created university: Việt - Nhật
...
📈 Summary: Created 95 universities, Skipped 12 universities
✅ Created manual university: Đại học Bách khoa Hà Nội
✅ Created manual university: Đại học Quốc gia Hà Nội
✅ Enhanced University seeding completed!
🎉 Enhanced University Seeder completed successfully!
🔌 Database connection closed
```

## Configuration

### Customizing Data Sources

To add more data sources, modify the `findCrawledDataFile()` method:

```typescript
private findCrawledDataFile(): string | null {
  const possiblePaths = [
    // Add your custom paths here
    path.join(process.cwd(), 'custom_data', 'universities.json'),
    // ... existing paths
  ];
  // ... rest of the method
}
```

### Customizing Data Transformation

To modify how crawled data is transformed, update the `transformCrawledDataToUniversity()` method:

```typescript
private transformCrawledDataToUniversity(crawledData: CrawledUniversityData): Partial<University> {
  // Add your custom transformation logic here
  return {
    // ... your custom mapping
  };
}
```

## Error Handling

The seeder handles various error scenarios:

1. **Missing Data File**: Logs warning and continues with manual data
2. **Invalid JSON**: Logs error and stops execution
3. **Database Errors**: Logs specific errors for each university
4. **Duplicate Universities**: Skips silently and continues

## Troubleshooting

### Common Issues

1. **"No crawled data file found"**
   - Ensure the enhanced crawler has been run
   - Check file paths in the seeder
   - Verify JSON files exist in expected directories

2. **"Error reading or parsing crawled data"**
   - Check if JSON file is valid
   - Verify file encoding (should be UTF-8)
   - Ensure file is not corrupted

3. **"Error creating university"**
   - Check database connection
   - Verify University entity schema
   - Check for required fields

### Debug Mode

To enable debug logging, add this before running the seeder:

```typescript
// Enable debug logging
process.env.DEBUG = 'true';
```

## Integration with Existing Workflow

### Step 1: Run Enhanced Crawler
```bash
python enhanced_crawler.py
```

### Step 2: Run Enhanced Seeder
```bash
cd backend
npx ts-node src/infrastructure/database/seeds/run-enhanced-seeder.ts
```

### Step 3: Verify Data
```sql
-- Check seeded universities
SELECT name, type, status FROM universities;

-- Check review criteria
SELECT name, type FROM university_review_criteria;
```

## Data Quality

The seeder includes several data quality improvements:

1. **Name Cleaning**: Removes special characters and unwanted words
2. **Type Classification**: Automatically classifies university types
3. **Address Parsing**: Extracts city and province from addresses
4. **Short Name Generation**: Creates meaningful short names
5. **English Name Translation**: Translates Vietnamese names to English

## Performance

- **Batch Processing**: Processes universities one by one for better error handling
- **Duplicate Checking**: Uses database queries to prevent duplicates
- **Memory Efficient**: Reads JSON file in chunks if needed
- **Connection Management**: Properly opens and closes database connections

## Future Enhancements

1. **Batch Insert**: Process universities in batches for better performance
2. **Data Validation**: Add schema validation before insertion
3. **Progress Tracking**: Add progress bars for large datasets
4. **Data Enrichment**: Add more sophisticated data enrichment logic
5. **Geocoding**: Add automatic geocoding for missing coordinates

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the crawled data file format
3. Verify database connection settings
4. Check TypeORM entity definitions 