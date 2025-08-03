# Complete Workflow: Crawler to Database

## Overview
This guide shows the complete workflow from crawling university data to seeding the database.

## Step 1: Run Enhanced Crawler

First, run the enhanced crawler to collect university data:

```bash
# Run the enhanced crawler
python enhanced_crawler.py
```

**Expected Output:**
```
🌐 Enhanced University Crawler Starting...
📊 Crawling from Wikipedia Hà Nội...
✅ Found 104 universities from Wikipedia Hà Nội
📊 Crawling from Wikipedia TP.HCM...
✅ Found 0 universities from Wikipedia TP.HCM
📊 Crawling from MOET...
✅ Found 0 universities from MOET
📊 Crawling from education.vn...
✅ Found 0 universities from education.vn
📊 Crawling from kenhtuyensinh.vn...
✅ Found 0 universities from kenhtuyensinh.vn
📊 Crawling from tuyensinh247.com...
✅ Found 0 universities from tuyensinh247.com
📊 Crawling from thongtintuyensinh.vn...
✅ Found 0 universities from thongtintuyensinh.vn
📊 Crawling from truongdaihoc.com...
✅ Found 0 universities from truongdaihoc.com
📊 Adding comprehensive manual data...
✅ Added 3 manual universities
📊 Removing duplicates...
✅ Found 104 unique universities
💾 Saving to JSON...
✅ Saved 107 universities to enhanced_crawled_data/enhanced_universities_20250803_220331.json
💾 Saving to CSV...
✅ Saved 107 universities to enhanced_crawled_data/enhanced_universities_20250803_220331.csv
📊 Detailed Summary:
   - Total universities: 107
   - Public universities: 107
   - Private universities: 0
   - International universities: 0
   - Universities with contact info: 0
   - Universities with websites: 0
   - Universities with descriptions: 0
   - Universities with specializations: 0
   - Universities with facilities: 0
   - Universities with achievements: 0
   - Universities with rankings: 0
   - Universities with student counts: 0
   - Universities with faculty counts: 0
   - Universities with acceptance rates: 0
   - Universities with tuition fees: 0
   - Universities with admission requirements: 0
   - Universities with scholarships: 0
   - Universities with international partnerships: 0
   - Universities with coordinates: 0
   - Universities with ratings: 0
✅ Enhanced crawler completed successfully!
```

## Step 2: Verify Crawled Data

Check the generated files:

```bash
# List crawled data files
ls -la enhanced_crawled_data/

# View sample of JSON data
head -20 enhanced_crawled_data/enhanced_universities_*.json
```

## Step 3: Run Enhanced Seeder

Navigate to the backend directory and run the enhanced seeder:

```bash
# Navigate to backend
cd backend

# Run the enhanced seeder
npx ts-node src/infrastructure/database/seeds/run-enhanced-seeder.ts
```

**Expected Output:**
```
🚀 Starting Enhanced University Seeder...
✅ Database connection established
🌱 Enhanced University Seeder starting...
📁 Loading crawled data from: /path/to/enhanced_universities_20250803_220331.json
📊 Found 107 universities in crawled data
✅ Created university: Khoa học Tự nhiên
✅ Created university: Khoa học Xã hội và Nhân văn
✅ Created university: Việt - Nhật
✅ Created university: Ngoại ngữ
✅ Created university: Công nghệ
...
📈 Summary: Created 95 universities, Skipped 12 universities
✅ Created manual university: Đại học Bách khoa Hà Nội
✅ Created manual university: Đại học Quốc gia Hà Nội
✅ Enhanced University seeding completed!
🎉 Enhanced University Seeder completed successfully!
🔌 Database connection closed
```

## Step 4: Verify Database Seeding

Check the database to confirm the data was seeded:

```sql
-- Check total universities
SELECT COUNT(*) as total_universities FROM universities;

-- Check university types
SELECT type, COUNT(*) as count 
FROM universities 
GROUP BY type;

-- Check universities by city
SELECT city, COUNT(*) as count 
FROM universities 
WHERE city IS NOT NULL 
GROUP BY city;

-- Check review criteria
SELECT COUNT(*) as total_criteria FROM university_review_criteria;
```

## Step 5: Test API Endpoints

Once seeded, you can test the API endpoints:

```bash
# Start the backend server
npm run start:dev

# Test universities endpoint
curl http://localhost:3000/api/universities

# Test specific university
curl http://localhost:3000/api/universities/1
```

## Troubleshooting

### Common Issues:

1. **Crawler not finding data:**
   - Check internet connection
   - Verify website accessibility
   - Check if websites have changed their structure

2. **Seeder not finding crawled data:**
   - Verify file paths in the seeder
   - Check if JSON file exists and is valid
   - Ensure file permissions are correct

3. **Database connection issues:**
   - Check database configuration
   - Verify database is running
   - Check connection credentials

4. **Data transformation errors:**
   - Check University entity schema
   - Verify data types match
   - Check for required fields

## Customization

### Adding More Data Sources

To add more crawling sources, modify `enhanced_crawler.py`:

```python
def crawl_all_sources(self):
    universities = []
    
    # Add your new source here
    universities.extend(self.crawl_your_new_source())
    
    return universities

def crawl_your_new_source(self):
    # Implement your crawling logic
    pass
```

### Modifying Data Transformation

To change how data is transformed, modify `enhanced-university.seeder.ts`:

```typescript
private transformCrawledDataToUniversity(crawledData: CrawledUniversityData): Partial<University> {
  // Add your custom transformation logic
  return {
    // Your custom mapping
  };
}
```

## Performance Tips

1. **For large datasets:**
   - Consider batch processing
   - Use database transactions
   - Monitor memory usage

2. **For frequent updates:**
   - Implement incremental updates
   - Use upsert operations
   - Add data versioning

3. **For production:**
   - Add proper logging
   - Implement error recovery
   - Add monitoring and alerts

## Next Steps

After successful seeding:

1. **Data Enrichment:** Add more detailed information to universities
2. **Geocoding:** Add coordinates for universities
3. **Image Processing:** Add logos and banners
4. **Review System:** Implement the review and rating system
5. **API Development:** Build comprehensive API endpoints
6. **Frontend Integration:** Connect with the frontend application

This completes the workflow from crawling university data to having it available in your database for the application to use! 