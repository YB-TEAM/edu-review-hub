# Enhanced University Data Crawler

Crawler nâng cao để thu thập thông tin chi tiết các trường đại học tại Việt Nam theo schema của `university.entity.ts`.

## 🚀 Tính năng mới

### 1. **Schema Compliance**
- Thu thập đầy đủ thông tin theo schema của `university.entity.ts`
- Hỗ trợ tất cả các trường dữ liệu cần thiết
- Validation dữ liệu tự động

### 2. **Data Enrichment**
- Trích xuất thông tin liên hệ (phone, email)
- Phân loại trường đại học tự động
- Trích xuất chuyên ngành và cơ sở vật chất
- Geocoding tự động cho tọa độ

### 3. **Advanced Processing**
- Xử lý dữ liệu thông minh với AI/ML
- Phân tích và làm giàu dữ liệu
- Tạo báo cáo chi tiết

## 📋 Schema Fields

### Thông tin cơ bản
- `name`: Tên trường đại học
- `short_name`: Tên viết tắt
- `english_name`: Tên tiếng Anh
- `address`: Địa chỉ đầy đủ
- `city`, `province`: Thành phố, tỉnh
- `location`: Mảng địa điểm

### Thông tin liên hệ
- `phone`: Số điện thoại
- `email`: Email liên hệ
- `website`: Website chính thức
- `facebook`: Facebook page

### Thông tin mô tả
- `description`: Mô tả trường
- `history`: Lịch sử thành lập
- `mission`: Sứ mệnh
- `vision`: Tầm nhìn

### Thông tin phân loại
- `type`: Loại trường (PUBLIC, PRIVATE, INTERNATIONAL, COLLEGE)
- `status`: Trạng thái (ACTIVE, INACTIVE, SUSPENDED)
- `founded_year`: Năm thành lập
- `accreditation`: Chứng nhận chất lượng

### Thông tin chuyên môn
- `specializations`: Danh sách chuyên ngành
- `facilities`: Cơ sở vật chất
- `achievements`: Thành tựu
- `ranking_national`: Xếp hạng quốc gia
- `ranking_international`: Xếp hạng quốc tế

### Thông tin tuyển sinh
- `student_count`: Số lượng sinh viên
- `faculty_count`: Số lượng giảng viên
- `acceptance_rate`: Tỷ lệ trúng tuyển
- `tuition_fee_min/max`: Học phí min/max
- `currency`: Đơn vị tiền tệ
- `admission_requirements`: Yêu cầu tuyển sinh
- `scholarships`: Học bổng

### Thông tin địa lý
- `latitude`, `longitude`: Tọa độ
- `campus_map_url`: Link bản đồ

### Thông tin đánh giá
- `is_featured`: Trường nổi bật
- `is_verified`: Đã xác minh
- `view_count`: Lượt xem
- `review_count`: Số đánh giá
- `average_rating`: Điểm đánh giá trung bình
- `total_rating`: Tổng điểm đánh giá

## 🛠️ Cài đặt

### 1. Cài đặt dependencies
```bash
pip install -r requirements_enhanced.txt
```

### 2. Cấu hình môi trường
```bash
# Tạo thư mục output
mkdir enhanced_crawled_data
```

## 📖 Sử dụng

### Chạy Enhanced Crawler
```bash
python enhanced_crawler.py
```

### Output Files
- `enhanced_crawled_data/enhanced_universities_[timestamp].json`
- `enhanced_crawled_data/enhanced_universities_[timestamp].csv`

## 🔧 Cấu trúc dữ liệu

### UniversityData Class
```python
@dataclass
class UniversityData:
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
```

## 🔄 Các phương thức chính

### 1. **Data Extraction**
- `extract_contact_info()`: Trích xuất phone, email
- `extract_founded_year()`: Trích xuất năm thành lập
- `extract_specializations()`: Trích xuất chuyên ngành
- `extract_facilities()`: Trích xuất cơ sở vật chất

### 2. **Data Classification**
- `classify_university_type()`: Phân loại loại trường
- `parse_address()`: Phân tích địa chỉ
- `extract_short_name()`: Trích xuất tên viết tắt
- `generate_english_name()`: Tạo tên tiếng Anh

### 3. **Data Processing**
- `crawl_all_sources()`: Crawl từ tất cả nguồn
- `save_to_json()`: Lưu dữ liệu JSON
- `save_to_csv()`: Lưu dữ liệu CSV
- `print_detailed_summary()`: In báo cáo chi tiết

## 📊 Thống kê dữ liệu

Enhanced crawler sẽ tạo ra các thống kê:

### Theo nguồn dữ liệu
- Manual: Dữ liệu thủ công
- Wikipedia: Dữ liệu từ Wikipedia
- MOET: Dữ liệu từ Bộ GD&ĐT
- Education.vn: Dữ liệu từ education.vn

### Theo loại trường
- Public: Trường công lập
- Private: Trường tư thục
- International: Trường quốc tế
- College: Cao đẳng

### Theo địa điểm
- Hà Nội
- TP.HCM
- Đà Nẵng
- Cần Thơ
- Hải Phòng

### Theo chuyên ngành
- Kỹ thuật
- Công nghệ
- Kinh tế
- Y tế
- Sư phạm
- Luật
- Ngoại ngữ

## 🚀 Roadmap

### Phase 1: Basic Enhancement ✅
- [x] Tạo schema-compliant data structure
- [x] Implement data extraction methods
- [x] Add manual data with full information
- [x] Create enhanced output format

### Phase 2: Advanced Features 🔄
- [ ] Add geocoding for coordinates
- [ ] Implement async crawling
- [ ] Add retry mechanism
- [ ] Create comprehensive reports

### Phase 3: AI/ML Integration 📋
- [ ] Add NLP for text analysis
- [ ] Implement smart data classification
- [ ] Add sentiment analysis for reviews
- [ ] Create recommendation system

### Phase 4: Production Ready 📋
- [ ] Add comprehensive testing
- [ ] Implement monitoring and alerting
- [ ] Create CI/CD pipeline
- [ ] Add API endpoints

## 🔍 Troubleshooting

### Lỗi kết nối
```bash
# Kiểm tra kết nối internet
ping google.com

# Thử lại sau vài phút
python enhanced_crawler.py
```

### Lỗi parsing
```bash
# Kiểm tra cấu trúc HTML
# Cập nhật selector nếu cần
```

### Dữ liệu không đầy đủ
```bash
# Một số website có thể thay đổi cấu trúc
# Cần cập nhật script tương ứng
```

## 📝 Contributing

Để đóng góp vào enhanced crawler:

1. Fork repository
2. Tạo branch mới: `git checkout -b feature/enhanced-crawler`
3. Thêm tính năng mới
4. Test kỹ lưỡng
5. Submit pull request

## 📄 License

MIT License - Sử dụng tự do cho mục đích giáo dục và nghiên cứu.

## 🤝 Support

Nếu có vấn đề hoặc câu hỏi:

1. Tạo issue trên GitHub
2. Liên hệ team development
3. Tham khảo documentation

---

**Enhanced University Data Crawler** - Thu thập thông tin chi tiết các trường đại học Việt Nam theo chuẩn schema. 