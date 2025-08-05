import requests
from bs4 import BeautifulSoup
import json
import time
import pandas as pd
from typing import List, Dict, Any, Optional, Tuple
import re
from urllib.parse import urljoin, urlparse
import logging
from datetime import datetime
import os
from dataclasses import dataclass, asdict
from enum import Enum
import urllib3
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# Disable SSL warnings
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Thiết lập logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class UniversityType(Enum):
    PUBLIC = "public"
    PRIVATE = "private"
    INTERNATIONAL = "international"
    COLLEGE = "college"

class UniversityStatus(Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    SUSPENDED = "suspended"

@dataclass
class UniversityData:
    """Data class cho thông tin trường đại học theo schema"""
    name: str
    short_name: Optional[str] = None
    english_name: Optional[str] = None
    address: Optional[str] = None
    location: Optional[List[str]] = None
    city: Optional[str] = None
    province: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    website: Optional[str] = None
    facebook: Optional[str] = None
    logo_url: Optional[str] = None
    banner_url: Optional[str] = None
    description: Optional[str] = None
    history: Optional[str] = None
    mission: Optional[str] = None
    vision: Optional[str] = None
    type: UniversityType = UniversityType.PUBLIC
    status: UniversityStatus = UniversityStatus.ACTIVE
    founded_year: Optional[int] = None
    accreditation: Optional[str] = None
    specializations: Optional[List[str]] = None
    facilities: Optional[List[str]] = None
    achievements: Optional[List[str]] = None
    ranking_national: Optional[str] = None
    ranking_international: Optional[str] = None
    student_count: Optional[int] = None
    faculty_count: Optional[int] = None
    acceptance_rate: Optional[float] = None
    tuition_fee_min: Optional[float] = None
    tuition_fee_max: Optional[float] = None
    currency: str = "VND"
    admission_requirements: Optional[List[str]] = None
    scholarships: Optional[List[str]] = None
    international_partnerships: Optional[List[str]] = None
    campus_map_url: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    is_featured: bool = False
    is_verified: bool = False
    view_count: int = 0
    review_count: int = 0
    average_rating: float = 0.0
    total_rating: int = 0
    source: str = ""
    crawled_at: Optional[str] = None

class ComprehensiveUniversityCrawler:
    def __init__(self):
        # Tạo session với retry strategy
        self.session = requests.Session()
        
        # Cấu hình retry
        retry_strategy = Retry(
            total=3,
            status_forcelist=[429, 500, 502, 503, 504],
            method_whitelist=["HEAD", "GET", "OPTIONS"]
        )
        adapter = HTTPAdapter(max_retries=retry_strategy)
        self.session.mount("http://", adapter)
        self.session.mount("https://", adapter)
        
        # Cấu hình headers
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'vi-VN,vi;q=0.9,en;q=0.8',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
        })
        
        self.output_dir = "comprehensive_crawled_data"
        
        # Tạo thư mục output nếu chưa có
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
    
    def safe_request(self, url: str, timeout: int = 30, verify_ssl: bool = False) -> Optional[requests.Response]:
        """Thực hiện request an toàn với error handling"""
        try:
            response = self.session.get(url, timeout=timeout, verify=verify_ssl)
            response.raise_for_status()
            return response
        except requests.exceptions.RequestException as e:
            logger.warning(f"Request failed for {url}: {e}")
            return None
    
    def extract_contact_info(self, text: str) -> Tuple[Optional[str], Optional[str]]:
        """Trích xuất thông tin liên hệ từ text"""
        phone_pattern = r'(\+84|0)[0-9]{9,10}'
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        
        phone = re.search(phone_pattern, text)
        email = re.search(email_pattern, text)
        
        return phone.group() if phone else None, email.group() if email else None
    
    def extract_founded_year(self, text: str) -> Optional[int]:
        """Trích xuất năm thành lập"""
        year_pattern = r'(?:thành lập|năm|year)\s*(\d{4})'
        match = re.search(year_pattern, text, re.IGNORECASE)
        if match:
            year = int(match.group(1))
            if 1900 <= year <= datetime.now().year:
                return year
        return None
    
    def classify_university_type(self, name: str, description: str = "") -> UniversityType:
        """Phân loại loại trường đại học"""
        text = f"{name} {description}".lower()
        
        if any(keyword in text for keyword in ['quốc tế', 'international']):
            return UniversityType.INTERNATIONAL
        elif any(keyword in text for keyword in ['tư thục', 'private', 'dân lập']):
            return UniversityType.PRIVATE
        elif any(keyword in text for keyword in ['cao đẳng', 'college']):
            return UniversityType.COLLEGE
        else:
            return UniversityType.PUBLIC
    
    def extract_specializations(self, text: str) -> List[str]:
        """Trích xuất các chuyên ngành"""
        specializations = []
        specialization_keywords = [
            'kỹ thuật', 'công nghệ', 'kinh tế', 'thương mại', 'y tế', 'dược',
            'sư phạm', 'giáo dục', 'luật', 'ngoại ngữ', 'kiến trúc', 'nông nghiệp',
            'thủy sản', 'lâm nghiệp', 'giao thông', 'xây dựng', 'môi trường'
        ]
        
        for keyword in specialization_keywords:
            if keyword in text.lower():
                specializations.append(keyword.title())
        
        return specializations
    
    def extract_facilities(self, text: str) -> List[str]:
        """Trích xuất cơ sở vật chất"""
        facilities = []
        facility_keywords = [
            'thư viện', 'phòng thí nghiệm', 'ký túc xá', 'sân thể thao',
            'bệnh viện', 'trung tâm nghiên cứu', 'xưởng thực hành', 'phòng lab',
            'hội trường', 'căng tin', 'nhà thi đấu', 'bể bơi'
        ]
        
        for keyword in facility_keywords:
            if keyword in text.lower():
                facilities.append(keyword.title())
        
        return facilities
    
    def clean_university_name(self, name: str) -> str:
        """Làm sạch tên trường đại học"""
        if not name:
            return ""
        
        # Loại bỏ các ký tự đặc biệt và số
        name = re.sub(r'\[\d+\]', '', name)  # Loại bỏ [1], [2], etc.
        name = re.sub(r'\([^)]*\)', '', name)  # Loại bỏ (text)
        name = re.sub(r'[^\w\s\-\.]', '', name)  # Chỉ giữ lại chữ cái, số, dấu cách, dấu gạch ngang, dấu chấm
        
        # Loại bỏ khoảng trắng thừa
        name = ' '.join(name.split())
        
        return name
    
    def parse_address(self, address: str) -> Tuple[Optional[str], Optional[str]]:
        """Phân tích địa chỉ để trích xuất thành phố và tỉnh"""
        if not address:
            return None, None
        
        # Các thành phố lớn
        cities = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng']
        provinces = ['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'Cần Thơ', 'Hải Phòng', 'Thừa Thiên Huế']
        
        for city in cities:
            if city in address:
                return city, city
        
        for province in provinces:
            if province in address:
                return None, province
        
        return None, None
    
    def extract_short_name(self, name: str) -> str:
        """Trích xuất tên viết tắt từ tên đầy đủ"""
        if 'Đại học' in name:
            # Tìm từ khóa đặc biệt
            keywords = ['Bách khoa', 'Quốc gia', 'Kinh tế', 'Sư phạm', 'Y', 'Dược', 'Luật', 'Ngoại ngữ']
            for keyword in keywords:
                if keyword in name:
                    return f"ĐH {keyword}"
            
            # Lấy từ cuối cùng
            words = name.split()
            if len(words) > 2:
                return f"ĐH {words[-1]}"
        
        return name[:10] + '...' if len(name) > 10 else name
    
    def generate_english_name(self, name: str) -> str:
        """Tạo tên tiếng Anh từ tên tiếng Việt"""
        name_mapping = {
            'Đại học Bách khoa Hà Nội': 'Hanoi University of Science and Technology',
            'Đại học Quốc gia Hà Nội': 'Vietnam National University, Hanoi',
            'Đại học Bách khoa TP.HCM': 'Ho Chi Minh City University of Technology',
            'Đại học Quốc gia TP.HCM': 'Vietnam National University, Ho Chi Minh City',
            'Đại học FPT': 'FPT University',
        }
        
        return name_mapping.get(name, f"{name} University")
    
    def crawl_wikipedia_comprehensive(self, url: str, location: str) -> List[UniversityData]:
        """Crawl chi tiết từ Wikipedia với xử lý lỗi tốt hơn"""
        logger.info(f"Crawling comprehensive data from Wikipedia: {url}")
        
        response = self.safe_request(url)
        if not response:
            return []
        
        try:
            soup = BeautifulSoup(response.content, 'html.parser')
            
            universities = []
            tables = soup.find_all("table", {"class": "wikitable"})
            
            for table in tables:
                rows = table.find_all("tr")[1:]  # Bỏ dòng tiêu đề
                for row in rows:
                    cols = row.find_all("td")
                    if len(cols) >= 3:
                        name = cols[0].get_text(strip=True)
                        address = cols[1].get_text(strip=True) if len(cols) > 1 else ''
                        website = cols[2].get_text(strip=True) if len(cols) > 2 else ''
                        
                        # Làm sạch tên trường
                        name = self.clean_university_name(name)
                        if not name or len(name) < 5:
                            continue
                        
                        # Trích xuất thông tin liên hệ
                        phone, email = self.extract_contact_info(address)
                        
                        # Phân tích địa chỉ
                        city, province = self.parse_address(address)
                        
                        # Tạo university data
                        uni_data = UniversityData(
                            name=name,
                            short_name=self.extract_short_name(name),
                            english_name=self.generate_english_name(name),
                            address=address,
                            city=city,
                            province=province,
                            location=[city, province] if city and province else [],
                            phone=phone,
                            email=email,
                            website=website,
                            type=self.classify_university_type(name),
                            founded_year=self.extract_founded_year(name),
                            source=f"Wikipedia {location}",
                            is_verified=True,
                            crawled_at=datetime.now().isoformat()
                        )
                        
                        universities.append(uni_data)
            
            logger.info(f"Found {len(universities)} universities from Wikipedia {location}")
            return universities
            
        except Exception as e:
            logger.error(f"Error crawling Wikipedia {location}: {e}")
            return []
    
    def crawl_moet_comprehensive(self) -> List[UniversityData]:
        """Crawl từ Bộ GD&ĐT với nhiều URL khác nhau"""
        logger.info("Crawling comprehensive data from MOET website...")
        
        universities = []
        urls = [
            "https://moet.gov.vn/",
            "https://moet.gov.vn/thong-ke/",
            "https://moet.gov.vn/Pages/default.aspx"
        ]
        
        for url in urls:
            try:
                response = self.safe_request(url)
                if not response:
                    continue
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Tìm các link liên quan đến trường đại học
                links = soup.find_all('a', href=True)
                
                for link in links:
                    text = link.get_text(strip=True)
                    if any(keyword in text.lower() for keyword in ['đại học', 'university', 'trường']):
                        if len(text) > 5:
                            uni_data = UniversityData(
                                name=text,
                                short_name=self.extract_short_name(text),
                                english_name=self.generate_english_name(text),
                                website=urljoin(url, link.get('href')),
                                type=UniversityType.PUBLIC,
                                source="MOET",
                                is_verified=True,
                                crawled_at=datetime.now().isoformat()
                            )
                            universities.append(uni_data)
                
                time.sleep(2)  # Rate limiting
                
            except Exception as e:
                logger.error(f"Error crawling MOET {url}: {e}")
        
        logger.info(f"Found {len(universities)} universities from MOET")
        return universities
    
    def crawl_web_sources(self) -> List[UniversityData]:
        """Crawl từ các nguồn web khác"""
        logger.info("Crawling from various web sources...")
        
        universities = []
        
        # Danh sách các nguồn web
        web_sources = [
            {
                'name': 'tuyensinh247.com',
                'url': 'https://tuyensinh247.com/danh-sach-truong-dai-hoc-cao-dang-a0.html',
                'selectors': ['div', 'li', 'a'],
                'class_pattern': r'university|truong|dai-hoc'
            },
            {
                'name': 'kenhtuyensinh.vn',
                'url': 'https://kenhtuyensinh.vn/danh-sach-truong-dai-hoc',
                'selectors': ['div', 'li', 'a'],
                'class_pattern': r'university|truong|dai-hoc'
            },
            {
                'name': 'thongtintuyensinh.vn',
                'url': 'https://thongtintuyensinh.vn/danh-sach-truong-dai-hoc',
                'selectors': ['div', 'li'],
                'class_pattern': r'university|truong'
            }
        ]
        
        for source in web_sources:
            try:
                response = self.safe_request(source['url'], verify_ssl=False)
                if not response:
                    continue
                
                soup = BeautifulSoup(response.content, 'html.parser')
                
                # Tìm các trường đại học
                university_elements = soup.find_all(
                    source['selectors'], 
                    class_=re.compile(source['class_pattern'])
                )
                
                for element in university_elements:
                    name = element.get_text(strip=True)
                    if name and len(name) > 5 and 'đại học' in name.lower():
                        uni_data = UniversityData(
                            name=name,
                            short_name=self.extract_short_name(name),
                            english_name=self.generate_english_name(name),
                            type=self.classify_university_type(name),
                            location=['Việt Nam'],
                            source=source['name'],
                            is_verified=False,
                            crawled_at=datetime.now().isoformat()
                        )
                        universities.append(uni_data)
                
                time.sleep(1)  # Rate limiting
                
            except Exception as e:
                logger.error(f"Error crawling {source['name']}: {e}")
        
        logger.info(f"Found {len(universities)} universities from web sources")
        return universities
    
    def add_manual_data(self) -> List[UniversityData]:
        """Thêm dữ liệu thủ công từ các nguồn đáng tin cậy"""
        logger.info("Adding manual university data...")
        
        manual_universities = [
            UniversityData(
                name="Đại học Bách khoa Hà Nội",
                short_name="BKHN",
                english_name="Hanoi University of Science and Technology",
                address="Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
                city="Hà Nội",
                province="Hà Nội",
                location=["Hà Nội"],
                phone="024 3869 4242",
                email="contact@hust.edu.vn",
                website="https://www.hust.edu.vn",
                facebook="https://www.facebook.com/dhbkhanoi",
                description="Trường đại học kỹ thuật hàng đầu Việt Nam",
                history="Thành lập năm 1956, là một trong những trường đại học đầu tiên của Việt Nam",
                mission="Đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực kỹ thuật và công nghệ",
                vision="Trở thành trường đại học nghiên cứu hàng đầu khu vực",
                type=UniversityType.PUBLIC,
                founded_year=1956,
                accreditation="AUN-QA",
                specializations=["Kỹ thuật", "Công nghệ", "Kinh tế", "Ngoại ngữ"],
                facilities=["Thư viện", "Phòng thí nghiệm", "Ký túc xá", "Sân thể thao"],
                achievements=["Top 1000 thế giới", "Top 10 Việt Nam"],
                ranking_national="Top 5",
                ranking_international="Top 1000",
                student_count=45000,
                faculty_count=1200,
                acceptance_rate=15.5,
                tuition_fee_min=15000000,
                tuition_fee_max=25000000,
                currency="VND",
                admission_requirements=["Tốt nghiệp THPT", "Điểm thi THPT Quốc gia"],
                scholarships=["Học bổng tài năng", "Học bổng khuyến khích học tập"],
                international_partnerships=["MIT", "Stanford", "Tokyo University"],
                latitude=21.0074,
                longitude=105.8412,
                is_featured=True,
                is_verified=True,
                source="Manual",
                crawled_at=datetime.now().isoformat()
            ),
            UniversityData(
                name="Đại học Quốc gia Hà Nội",
                short_name="VNU",
                english_name="Vietnam National University, Hanoi",
                address="144 Xuân Thủy, Cầu Giấy, Hà Nội",
                city="Hà Nội",
                province="Hà Nội",
                location=["Hà Nội"],
                phone="024 3754 7869",
                email="contact@vnu.edu.vn",
                website="https://www.vnu.edu.vn",
                facebook="https://www.facebook.com/vnuhanoi",
                description="Hệ thống đại học quốc gia hàng đầu Việt Nam",
                history="Thành lập năm 1993, là hệ thống đại học quốc gia đầu tiên",
                mission="Đào tạo nguồn nhân lực chất lượng cao cho đất nước",
                vision="Trở thành đại học nghiên cứu hàng đầu khu vực",
                type=UniversityType.PUBLIC,
                founded_year=1993,
                accreditation="AUN-QA",
                specializations=["Khoa học tự nhiên", "Khoa học xã hội", "Công nghệ", "Y tế"],
                facilities=["Thư viện", "Phòng thí nghiệm", "Bệnh viện", "Trung tâm nghiên cứu"],
                achievements=["Top 1000 thế giới", "Top 3 Việt Nam"],
                ranking_national="Top 3",
                ranking_international="Top 1000",
                student_count=50000,
                faculty_count=1500,
                acceptance_rate=12.0,
                tuition_fee_min=12000000,
                tuition_fee_max=20000000,
                currency="VND",
                admission_requirements=["Tốt nghiệp THPT", "Điểm thi THPT Quốc gia"],
                scholarships=["Học bổng tài năng", "Học bổng nghiên cứu"],
                international_partnerships=["Harvard", "Oxford", "Tokyo University"],
                latitude=21.0368,
                longitude=105.7821,
                is_featured=True,
                is_verified=True,
                source="Manual",
                crawled_at=datetime.now().isoformat()
            ),
            UniversityData(
                name="Đại học FPT",
                short_name="FPT",
                english_name="FPT University",
                address="Lô E2a-7, Đường D1, Khu Công nghệ cao, TP.HCM",
                city="TP.HCM",
                province="TP.HCM",
                location=["TP.HCM"],
                phone="028 7300 1866",
                email="contact@fpt.edu.vn",
                website="https://fpt.edu.vn",
                facebook="https://www.facebook.com/fptuniversity",
                description="Trường đại học tư thục hàng đầu về công nghệ thông tin",
                history="Thành lập năm 2006, thuộc Tập đoàn FPT",
                mission="Đào tạo nguồn nhân lực chất lượng cao trong lĩnh vực CNTT",
                vision="Trở thành trường đại học tư thục hàng đầu Việt Nam",
                type=UniversityType.PRIVATE,
                founded_year=2006,
                accreditation="AUN-QA",
                specializations=["Công nghệ thông tin", "Kinh tế", "Ngôn ngữ", "Truyền thông"],
                facilities=["Thư viện", "Phòng lab", "Ký túc xá", "Sân thể thao"],
                achievements=["Top 10 tư thục Việt Nam", "Đối tác Microsoft"],
                ranking_national="Top 10 tư thục",
                ranking_international="Top 5000",
                student_count=25000,
                faculty_count=800,
                acceptance_rate=25.0,
                tuition_fee_min=25000000,
                tuition_fee_max=35000000,
                currency="VND",
                admission_requirements=["Tốt nghiệp THPT", "Phỏng vấn", "Bài test"],
                scholarships=["Học bổng tài năng", "Học bổng khuyến khích"],
                international_partnerships=["Microsoft", "IBM", "Samsung"],
                latitude=10.8413,
                longitude=106.8098,
                is_featured=True,
                is_verified=True,
                source="Manual",
                crawled_at=datetime.now().isoformat()
            )
        ]
        
        logger.info(f"Added {len(manual_universities)} manual universities")
        return manual_universities
    
    def crawl_all_sources(self) -> List[UniversityData]:
        """Crawl từ tất cả các nguồn"""
        all_universities = []
        
        # Crawl từ các nguồn khác nhau
        sources = [
            lambda: self.crawl_wikipedia_comprehensive(
                "https://vi.wikipedia.org/wiki/Danh_sách_trường_đại_học_và_cao_đẳng_tại_TP._Hồ_Chí_Minh",
                "TP.HCM"
            ),
            lambda: self.crawl_wikipedia_comprehensive(
                "https://vi.wikipedia.org/wiki/Danh_sách_trường_đại_học_và_cao_đẳng_tại_Hà_Nội",
                "Hà Nội"
            ),
            self.crawl_moet_comprehensive,
            self.crawl_web_sources,
            self.add_manual_data
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
            name = uni.name.lower().strip()
            if name not in seen_names and len(name) > 3:
                seen_names.add(name)
                unique_universities.append(uni)
        
        logger.info(f"Total unique universities found: {len(unique_universities)}")
        return unique_universities
    
    def save_to_json(self, universities: List[UniversityData], filename: str = None):
        """Lưu dữ liệu vào file JSON"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"comprehensive_universities_{timestamp}.json"
        
        filepath = os.path.join(self.output_dir, filename)
        try:
            # Convert dataclass to dict and handle enum serialization
            data = []
            for uni in universities:
                uni_dict = asdict(uni)
                # Convert enum values to strings
                uni_dict['type'] = uni_dict['type'].value
                uni_dict['status'] = uni_dict['status'].value
                data.append(uni_dict)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
            logger.info(f"Data saved to {filepath}")
        except Exception as e:
            logger.error(f"Error saving to JSON: {e}")
    
    def save_to_csv(self, universities: List[UniversityData], filename: str = None):
        """Lưu dữ liệu vào file CSV"""
        if filename is None:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"comprehensive_universities_{timestamp}.csv"
        
        filepath = os.path.join(self.output_dir, filename)
        try:
            # Convert dataclass to dict
            data = []
            for uni in universities:
                uni_dict = asdict(uni)
                # Convert enum values to strings
                uni_dict['type'] = uni_dict['type'].value
                uni_dict['status'] = uni_dict['status'].value
                data.append(uni_dict)
            
            df = pd.DataFrame(data)
            df.to_csv(filepath, index=False, encoding='utf-8-sig')
            logger.info(f"Data saved to {filepath}")
        except Exception as e:
            logger.error(f"Error saving to CSV: {e}")
    
    def print_comprehensive_summary(self, universities: List[UniversityData]):
        """In tổng kết chi tiết dữ liệu"""
        print(f"\n=== TỔNG KẾT TOÀN DIỆN ===")
        print(f"Tổng số trường đại học: {len(universities)}")
        
        # Thống kê theo nguồn
        sources = {}
        types = {}
        locations = {}
        specializations = {}
        
        for uni in universities:
            source = uni.source
            uni_type = uni.type.value
            location = uni.city or uni.province or "Không xác định"
            specs = uni.specializations or []
            
            sources[source] = sources.get(source, 0) + 1
            types[uni_type] = types.get(uni_type, 0) + 1
            locations[location] = locations.get(location, 0) + 1
            
            for spec in specs:
                specializations[spec] = specializations.get(spec, 0) + 1
        
        print(f"\nThống kê theo nguồn:")
        for source, count in sources.items():
            print(f"- {source}: {count} trường")
        
        print(f"\nThống kê theo loại trường:")
        for uni_type, count in types.items():
            print(f"- {uni_type}: {count} trường")
        
        print(f"\nThống kê theo địa điểm:")
        for location, count in locations.items():
            print(f"- {location}: {count} trường")
        
        print(f"\nThống kê theo chuyên ngành:")
        for spec, count in specializations.items():
            print(f"- {spec}: {count} trường")
        
        # In danh sách 15 trường đầu tiên với thông tin chi tiết
        print(f"\nDanh sách 15 trường đầu tiên (chi tiết):")
        for i, uni in enumerate(universities[:15], 1):
            print(f"{i}. {uni.name}")
            print(f"   - Tên viết tắt: {uni.short_name}")
            print(f"   - Loại: {uni.type.value}")
            print(f"   - Địa điểm: {uni.city or 'N/A'}")
            print(f"   - Website: {uni.website or 'N/A'}")
            print(f"   - Chuyên ngành: {', '.join(uni.specializations or [])}")
            print(f"   - Năm thành lập: {uni.founded_year or 'N/A'}")
            print()

def main():
    """Hàm chính để chạy comprehensive crawler"""
    crawler = ComprehensiveUniversityCrawler()
    
    print("Bắt đầu crawl thông tin toàn diện các trường đại học tại Việt Nam...")
    
    # Crawl từ tất cả các nguồn
    universities = crawler.crawl_all_sources()
    
    if universities:
        # Lưu dữ liệu
        crawler.save_to_json(universities)
        crawler.save_to_csv(universities)
        
        # In tổng kết
        crawler.print_comprehensive_summary(universities)
        
        print(f"\nDữ liệu đã được lưu vào thư mục: {crawler.output_dir}")
        print("- comprehensive_universities_[timestamp].json")
        print("- comprehensive_universities_[timestamp].csv")
    else:
        print("Không tìm thấy dữ liệu nào!")

if __name__ == "__main__":
    main() 