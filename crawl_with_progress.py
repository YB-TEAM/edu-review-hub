# -*- coding: utf-8 -*-
"""
University crawler with progress bar and individual error handling.
This script provides a user-friendly way to crawl multiple universities with visual progress tracking.
"""

import json
import csv
import time
from datetime import datetime
from typing import List, Dict
from university_crawler import crawl_university_to_schema

def load_urls_from_file(filename: str) -> List[str]:
    """Load URLs from text file, skipping empty lines and comments"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            urls = []
            for line_num, line in enumerate(f, 1):
                line = line.strip()
                if line and not line.startswith('#'):
                    # Validate URL format
                    if not line.startswith(('http://', 'https://')):
                        line = 'https://' + line
                    urls.append(line)
        return urls
    except FileNotFoundError:
        print(f"❌ File {filename} not found!")
        return []
    except Exception as e:
        print(f"❌ Error reading file: {e}")
        return []

def crawl_with_progress(urls: List[str], delay: float = 1.0, timeout: int = 20) -> List[Dict]:
    """Crawl universities with progress bar and individual error handling"""
    results = []
    
    print(f"🕷️  Starting to crawl {len(urls)} universities...")
    print(f"⏱️  Estimated time: {len(urls) * delay:.1f} seconds")
    print(f"🔧 Delay between requests: {delay}s, Timeout: {timeout}s")
    print("-" * 60)
    
    for i, url in enumerate(urls, 1):
        print(f"[{i:3d}/{len(urls)}] 🎯 Crawling: {url}")
        
        try:
            start_time = time.time()
            result = crawl_university_to_schema(url, delay=0, timeout=timeout)
            crawl_time = time.time() - start_time
            
            if 'error' in result:
                print(f"     ❌ Failed: {result.get('error', 'Unknown error')}")
            else:
                name = result.get('name', 'Unknown')
                print(f"     ✅ Success: {name} ({crawl_time:.1f}s)")
            
            results.append(result)
            
        except Exception as e:
            print(f"     💥 Exception: {str(e)}")
            # Create error record
            error_record = {
                "website": url if url.startswith("http") else "https://" + url,
                "error": str(e),
                "crawled_at": datetime.utcnow().isoformat()
            }
            results.append(error_record)
        
        # Delay between requests (except for the last one)
        if i < len(urls) and delay > 0:
            print(f"     ⏳ Waiting {delay}s before next request...")
            time.sleep(delay)
        
        print()  # Empty line for readability
    
    return results

def save_results(results: List[Dict], base_filename: str = "universities_data"):
    """Save results to both JSON and CSV formats"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Save to JSON
    json_filename = f"{base_filename}_{timestamp}.json"
    try:
        with open(json_filename, 'w', encoding='utf-8') as f:
            json.dump(results, f, ensure_ascii=False, indent=2)
        print(f"✅ JSON data saved to: {json_filename}")
    except Exception as e:
        print(f"❌ Error saving JSON: {e}")
    
    # Save to CSV
    csv_filename = f"{base_filename}_{timestamp}.csv"
    try:
        if results:
            # Get all possible fields from all records
            all_fields = set()
            for record in results:
                all_fields.update(record.keys())
            
            # Sort fields for consistent ordering
            fieldnames = sorted(list(all_fields))
            
            with open(csv_filename, 'w', newline='', encoding='utf-8-sig') as f:
                writer = csv.DictWriter(f, fieldnames=fieldnames)
                writer.writeheader()
                
                for record in results:
                    # Fill missing fields with empty values
                    row = {field: record.get(field, '') for field in fieldnames}
                    writer.writerow(row)
            
            print(f"✅ CSV data saved to: {csv_filename}")
        else:
            print("⚠️  No data to save to CSV")
    except Exception as e:
        print(f"❌ Error saving CSV: {e}")
    
    return json_filename, csv_filename

def print_summary(results: List[Dict]):
    """Print a summary of the crawling results"""
    print("\n" + "=" * 60)
    print("📊 CRAWLING SUMMARY")
    print("=" * 60)
    
    total = len(results)
    successful = sum(1 for r in results if 'error' not in r)
    failed = total - successful
    
    print(f"🎯 Total universities: {total}")
    print(f"✅ Successful: {successful}")
    print(f"❌ Failed: {failed}")
    print(f"📈 Success rate: {(successful/total*100):.1f}%" if total > 0 else "N/A")
    
    if failed > 0:
        print(f"\n❌ Failed URLs:")
        for result in results:
            if 'error' in result:
                print(f"   - {result.get('website', 'Unknown')}: {result.get('error', 'Unknown error')}")
    
    if successful > 0:
        print(f"\n✅ Successful universities:")
        for result in results:
            if 'error' not in result:
                name = result.get('name', 'Unknown')
                website = result.get('website', 'Unknown')
                print(f"   - {name} ({website})")

def main():
    """Main function to run the university crawler"""
    print("🚀 UNIVERSITY CRAWLER WITH PROGRESS TRACKING")
    print("=" * 60)
    
    # Configuration
    urls_file = "universities.txt"
    delay = 1.0  # seconds between requests
    timeout = 20  # seconds for each request
    
    # Load URLs
    print(f"📚 Loading university URLs from {urls_file}...")
    urls = load_urls_from_file(urls_file)
    
    if not urls:
        print(f"❌ No URLs found in {urls_file}")
        print("Please create the file with university URLs, one per line:")
        print("Example:")
        print("  https://uit.edu.vn")
        print("  https://www.hust.edu.vn")
        print("  https://www.hcmut.edu.vn")
        return
    
    print(f"✅ Loaded {len(urls)} university URLs")
    
    # Ask for confirmation
    print(f"\n⚠️  About to crawl {len(urls)} universities")
    print(f"⏱️  Estimated time: {len(urls) * delay:.1f} seconds")
    
    confirm = input("Continue? (y/N): ").strip().lower()
    if confirm not in ['y', 'yes']:
        print("❌ Crawling cancelled")
        return
    
    # Start crawling
    start_time = time.time()
    results = crawl_with_progress(urls, delay=delay, timeout=timeout)
    total_time = time.time() - start_time
    
    # Save results
    print(f"\n💾 Saving results...")
    json_file, csv_file = save_results(results)
    
    # Print summary
    print_summary(results)
    
    print(f"\n⏱️  Total crawling time: {total_time:.1f} seconds")
    print(f"📁 Files saved:")
    print(f"   - JSON: {json_file}")
    print(f"   - CSV: {csv_file}")
    print("\n🎉 Crawling completed successfully!")

if __name__ == "__main__":
    main()
