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
    """Data class cho thông tin trường đại học theo schema chính xác"""
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

class EnhancedUniversityCrawler:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        })
        self.output_dir = "enhanced_crawled_data"
        
        # Tạo thư mục output nếu chưa có
        if not os.path.exists(self.output_dir):
            os.makedirs(self.output_dir)
        
        # Mapping tên viết tắt cho các trường đại học lớn
        self.short_name_mapping = {
            "Trường Đại học Công nghệ Thông tin": "UIT",
            "Trường Đại học Bách khoa Hà Nội": "HUST",
            "Trường Đại học Bách khoa TP.HCM": "HCMUT",
            "Trường Đại học Kinh tế Quốc dân": "NEU",
            "Trường Đại học Kinh tế TP.HCM": "UEH",
            "Trường Đại học Y Hà Nội": "HMU",
            "Trường Đại học Y Dược TP.HCM": "UMP",
            "Trường Đại học Sư phạm Hà Nội": "HNUE",
            "Trường Đại học Sư phạm TP.HCM": "HCMUE",
            "Trường Đại học Ngoại thương": "FTU",
            "Trường Đại học Luật Hà Nội": "HLU",
            "Trường Đại học Luật TP.HCM": "HCMUL",
            "Trường Đại học Ngoại ngữ": "ULIS",
            "Trường Đại học Khoa học Tự nhiên": "HUS",
            "Trường Đại học Khoa học Xã hội và Nhân văn": "USSH",
            "Trường Đại học Công nghệ": "UET",
            "Trường Đại học Thủy lợi": "TLU",
            "Trường Đại học Giao thông Vận tải": "UTC",
            "Trường Đại học Xây dựng": "NUCE",
            "Trường Đại học Mỏ - Địa chất": "HUMG",
            "Trường Đại học Nông nghiệp Hà Nội": "HUA",
            "Trường Đại học Lâm nghiệp": "VNUF",
            "Trường Đại học Thương mại": "TUC",
            "Trường Đại học Tài chính - Marketing": "UFM",
            "Trường Đại học Ngân hàng TP.HCM": "HUB",
            "Trường Đại học Tôn Đức Thắng": "TDTU",
            "Trường Đại học FPT": "FPTU",
            "Trường Đại học RMIT": "RMIT",
            "Trường Đại học Greenwich": "GUV",
            "Trường Đại học Hoa Sen": "HSU",
            "Trường Đại học Văn Lang": "VLU",
            "Trường Đại học Công nghệ Sài Gòn": "STU",
            "Trường Đại học Kinh tế - Tài chính TP.HCM": "UEF",
            "Trường Đại học Quốc tế": "VNU-HCM",
            "Trường Đại học Quốc tế Hồng Bàng": "HIU",
            "Trường Đại học Công nghệ Thông tin Gia Định": "GDU",
            "Trường Đại học Công nghệ TP.HCM": "HUTECH",
            "Trường Đại học Văn Hiến": "VHU",
            "Trường Đại học Nguyễn Tất Thành": "NTTU",
            "Trường Đại học Công nghiệp TP.HCM": "IUH",
            "Trường Đại học Công nghiệp Hà Nội": "HAUI",
            "Trường Đại học Sư phạm Kỹ thuật TP.HCM": "HCMUTE",
            "Trường Đại học Sư phạm Kỹ thuật Hưng Yên": "UTEHY",
            "Trường Đại học Sư phạm Kỹ thuật Nam Định": "UTE-ND",
            "Trường Đại học Sư phạm Kỹ thuật Vinh": "UTE-V",
            "Trường Đại học Sư phạm Kỹ thuật Đà Nẵng": "UTE-DN"
        }
        
        # Mapping tên tiếng Anh
        self.english_name_mapping = {
            "Trường Đại học Công nghệ Thông tin": "University of Information Technology",
            "Trường Đại học Bách khoa Hà Nội": "Hanoi University of Science and Technology",
            "Trường Đại học Bách khoa TP.HCM": "Ho Chi Minh City University of Technology",
            "Trường Đại học Kinh tế Quốc dân": "National Economics University",
            "Trường Đại học Kinh tế TP.HCM": "University of Economics Ho Chi Minh City",
            "Trường Đại học Y Hà Nội": "Hanoi Medical University",
            "Trường Đại học Y Dược TP.HCM": "University of Medicine and Pharmacy Ho Chi Minh City",
            "Trường Đại học Sư phạm Hà Nội": "Hanoi National University of Education",
            "Trường Đại học Sư phạm TP.HCM": "Ho Chi Minh City University of Education",
            "Trường Đại học Ngoại thương": "Foreign Trade University",
            "Trường Đại học Luật Hà Nội": "Hanoi Law University",
            "Trường Đại học Luật TP.HCM": "Ho Chi Minh City University of Law",
            "Trường Đại học Ngoại ngữ": "University of Languages and International Studies",
            "Trường Đại học Khoa học Tự nhiên": "University of Science",
            "Trường Đại học Khoa học Xã hội và Nhân văn": "University of Social Sciences and Humanities",
            "Trường Đại học Công nghệ": "University of Engineering and Technology",
            "Trường Đại học Thủy lợi": "Thuyloi University",
            "Trường Đại học Giao thông Vận tải": "University of Transport and Communications",
            "Trường Đại học Xây dựng": "National University of Civil Engineering",
            "Trường Đại học Mỏ - Địa chất": "Hanoi University of Mining and Geology",
            "Trường Đại học Nông nghiệp Hà Nội": "Vietnam National University of Agriculture",
            "Trường Đại học Lâm nghiệp": "Vietnam National University of Forestry",
            "Trường Đại học Thương mại": "Thuongmai University",
            "Trường Đại học Tài chính - Marketing": "University of Finance - Marketing",
            "Trường Đại học Ngân hàng TP.HCM": "Ho Chi Minh City University of Banking",
            "Trường Đại học Tôn Đức Thắng": "Ton Duc Thang University",
            "Trường Đại học FPT": "FPT University",
            "Trường Đại học RMIT": "RMIT University Vietnam",
            "Trường Đại học Greenwich": "Greenwich Vietnam",
            "Trường Đại học Hoa Sen": "Hoa Sen University",
            "Trường Đại học Văn Lang": "Van Lang University",
            "Trường Đại học Công nghệ Sài Gòn": "Saigon Technology University",
            "Trường Đại học Kinh tế - Tài chính TP.HCM": "University of Economics and Finance Ho Chi Minh City",
            "Trường Đại học Quốc tế": "Vietnam National University - Ho Chi Minh City International University",
            "Trường Đại học Quốc tế Hồng Bàng": "Hong Bang International University",
            "Trường Đại học Công nghệ Thông tin Gia Định": "Gia Dinh University of Information Technology",
            "Trường Đại học Công nghệ TP.HCM": "Ho Chi Minh City University of Technology",
            "Trường Đại học Văn Hiến": "Van Hien University",
            "Trường Đại học Nguyễn Tất Thành": "Nguyen Tat Thanh University",
            "Trường Đại học Công nghiệp TP.HCM": "Industrial University of Ho Chi Minh City",
            "Trường Đại học Công nghiệp Hà Nội": "Hanoi University of Industry",
            "Trường Đại học Sư phạm Kỹ thuật TP.HCM": "Ho Chi Minh City University of Technology and Education",
            "Trường Đại học Sư phạm Kỹ thuật Hưng Yên": "University of Technical Education Hưng Yên",
            "Trường Đại học Sư phạm Kỹ thuật Nam Định": "University of Technical Education Nam Định",
            "Trường Đại học Sư phạm Kỹ thuật Vinh": "University of Technical Education Vinh",
            "Trường Đại học Sư phạm Kỹ thuật Đà Nẵng": "University of Technical Education Đà Nẵng"
        }

    def extract_contact_info(self, text: str) -> Tuple[Optional[str], Optional[str]]:
        """Trích xuất thông tin liên hệ từ text"""
        phone_pattern = r'(\+84|0)[0-9]{9,10}'
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        
        phone = re.search(phone_pattern, text)
        email = re.search(email_pattern, text)
        
        return phone.group() if phone else None, email.group() if email else None

    def extract_founded_year(self, text: str) -> Optional[int]:
        """Trích xuất năm thành lập từ text"""
        year_pattern = r'(?:thành lập|thành lập năm|năm|năm)\s*(\d{4})'
        match = re.search(year_pattern, text, re.IGNORECASE)
        if match:
            year = int(match.group(1))
            if 1900 <= year <= datetime.now().year:
                return year
        return None

    def extract_specializations(self, text: str) -> Optional[List[str]]:
        """Trích xuất chuyên ngành từ text"""
        # Các từ khóa chuyên ngành
        keywords = [
            'Công nghệ thông tin', 'Kỹ thuật', 'Kinh tế', 'Tài chính', 'Ngân hàng',
            'Y học', 'Dược học', 'Sư phạm', 'Luật', 'Ngoại ngữ', 'Báo chí',
            'Du lịch', 'Khách sạn', 'Thương mại', 'Quản trị kinh doanh',
            'Kế toán', 'Kiểm toán', 'Marketing', 'Truyền thông', 'Thiết kế',
            'Kiến trúc', 'Xây dựng', 'Môi trường', 'Nông nghiệp', 'Lâm nghiệp'
        ]
        
        found = []
        for keyword in keywords:
            if keyword.lower() in text.lower():
                found.append(keyword)
        
        return found if found else None

    def extract_facilities(self, text: str) -> Optional[List[str]]:
        """Trích xuất cơ sở vật chất từ text"""
        facilities = [
            'Thư viện', 'Phòng lab', 'Phòng thí nghiệm', 'Ký túc xá',
            'Nhà thi đấu', 'Sân bóng', 'Căng tin', 'Phòng máy tính',
            'Trung tâm nghiên cứu', 'Phòng học đa phương tiện'
        ]
        
        found = []
        for facility in facilities:
            if facility.lower() in text.lower():
                found.append(facility)
        
        return found if found else None

    def classify_university_type(self, name: str, description: str = "") -> UniversityType:
        """Phân loại loại trường đại học"""
        text = (name + " " + description).lower()
        
        if any(word in text for word in ['cao đẳng', 'college']):
            return UniversityType.COLLEGE
        elif any(word in text for word in ['quốc tế', 'international', 'rmit', 'greenwich']):
            return UniversityType.INTERNATIONAL
        elif any(word in text for word in ['tư thục', 'private', 'fpt', 'hoa sen', 'văn lang']):
            return UniversityType.PRIVATE
        else:
            return UniversityType.PUBLIC

    def parse_address(self, address: str) -> Tuple[Optional[str], Optional[str]]:
        """Phân tích địa chỉ để lấy city và province"""
        if not address:
            return None, None
        
        # Mapping các thành phố lớn
        cities = {
            'Hà Nội': 'Hà Nội',
            'TP.HCM': 'TP.HCM',
            'Thành phố Hồ Chí Minh': 'TP.HCM',
            'Đà Nẵng': 'Đà Nẵng',
            'Cần Thơ': 'Cần Thơ',
            'Hải Phòng': 'Hải Phòng',
            'Huế': 'Thừa Thiên Huế',
            'Nha Trang': 'Khánh Hòa',
            'Vũng Tàu': 'Bà Rịa - Vũng Tàu',
            'Biên Hòa': 'Đồng Nai',
            'Thủ Dầu Một': 'Bình Dương'
        }
        
        city = None
        province = None
        
        for city_name, province_name in cities.items():
            if city_name.lower() in address.lower():
                city = city_name
                province = province_name
                break
        
        return city, province

    def extract_short_name(self, name: str) -> Optional[str]:
        """Trích xuất tên viết tắt từ tên đầy đủ"""
        return self.short_name_mapping.get(name, None)

    def generate_english_name(self, name: str) -> Optional[str]:
        """Tạo tên tiếng Anh từ tên tiếng Việt"""
        return self.english_name_mapping.get(name, None)

    def crawl_wikipedia_hanoi(self) -> List[UniversityData]:
        """Crawl từ Wikipedia Hà Nội"""
        logger.info("Crawling từ Wikipedia Hà Nội...")
        universities = []
        
        try:
            url = "https://vi.wikipedia.org/wiki/Danh_sách_trường_đại_học_tại_Hà_Nội"
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            tables = soup.find_all('table', class_='wikitable')
            
            for table in tables:
                rows = table.find_all('tr')[1:]  # Bỏ header
                for row in rows:
                    cols = row.find_all(['td', 'th'])
                    if len(cols) >= 2:
                        name = cols[0].get_text(strip=True)
                        if name and 'Đại học' in name:
                            # Tạo dữ liệu cơ bản
                            uni_data = UniversityData(
                                name=name,
                                short_name=self.extract_short_name(name),
                                english_name=self.generate_english_name(name),
                                type=self.classify_university_type(name),
                                city="Hà Nội",
                                province="Hà Nội",
                                source="Wikipedia Hà Nội",
                                crawled_at=datetime.now().isoformat()
                            )
                            
                            # Thêm thông tin từ cột khác nếu có
                            if len(cols) > 1:
                                address = cols[1].get_text(strip=True)
                                if address:
                                    uni_data.address = address
                                    city, province = self.parse_address(address)
                                    if city:
                                        uni_data.city = city
                                    if province:
                                        uni_data.province = province
                            
                            universities.append(uni_data)
            
            logger.info(f"Đã crawl được {len(universities)} trường từ Wikipedia Hà Nội")
            
        except Exception as e:
            logger.error(f"Lỗi khi crawl Wikipedia Hà Nội: {e}")
        
        return universities

    def crawl_wikipedia_hcm(self) -> List[UniversityData]:
        """Crawl từ Wikipedia TP.HCM"""
        logger.info("Crawling từ Wikipedia TP.HCM...")
        universities = []
        
        try:
            url = "https://vi.wikipedia.org/wiki/Danh_sách_trường_đại_học_tại_Thành_phố_Hồ_Chí_Minh"
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            tables = soup.find_all('table', class_='wikitable')
            
            for table in tables:
                rows = table.find_all('tr')[1:]  # Bỏ header
                for row in rows:
                    cols = row.find_all(['td', 'th'])
                    if len(cols) >= 2:
                        name = cols[0].get_text(strip=True)
                        if name and 'Đại học' in name:
                            # Tạo dữ liệu cơ bản
                            uni_data = UniversityData(
                                name=name,
                                short_name=self.extract_short_name(name),
                                english_name=self.generate_english_name(name),
                                type=self.classify_university_type(name),
                                city="TP.HCM",
                                province="TP.HCM",
                                source="Wikipedia TP.HCM",
                                crawled_at=datetime.now().isoformat()
                            )
                            
                            # Thêm thông tin từ cột khác nếu có
                            if len(cols) > 1:
                                address = cols[1].get_text(strip=True)
                                if address:
                                    uni_data.address = address
                            
                            universities.append(uni_data)
            
            logger.info(f"Đã crawl được {len(universities)} trường từ Wikipedia TP.HCM")
            
        except Exception as e:
            logger.error(f"Lỗi khi crawl Wikipedia TP.HCM: {e}")
        
        return universities

    def crawl_moet(self) -> List[UniversityData]:
        """Crawl từ website Bộ GD&ĐT"""
        logger.info("Crawling từ Bộ GD&ĐT...")
        universities = []
        
        try:
            # Thử crawl từ các URL khác nhau của Bộ GD&ĐT
            urls = [
                "https://moet.gov.vn/Pages/home.aspx",
                "https://moet.gov.vn/Pages/danh-sach-truong-dai-hoc.aspx"
            ]
            
            for url in urls:
                try:
                    response = self.session.get(url, timeout=30)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.content, 'html.parser')
                        
                        # Tìm các link liên quan đến trường đại học
                        links = soup.find_all('a', href=True)
                        for link in links:
                            text = link.get_text(strip=True)
                            if 'Đại học' in text and len(text) < 100:
                                uni_data = UniversityData(
                                    name=text,
                                    short_name=self.extract_short_name(text),
                                    english_name=self.generate_english_name(text),
                                    type=self.classify_university_type(text),
                                    source="Bộ GD&ĐT",
                                    crawled_at=datetime.now().isoformat()
                                )
                                universities.append(uni_data)
                        
                        break  # Nếu thành công thì dừng
                        
                except Exception as e:
                    logger.warning(f"Không thể crawl từ {url}: {e}")
                    continue
            
            logger.info(f"Đã crawl được {len(universities)} trường từ Bộ GD&ĐT")
            
        except Exception as e:
            logger.error(f"Lỗi khi crawl Bộ GD&ĐT: {e}")
        
        return universities

    def crawl_education_vn(self) -> List[UniversityData]:
        """Crawl từ education.vn"""
        logger.info("Crawling từ education.vn...")
        universities = []
        
        try:
            url = "https://education.vn/truong-dai-hoc"
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Tìm các trường đại học
            university_links = soup.find_all('a', href=True)
            for link in university_links:
                text = link.get_text(strip=True)
                if 'Đại học' in text and len(text) < 100:
                    uni_data = UniversityData(
                        name=text,
                        short_name=self.extract_short_name(text),
                        english_name=self.generate_english_name(text),
                        type=self.classify_university_type(text),
                        source="Education.vn",
                        crawled_at=datetime.now().isoformat()
                    )
                    universities.append(uni_data)
            
            logger.info(f"Đã crawl được {len(universities)} trường từ Education.vn")
            
        except Exception as e:
            logger.error(f"Lỗi khi crawl Education.vn: {e}")
        
        return universities

    def crawl_tuyensinh247(self) -> List[UniversityData]:
        """Crawl từ tuyensinh247.com"""
        logger.info("Crawling từ tuyensinh247.com...")
        universities = []
        
        try:
            url = "https://tuyensinh247.com/truong-dai-hoc-cao-dang.html"
            response = self.session.get(url, timeout=30)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Tìm các trường đại học
            university_elements = soup.find_all(['h3', 'h4', 'a'], class_=lambda x: x and 'title' in x.lower() if x else False)
            for element in university_elements:
                text = element.get_text(strip=True)
                if 'Đại học' in text and len(text) < 100:
                    uni_data = UniversityData(
                        name=text,
                        short_name=self.extract_short_name(text),
                        english_name=self.generate_english_name(text),
                        type=self.classify_university_type(text),
                        source="Tuyensinh247.com",
                        crawled_at=datetime.now().isoformat()
                    )
                    universities.append(uni_data)
            
            logger.info(f"Đã crawl được {len(universities)} trường từ Tuyensinh247.com")
            
        except Exception as e:
            logger.error(f"Lỗi khi crawl Tuyensinh247.com: {e}")
        
        return universities

    def add_manual_data(self) -> List[UniversityData]:
        """Thêm dữ liệu thủ công cho các trường đại học lớn"""
        logger.info("Thêm dữ liệu thủ công...")
        
        manual_universities = [
            UniversityData(
                name="Trường Đại học Công nghệ Thông tin",
                short_name="UIT",
                english_name="University of Information Technology",
                address="Khu phố 6, Phường Linh Trung, Thành phố Thủ Đức, TP.HCM",
                city="TP.HCM",
                province="TP.HCM",
                phone="028 3725 2000",
                email="info@uit.edu.vn",
                website="https://uit.edu.vn",
                facebook="https://facebook.com/UIT.Fanpage",
                description="Trường Đại học Công nghệ Thông tin thuộc Đại học Quốc gia TP.HCM, chuyên đào tạo về công nghệ thông tin và truyền thông.",
                type=UniversityType.PUBLIC,
                founded_year=2006,
                specializations=["Công nghệ thông tin", "Truyền thông và mạng máy tính", "Kỹ thuật phần mềm", "Hệ thống thông tin", "Khoa học máy tính"],
                facilities=["Thư viện", "Phòng lab", "Phòng thí nghiệm", "Ký túc xá"],
                source="Manual",
                crawled_at=datetime.now().isoformat()
            ),
            UniversityData(
                name="Trường Đại học Bách khoa Hà Nội",
                short_name="HUST",
                english_name="Hanoi University of Science and Technology",
                address="Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
                city="Hà Nội",
                province="Hà Nội",
                phone="024 3868 2442",
                email="contact@hust.edu.vn",
                website="https://hust.edu.vn",
                facebook="https://facebook.com/HUST.DHBK",
                description="Trường Đại học Bách khoa Hà Nội là trường đại học kỹ thuật hàng đầu Việt Nam.",
                type=UniversityType.PUBLIC,
                founded_year=1956,
                specializations=["Kỹ thuật", "Công nghệ", "Kinh tế", "Ngoại ngữ"],
                facilities=["Thư viện", "Phòng lab", "Phòng thí nghiệm", "Ký túc xá"],
                source="Manual",
                crawled_at=datetime.now().isoformat()
            ),
            UniversityData(
                name="Trường Đại học Bách khoa TP.HCM",
                short_name="HCMUT",
                english_name="Ho Chi Minh City University of Technology",
                address="268 Lý Thường Kiệt, Quận 10, TP.HCM",
                city="TP.HCM",
                province="TP.HCM",
                phone="028 3865 2222",
                email="info@hcmut.edu.vn",
                website="https://hcmut.edu.vn",
                facebook="https://facebook.com/BachKhoaTPHCM",
                description="Trường Đại học Bách khoa TP.HCM là trường đại học kỹ thuật hàng đầu miền Nam.",
                type=UniversityType.PUBLIC,
                founded_year=1957,
                specializations=["Kỹ thuật", "Công nghệ", "Kinh tế", "Ngoại ngữ"],
                facilities=["Thư viện", "Phòng lab", "Phòng thí nghiệm", "Ký túc xá"],
                source="Manual",
                crawled_at=datetime.now().isoformat()
            ),
            UniversityData(
                name="Trường Đại học Kinh tế Quốc dân",
                short_name="NEU",
                english_name="National Economics University",
                address="207 Giải Phóng, Đồng Tâm, Hai Bà Trưng, Hà Nội",
                city="Hà Nội",
                province="Hà Nội",
                phone="024 3628 0808",
                email="contact@neu.edu.vn",
                website="https://neu.edu.vn",
                facebook="https://facebook.com/NEU.DHKTQD",
                description="Trường Đại học Kinh tế Quốc dân là trường đại học kinh tế hàng đầu Việt Nam.",
                type=UniversityType.PUBLIC,
                founded_year=1956,
                specializations=["Kinh tế", "Tài chính", "Ngân hàng", "Quản trị kinh doanh"],
                facilities=["Thư viện", "Phòng lab", "Phòng thí nghiệm", "Ký túc xá"],
                source="Manual",
                crawled_at=datetime.now().isoformat()
            ),
            UniversityData(
                name="Trường Đại học FPT",
                short_name="FPTU",
                english_name="FPT University",
                address="Lô E2a-7, Đường D1, Khu Công nghệ cao, Quận 9, TP.HCM",
                city="TP.HCM",
                province="TP.HCM",
                phone="028 7300 1866",
                email="daihocfpt@fpt.edu.vn",
                website="https://fpt.edu.vn",
                facebook="https://facebook.com/DaiHocFPT",
                description="Trường Đại học FPT là trường đại học tư thục hàng đầu về công nghệ thông tin.",
                type=UniversityType.PRIVATE,
                founded_year=2006,
                specializations=["Công nghệ thông tin", "Truyền thông", "Kinh tế", "Ngôn ngữ"],
                facilities=["Thư viện", "Phòng lab", "Phòng thí nghiệm", "Ký túc xá"],
                source="Manual",
                crawled_at=datetime.now().isoformat()
            )
        ]
        
        logger.info(f"Đã thêm {len(manual_universities)} trường từ dữ liệu thủ công")
        return manual_universities

    def remove_duplicates(self, universities: List[UniversityData]) -> List[UniversityData]:
        """Loại bỏ trùng lặp dựa trên tên trường"""
        seen_names = set()
        unique_universities = []
        
        for uni in universities:
            normalized_name = uni.name.lower().strip()
            if normalized_name not in seen_names:
                seen_names.add(normalized_name)
                unique_universities.append(uni)
        
        return unique_universities

    def crawl_all_sources(self) -> List[UniversityData]:
        """Crawl từ tất cả nguồn"""
        logger.info("Bắt đầu crawl từ tất cả nguồn...")
        
        all_universities = []
        
        # Crawl từ các nguồn khác nhau
        sources = [
            self.add_manual_data,
            self.crawl_wikipedia_hanoi,
            self.crawl_wikipedia_hcm,
            self.crawl_moet,
            self.crawl_education_vn,
            self.crawl_tuyensinh247
        ]
        
        for source_func in sources:
            try:
                universities = source_func()
                all_universities.extend(universities)
                time.sleep(2)  # Delay giữa các nguồn
            except Exception as e:
                logger.error(f"Lỗi khi crawl từ {source_func.__name__}: {e}")
                continue
        
        # Loại bỏ trùng lặp
        unique_universities = self.remove_duplicates(all_universities)
        
        logger.info(f"Tổng cộng: {len(unique_universities)} trường đại học duy nhất")
        return unique_universities

    def save_to_json(self, universities: List[UniversityData], filename: str = None):
        """Lưu dữ liệu dạng JSON"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"enhanced_universities_{timestamp}.json"
        
        filepath = os.path.join(self.output_dir, filename)
        
        # Chuyển đổi dữ liệu thành dict
        data = []
        for uni in universities:
            uni_dict = asdict(uni)
            # Chuyển enum thành string
            uni_dict['type'] = uni_dict['type'].value
            uni_dict['status'] = uni_dict['status'].value
            data.append(uni_dict)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        
        logger.info(f"Đã lưu dữ liệu vào {filepath}")
        return filepath

    def save_to_csv(self, universities: List[UniversityData], filename: str = None):
        """Lưu dữ liệu dạng CSV"""
        if not filename:
            timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
            filename = f"enhanced_universities_{timestamp}.csv"
        
        filepath = os.path.join(self.output_dir, filename)
        
        # Chuyển đổi dữ liệu thành list of dicts
        data = []
        for uni in universities:
            uni_dict = asdict(uni)
            # Chuyển enum thành string
            uni_dict['type'] = uni_dict['type'].value
            uni_dict['status'] = uni_dict['status'].value
            # Chuyển list thành string
            for key, value in uni_dict.items():
                if isinstance(value, list):
                    uni_dict[key] = ', '.join(value) if value else ""
            data.append(uni_dict)
        
        df = pd.DataFrame(data)
        df.to_csv(filepath, index=False, encoding='utf-8-sig')
        
        logger.info(f"Đã lưu dữ liệu vào {filepath}")
        return filepath

    def print_detailed_summary(self, universities: List[UniversityData]):
        """In báo cáo chi tiết"""
        logger.info("\n" + "="*60)
        logger.info("BÁO CÁO CHI TIẾT CRAWLER")
        logger.info("="*60)
        
        # Thống kê theo nguồn
        source_stats = {}
        for uni in universities:
            source = uni.source
            source_stats[source] = source_stats.get(source, 0) + 1
        
        logger.info(f"\nThống kê theo nguồn:")
        for source, count in source_stats.items():
            logger.info(f"  {source}: {count} trường")
        
        # Thống kê theo loại trường
        type_stats = {}
        for uni in universities:
            uni_type = uni.type.value
            type_stats[uni_type] = type_stats.get(uni_type, 0) + 1
        
        logger.info(f"\nThống kê theo loại trường:")
        for uni_type, count in type_stats.items():
            logger.info(f"  {uni_type}: {count} trường")
        
        # Thống kê theo địa điểm
        city_stats = {}
        for uni in universities:
            city = uni.city or "Không xác định"
            city_stats[city] = city_stats.get(city, 0) + 1
        
        logger.info(f"\nThống kê theo địa điểm:")
        for city, count in sorted(city_stats.items()):
            logger.info(f"  {city}: {count} trường")
        
        # Thống kê theo chuyên ngành
        spec_stats = {}
        for uni in universities:
            if uni.specializations:
                for spec in uni.specializations:
                    spec_stats[spec] = spec_stats.get(spec, 0) + 1
        
        logger.info(f"\nThống kê theo chuyên ngành (top 10):")
        sorted_specs = sorted(spec_stats.items(), key=lambda x: x[1], reverse=True)[:10]
        for spec, count in sorted_specs:
            logger.info(f"  {spec}: {count} trường")
        
        logger.info(f"\nTổng cộng: {len(universities)} trường đại học")
        logger.info("="*60)

def main():
    """Hàm chính"""
    crawler = EnhancedUniversityCrawler()
    
    try:
        # Crawl từ tất cả nguồn
        universities = crawler.crawl_all_sources()
        
        if universities:
            # Lưu dữ liệu
            json_file = crawler.save_to_json(universities)
            csv_file = crawler.save_to_csv(universities)
            
            # In báo cáo
            crawler.print_detailed_summary(universities)
            
            logger.info(f"\nHoàn thành! Dữ liệu đã được lưu vào:")
            logger.info(f"  JSON: {json_file}")
            logger.info(f"  CSV: {csv_file}")
        else:
            logger.error("Không crawl được dữ liệu nào!")
            
    except Exception as e:
        logger.error(f"Lỗi trong quá trình crawl: {e}")

if __name__ == "__main__":
    main()
