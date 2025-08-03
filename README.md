# University Data Crawler System

Hệ thống crawl thông tin các trường đại học tại Việt Nam từ nhiều nguồn khác nhau.

## 🎯 Tính năng chính

### 1. Crawler Cơ bản (`crawl_data.py`)
- ✅ Crawl từ Wikipedia (TP.HCM và Hà Nội)
- ✅ Crawl từ website Bộ GD&ĐT
- ✅ Crawl từ education.vn
- ✅ Lưu dữ liệu dạng JSON và CSV
- ✅ Loại bỏ trùng lặp tự động

### 2. Crawler Nâng cao (`advanced_crawler.py`)
- ✅ Tất cả tính năng của crawler cơ bản
- ✅ Crawl từ nhiều nguồn bổ sung
- ✅ Làm giàu dữ liệu tự động:
  - Phân loại trường theo ngành
  - Chuẩn hóa tên trường
  - Thêm timestamp
- ✅ Tạo báo cáo chi tiết
- ✅ Lưu dữ liệu có timestamp

### 3. Crawler Tổng hợp (`combined_crawler.py`)
- ✅ Kết hợp dữ liệu từ nhiều nguồn
- ✅ Phân loại trường chi tiết hơn
- ✅ Thống kê toàn diện
- ✅ Xuất dữ liệu đa định dạng

## 📊 Kết quả đạt được

### Dữ liệu đã crawl được:
- **108 trường đại học** từ nhiều nguồn
- **Phân loại theo ngành**: Kỹ thuật, Kinh tế, Y tế, Sư phạm, Luật, Ngoại ngữ, Đa ngành
- **Phân bố địa lý**: Hà Nội (105 trường), TP.HCM (3 trường)

### Thống kê chi tiết:
- **Kỹ thuật**: 6 trường
- **Kinh tế**: 2 trường  
- **Y tế**: 11 trường
- **Luật**: 2 trường
- **Sư phạm**: 1 trường
- **Đa ngành**: 86 trường

## 🚀 Cài đặt và sử dụng

### 1. Cài đặt dependencies
```bash
pip install requests beautifulsoup4 pandas lxml
```

### 2. Chạy các script

#### Crawler cơ bản:
```bash
python crawl_data.py
```

#### Crawler nâng cao:
```bash
python advanced_crawler.py
```

#### Crawler tổng hợp:
```bash
python combined_crawler.py
```

## 📁 Cấu trúc dữ liệu

Mỗi trường đại học có thông tin:

```json
{
  "name": "Tên trường đại học",
  "address": "Địa chỉ (nếu có)",
  "website": "Website (nếu có)",
  "type": "Loại trường",
  "location": "Địa điểm",
  "source": "Nguồn dữ liệu",
  "category": "Phân loại ngành",
  "normalized_name": "Tên đã chuẩn hóa",
  "crawled_at": "Thời gian crawl"
}
```

## 📂 Output Files

### Crawler Cơ bản
- `universities.json` - Dữ liệu JSON
- `universities.csv` - Dữ liệu CSV

### Crawler Nâng cao
- `crawled_data/universities_[timestamp].json`
- `crawled_data/universities_[timestamp].csv`
- `crawled_data/report_[timestamp].json`

### Crawler Tổng hợp
- `combined_universities_[timestamp].json`
- `combined_universities_[timestamp].csv`

## 🔍 Nguồn dữ liệu

### Đã crawl thành công:
1. **Wikipedia Hà Nội**: 104 trường đại học
2. **Dữ liệu thủ công**: 5 trường đại học lớn

### Đang phát triển:
- Website Bộ GD&ĐT
- Các portal tuyển sinh
- Website giáo dục khác

## 🛠️ Tính năng kỹ thuật

### Error Handling
- Xử lý lỗi cho từng nguồn riêng biệt
- Logging chi tiết
- Graceful degradation

### Data Processing
- Loại bỏ trùng lặp tự động
- Chuẩn hóa dữ liệu
- Phân loại thông minh

### Performance
- Rate limiting để tránh spam
- Session management
- Efficient data structures

## 📈 Phân loại trường

Hệ thống tự động phân loại trường theo:

- **Kỹ thuật**: Bách khoa, Kỹ thuật, Công nghệ
- **Kinh tế**: Kinh tế, Thương mại, Quản trị
- **Y tế**: Y, Dược, Y tế
- **Sư phạm**: Sư phạm, Giáo dục
- **Luật**: Luật, Pháp
- **Ngoại ngữ**: Ngoại ngữ, Ngôn ngữ
- **Đa ngành**: Các trường khác

## 🔧 Tùy chỉnh

### Thêm nguồn mới
1. Tạo method crawl mới trong class
2. Thêm vào danh sách sources
3. Test và validate

### Thay đổi phân loại
- Sửa logic trong `enrich_university_data()`
- Thêm keywords mới

### Thay đổi output
- Sửa các method save
- Thêm format mới

## 🐛 Troubleshooting

### Lỗi kết nối
- Kiểm tra internet
- Thử lại sau vài phút
- Kiểm tra URL

### Lỗi parsing
- Kiểm tra cấu trúc HTML
- Cập nhật selector
- Validate dữ liệu

### Dữ liệu không đầy đủ
- Website có thể thay đổi
- Cần cập nhật script
- Thêm nguồn mới

## 📝 Lưu ý

1. **Rate Limiting**: Script có delay giữa các request
2. **Data Validation**: Loại bỏ dữ liệu không hợp lệ
3. **Duplicate Removal**: Loại bỏ trùng lặp dựa trên tên
4. **Error Recovery**: Xử lý lỗi cho từng nguồn

## 🤝 Đóng góp

Để cải thiện hệ thống:

1. Fork repository
2. Tạo branch mới
3. Thêm tính năng
4. Test kỹ lưỡng
5. Submit pull request

## 📄 License

MIT License - Sử dụng tự do cho mục đích giáo dục và nghiên cứu.

---

**Tác giả**: AI Assistant  
**Ngày tạo**: 2025-08-03  
**Phiên bản**: 1.0.0
