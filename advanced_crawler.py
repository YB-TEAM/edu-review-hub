import requests
from bs4 import BeautifulSoup
import json
import time
import pandas as pd
from typing import List, Dict, Any, Optional
import re
from urllib.parse import urljoin, urlparse
import logging
from datetime import datetime
import os

# Thiết lập logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class AdvancedUniversityCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.universities = []
        self.output_dir = "crawled_data"
        
        # Tạo thư mục output nếu chưa có
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def crawl_kenhtuyensinh(self) -> List[Dict[str, Any]]:
        """Crawl từ kênh tuyển sinh"""
        logger.info("Crawling universities from kenh tuyen sinh...")
        url = "https://kenhtuyensinh.vn/danh-sach-truong-dai-hoc"
        
        try:
            response = self.session.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            universities = []
            # Tìm các trường đại học trong danh sách
            university_links = soup.find_all('a', href=re.compile(r'truong-dai-hoc'))
            
            for link in university_links:
                name = link.get_text(strip=True)
                if name and len(name) > 5:
                    university_info = {
                        'name': name,
                        'website': urljoin(url, link.get('href')),
                        'type': 'Đại học',
                        'location': 'Việt Nam',
                        'source': 'kenhtuyensinh.vn'
                    }
                    universities.append(university_info)
            
            logger.info(f"Found {len(universities)} universities from kenh tuyen sinh")
            return universities
            
        except Exception as e:
            logger.error(f"Error crawling kenh tuyen sinh: {e}")
            return []
    
    def crawl_tuyensinh247(self) -> List[Dict[str, Any]]:
        """Crawl từ tuyensinh247.com"""
        logger.info("Crawling universities from tuyensinh247.com...")
        url = "https://tuyensinh247.com/danh-sach-truong-dai-hoc-cao-dang-a0.html"
        
        try:
            response = self.session.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            universities = []
            # Tìm các trường đại học
            university_elements = soup.find_all(['div', 'li'], class_=re.compile(r'university|truong'))
            
            for element in university_elements:
                name = element.get_text(strip=True)
                if name and len(name) > 5 and 'đại học' in name.lower():
                    university_info = {
                        'name': name,
                        'type': 'Đại học',
                        'location': 'Việt Nam',
                        'source': 'tuyensinh247.com'
                    }
                    universities.append(university_info)
            
            logger.info(f"Found {len(universities)} universities from tuyensinh247.com")
            return universities
            
        except Exception as e:
            logger.error(f"Error crawling tuyensinh247.com: {e}")
            return []
    
    def crawl_thongtintuyensinh(self) -> List[Dict[str, Any]]:
        """Crawl từ thongtintuyensinh.vn"""
        logger.info("Crawling universities from thongtintuyensinh.vn...")
        url = "https://thongtintuyensinh.vn/danh-sach-truong-dai-hoc"
        
        try:
            response = self.session.get(url)
            response.raise_for_status()
            soup = BeautifulSoup(response.content, 'html.parser')
            
            universities = []
            # Tìm các trường đại học
            university_elements = soup.find_all(['div', 'li'], class_=re.compile(r'university|truong'))
            
            for element in university_elements:
                name = element.get_text(strip=True)
                if name and len(name) > 5:
                    university_info = {
                        'name': name,
                        'type': 'Đại học',
                        'location': 'Việt Nam',
                        'source': 'thongtintuyensinh.vn'
                    }
                    universities.append(university_info)
            
            logger.info(f"Found {len(universities)} universities from thongtintuyensinh.vn")
            return universities
            
        except Exception as e:
            logger.error(f"Error crawling thongtintuyensinh.vn: {e}")
            return []
    
    def crawl_manual_data(self) -> List[Dict[str, Any]]:
        """Thêm dữ liệu thủ công từ các nguồn đáng tin cậy"""
        logger.info("Adding manual university data...")
        
        manual_universities = [
            {
                'name': 'Đại học Bách khoa Hà Nội',
                'address': 'Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội',
                'website': 'https://www.hust.edu.vn',
                'type': 'Đại học công lập',
                'location': 'Hà Nội',
                'source': 'Manual'
            },
            {
                'name': 'Đại học Quốc gia Hà Nội',
                'address': '144 Xuân Thủy, Cầu Giấy, Hà Nội',
                'website': 'https://www.vnu.edu.vn',
                'type': 'Đại học công lập',
                'location': 'Hà Nội',
                'source': 'Manual'
            },
            {
                'name': 'Đại học Bách khoa TP.HCM',
                'address': '268 Lý Thường Kiệt, Quận 10, TP.HCM',
                'website': 'https://www.hcmut.edu.vn',
                'type': 'Đại học công lập',
                'location': 'TP.HCM',
                'source': 'Manual'
            },
            {
                'name': 'Đại học Quốc gia TP.HCM',
                'address': 'Linh Trung, Thủ Đức, TP.HCM',
                'website': 'https://www.vnuhcm.edu.vn',
                'type': 'Đại học công lập',
                'location': 'TP.HCM',
                'source': 'Manual'
            },
            {
                'name': 'Đại học FPT',
                'address': 'Lô E2a-7, Đường D1, Khu Công nghệ cao, TP.HCM',
                'website': 'https://fpt.edu.vn',
                'type': 'Đại học tư thục',
                'location': 'TP.HCM',
                'source': 'Manual'
            }
        ]
        
        logger.info(f"Added {len(manual_universities)} manual universities")
        return manual_universities
    
    def enrich_university_data(self, universities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Làm giàu dữ liệu trường đại học"""
        logger.info("Enriching university data...")
        
        for uni in universities:
            # Thêm timestamp
            uni['crawled_at'] = datetime.now().isoformat()
            
            # Chuẩn hóa tên trường
            name = uni['name'].strip()
            if name.startswith('Trường '):
                name = name[7:]  # Bỏ "Trường " ở đầu
            if name.startswith('Đại học '):
                name = name[9:]  # Bỏ "Đại học " ở đầu
            
            uni['normalized_name'] = name
            
            # Thêm loại trường dựa trên tên
            if any(keyword in name.lower() for keyword in ['bách khoa', 'kỹ thuật']):
                uni['category'] = 'Kỹ thuật'
            elif any(keyword in name.lower() for keyword in ['kinh tế', 'thương mại']):
                uni['category'] = 'Kinh tế'
            elif any(keyword in name.lower() for keyword in ['y', 'dược']):
                uni['category'] = 'Y tế'
            elif any(keyword in name.lower() for keyword in ['sư phạm', 'giáo dục']):
                uni['category'] = 'Sư phạm'
            else:
                uni['category'] = 'Đa ngành'
        
        return universities
    
    def crawl_all_sources(self) -> List[Dict[str, Any]]:
        """Crawl từ tất cả các nguồn"""
        all_universities = []
        
        # Crawl từ các nguồn khác nhau
        sources = [
            self.crawl_kenhtuyensinh,
            self.crawl_tuyensinh247,
            self.crawl_thongtintuyensinh,
            self.crawl_manual_data
        ]
        
        for source_func in sources:
            try:
                universities = source_func()
                all_universities.extend(universities)
                time.sleep(2)  # Delay để tránh spam
            except Exception as e:
                logger.error(f"Error in source {source_func.__name__}: {e}")
        
        # Loại bỏ trùng lặp dựa trên tên trường
        unique_universities = []
        seen_names = set()
        
        for uni in all_universities:
            name = uni['name'].lower().strip()
            if name not in seen_names and len(name) > 3:
                seen_names.add(name)
                unique_universities.append(uni)
        
        # Làm giàu dữ liệu
        unique_universities = self.enrich_university_data(unique_universities)
        
        logger.info(f"Total unique universities found: {len(unique_universities)}")
        return unique_universities
    
    def save_to_json(self, universities: List[Dict[str, Any]], filename: str = None):
        """Lưu dữ liệu vào file JSON"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"universities_{timestamp}.json"
        
        filepath = os.path.join(self.output_dir, filename)
        try:
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(universities, f, ensure_ascii=False, indent=2)
            logger.info(f"Data saved to {filepath}")
        except Exception as e:
            logger.error(f"Error saving to JSON: {e}")
    
    def save_to_csv(self, universities: List[Dict[str, Any]], filename: str = None):
        """Lưu dữ liệu vào file CSV"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"universities_{timestamp}.csv"
        
        filepath = os.path.join(self.output_dir, filename)
        try:
            df = pd.DataFrame(universities)
            df.to_csv(filepath, index=False, encoding='utf-8-sig')
            logger.info(f"Data saved to {filepath}")
        except Exception as e:
            logger.error(f"Error saving to CSV: {e}")
    
    def generate_report(self, universities: List[Dict[str, Any]]):
        """Tạo báo cáo chi tiết"""
        logger.info("Generating detailed report...")
        
        # Thống kê theo loại trường
        categories = {}
        locations = {}
        sources = {}
        
        for uni in universities:
            category = uni.get('category', 'Khác')
            location = uni.get('location', 'Không xác định')
            source = uni.get('source', 'Unknown')
            
            categories[category] = categories.get(category, 0) + 1
            locations[location] = locations.get(location, 0) + 1
            sources[source] = sources.get(source, 0) + 1
        
        # Tạo báo cáo
        report = {
            'summary': {
                'total_universities': len(universities),
                'crawled_at': datetime.now().isoformat()
            },
            'statistics': {
                'by_category': categories,
                'by_location': locations,
                'by_source': sources
            },
            'universities': universities
        }
        
        # Lưu báo cáo
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_file = os.path.join(self.output_dir, f"report_{timestamp}.json")
        
        with open(report_file, 'w', encoding='utf-8') as f:
            json.dump(report, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Report saved to {report_file}")
        return report
    
    def print_summary(self, universities: List[Dict[str, Any]]):
        """In tổng kết dữ liệu"""
        print(f"\n=== TỔNG KẾT CHI TIẾT ===")
        print(f"Tổng số trường đại học: {len(universities)}")
        
        # Thống kê theo nguồn
        sources = {}
        categories = {}
        locations = {}
        
        for uni in universities:
            source = uni.get('source', 'Unknown')
            category = uni.get('category', 'Khác')
            location = uni.get('location', 'Không xác định')
            
            sources[source] = sources.get(source, 0) + 1
            categories[category] = categories.get(category, 0) + 1
            locations[location] = locations.get(location, 0) + 1
        
        print(f"\nThống kê theo nguồn:")
        for source, count in sources.items():
            print(f"- {source}: {count} trường")
        
        print(f"\nThống kê theo loại trường:")
        for category, count in categories.items():
            print(f"- {category}: {count} trường")
        
        print(f"\nThống kê theo địa điểm:")
        for location, count in locations.items():
            print(f"- {location}: {count} trường")
        
        # In danh sách 10 trường đầu tiên
        print(f"\nDanh sách 10 trường đầu tiên:")
        for i, uni in enumerate(universities[:10], 1):
            print(f"{i}. {uni['name']} - {uni.get('location', 'N/A')} - {uni.get('category', 'N/A')}")

def main():
    """Hàm chính để chạy advanced crawler"""
    crawler = AdvancedUniversityCrawler()
    
    print("Bắt đầu crawl thông tin các trường đại học tại Việt Nam (Advanced)...")
    
    # Crawl từ tất cả các nguồn
    universities = crawler.crawl_all_sources()
    
    if universities:
        # Lưu dữ liệu
        crawler.save_to_json(universities)
        crawler.save_to_csv(universities)
        
        # Tạo báo cáo
        report = crawler.generate_report(universities)
        
        # In tổng kết
        crawler.print_summary(universities)
        
        print(f"\nDữ liệu đã được lưu vào thư mục: {crawler.output_dir}")
        print("- universities_[timestamp].json")
        print("- universities_[timestamp].csv")
        print("- report_[timestamp].json")
    else:
        print("Không tìm thấy dữ liệu nào!")

if __name__ == "__main__":
    main() 