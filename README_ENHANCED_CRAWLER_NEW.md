# Enhanced University Data Crawler - Phiên bản mới

Crawler nâng cao để thu thập thông tin chi tiết các trường đại học tại Việt Nam theo **đúng schema** của `university.entity.ts`.

## 🎯 Đặc điểm nổi bật

### 1. **Schema Compliance 100%**

- Thu thập đầy đủ thông tin theo **chính xác** schema của `university.entity.ts`
- Hỗ trợ tất cả các trường dữ liệu cần thiết
- **KHÔNG làm lộn xộn dữ liệu** - các trường không có sẽ để trống

### 2. **Data Accuracy**

- `short_name`: Tên viết tắt chính xác (VD: UIT, HUST, NEU)
- `english_name`: Tên tiếng Anh chuẩn (VD: University of Information Technology)
- `type`: Phân loại chính xác (PUBLIC, PRIVATE, INTERNATIONAL, COLLEGE)
- `status`: Trạng thái chính xác (ACTIVE, INACTIVE, SUSPENDED)

### 3. **Multiple Data Sources**

- **Manual Data**: Dữ liệu thủ công cho các trường lớn
- **Wikipedia**: Hà Nội và TP.HCM
- **Bộ GD&ĐT**: Website chính thức
- **Education.vn**: Portal giáo dục
- **Tuyensinh247.com**: Portal tuyển sinh

## 🚀 Cài đặt

### 1. Cài đặt dependencies

```bash
pip install -r requirements_enhanced.txt
```

### 2. Chạy crawler

```bash
python enhanced_university_crawler.py
```

## 📊 Cấu trúc dữ liệu chính xác

### Thông tin cơ bản

```typescript
{
  name: string,                    // Tên đầy đủ trường đại học
  short_name: string | null,       // Tên viết tắt (UIT, HUST, NEU...)
  english_name: string | null,     // Tên tiếng Anh chuẩn
  address: string | null,          // Địa chỉ đầy đủ
  city: string | null,             // Thành phố
  province: string | null,         // Tỉnh
  location: string[] | null        // Mảng địa điểm
}
```

### Thông tin liên hệ

```typescript
{
  phone: string | null,            // Số điện thoại
  email: string | null,            // Email liên hệ
  website: string | null,          // Website chính thức
  facebook: string | null          // Facebook page
}
```

### Thông tin phân loại

```typescript
{
  type: UniversityType,            // PUBLIC | PRIVATE | INTERNATIONAL | COLLEGE
  status: UniversityStatus,        // ACTIVE | INACTIVE | SUSPENDED
  founded_year: number | null,     // Năm thành lập
  accreditation: string | null     // Chứng nhận chất lượng
}
```

### Thông tin chuyên môn

```typescript
{
  specializations: string[] | null,    // Danh sách chuyên ngành
  facilities: string[] | null,         // Cơ sở vật chất
  achievements: string[] | null,       // Thành tựu
  ranking_national: string | null,     // Xếp hạng quốc gia
  ranking_international: string | null // Xếp hạng quốc tế
}
```

## 🔍 Ví dụ dữ liệu chính xác

### Trường Đại học Công nghệ Thông tin

```json
{
  "name": "Trường Đại học Công nghệ Thông tin",
  "short_name": "UIT",
  "english_name": "University of Information Technology",
  "address": "Khu phố 6, Phường Linh Trung, Thành phố Thủ Đức, TP.HCM",
  "city": "TP.HCM",
  "province": "TP.HCM",
  "phone": "028 3725 2000",
  "email": "info@uit.edu.vn",
  "website": "https://uit.edu.vn",
  "type": "public",
  "status": "active",
  "founded_year": 2006,
  "specializations": [
    "Công nghệ thông tin",
    "Truyền thông và mạng máy tính",
    "Kỹ thuật phần mềm"
  ],
  "facilities": ["Thư viện", "Phòng lab", "Phòng thí nghiệm", "Ký túc xá"],
  "source": "Manual",
  "crawled_at": "2024-01-15T10:30:00"
}
```

### Trường Đại học Bách khoa Hà Nội

```json
{
  "name": "Trường Đại học Bách khoa Hà Nội",
  "short_name": "HUST",
  "english_name": "Hanoi University of Science and Technology",
  "address": "Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội",
  "city": "Hà Nội",
  "province": "Hà Nội",
  "phone": "024 3868 2442",
  "email": "contact@hust.edu.vn",
  "website": "https://hust.edu.vn",
  "type": "public",
  "status": "active",
  "founded_year": 1956,
  "specializations": ["Kỹ thuật", "Công nghệ", "Kinh tế", "Ngoại ngữ"],
  "facilities": ["Thư viện", "Phòng lab", "Phòng thí nghiệm", "Ký túc xá"],
  "source": "Manual",
  "crawled_at": "2024-01-15T10:30:00"
}
```

## 🛠️ Các phương thức chính

### 1. **Data Extraction**

- `extract_contact_info()`: Trích xuất phone, email từ text
- `extract_founded_year()`: Trích xuất năm thành lập
- `extract_specializations()`: Trích xuất chuyên ngành
- `extract_facilities()`: Trích xuất cơ sở vật chất

### 2. **Data Classification**

- `classify_university_type()`: Phân loại loại trường chính xác
- `parse_address()`: Phân tích địa chỉ để lấy city, province
- `extract_short_name()`: Trích xuất tên viết tắt từ mapping
- `generate_english_name()`: Tạo tên tiếng Anh từ mapping

### 3. **Data Sources**

- `crawl_wikipedia_hanoi()`: Crawl từ Wikipedia Hà Nội
- `crawl_wikipedia_hcm()`: Crawl từ Wikipedia TP.HCM
- `crawl_moet()`: Crawl từ Bộ GD&ĐT
- `crawl_education_vn()`: Crawl từ Education.vn
- `crawl_tuyensinh247()`: Crawl từ Tuyensinh247.com
- `add_manual_data()`: Thêm dữ liệu thủ công chính xác

## 📈 Output Files

### 1. **JSON Format**

- `enhanced_crawled_data/enhanced_universities_[timestamp].json`
- Dữ liệu đầy đủ theo schema, dễ import vào database

### 2. **CSV Format**

- `enhanced_crawled_data/enhanced_universities_[timestamp].csv`
- Dữ liệu dạng bảng, dễ xem và phân tích

### 3. **Detailed Report**

- Thống kê theo nguồn dữ liệu
- Thống kê theo loại trường
- Thống kê theo địa điểm
- Thống kê theo chuyên ngành

## 🔧 Tùy chỉnh

### Thêm nguồn mới

1. Tạo method crawl mới trong class
2. Thêm vào danh sách sources trong `crawl_all_sources()`

### Thêm mapping mới

```python
# Thêm vào short_name_mapping
self.short_name_mapping["Tên trường mới"] = "TÊN VIẾT TẮT"

# Thêm vào english_name_mapping
self.english_name_mapping["Tên trường mới"] = "English Name"
```

### Thay đổi output format

- Sửa method `save_to_json()` hoặc `save_to_csv()`
- Thêm format mới nếu cần

## 🚨 Lưu ý quan trọng

### 1. **Data Integrity**

- **KHÔNG làm lộn xộn dữ liệu** giữa các trường
- Các trường không có sẽ để `null` hoặc `""`
- Dữ liệu được validate trước khi lưu

### 2. **Rate Limiting**

- Delay 2 giây giữa các nguồn để tránh spam
- Timeout 30 giây cho mỗi request
- Error handling cho từng nguồn riêng biệt

### 3. **Duplicate Removal**

- Loại bỏ trùng lặp dựa trên tên trường
- Ưu tiên dữ liệu từ nguồn có thông tin đầy đủ hơn

## 🔍 Troubleshooting

### Lỗi kết nối

```bash
# Kiểm tra kết nối internet
ping google.com

# Thử lại sau vài phút
python enhanced_university_crawler.py
```

### Lỗi parsing

```bash
# Một số website có thể thay đổi cấu trúc HTML
# Cần cập nhật selector nếu cần
```

### Dữ liệu không đầy đủ

```bash
# Crawler sẽ tự động để trống các trường không có
# Không làm lộn xộn dữ liệu
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

**Enhanced University Data Crawler** - Thu thập thông tin **chính xác** các trường đại học Việt Nam theo chuẩn schema, **không làm lộn xộn dữ liệu**.
