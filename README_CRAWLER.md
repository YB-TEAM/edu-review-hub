# University Data Crawler

Bộ công cụ crawl thông tin các trường đại học tại Việt Nam từ nhiều nguồn khác nhau.

## Tính năng

### 1. Crawler Cơ bản (`crawl_data.py`)
- Crawl từ Wikipedia (TP.HCM và Hà Nội)
- Crawl từ website Bộ GD&ĐT
- Crawl từ education.vn
- Lưu dữ liệu dạng JSON và CSV
- Loại bỏ trùng lặp tự động

### 2. Crawler Nâng cao (`advanced_crawler.py`)
- Tất cả tính năng của crawler cơ bản
- Crawl từ nhiều nguồn bổ sung:
  - kenh tuyen sinh
  - tuyensinh247.com
  - thongtintuyensinh.vn
- Làm giàu dữ liệu tự động:
  - Phân loại trường theo ngành
  - Chuẩn hóa tên trường
  - Thêm timestamp
- Tạo báo cáo chi tiết
- Lưu dữ liệu có timestamp

## Cài đặt

1. Cài đặt Python dependencies:
```bash
pip install -r requirements.txt
```

## Sử dụng

### Chạy Crawler Cơ bản
```bash
python crawl_data.py
```

### Chạy Crawler Nâng cao
```bash
python advanced_crawler.py
```

## Cấu trúc dữ liệu

Mỗi trường đại học sẽ có thông tin:

```json
{
  "name": "Tên trường đại học",
  "address": "Địa chỉ (nếu có)",
  "website": "Website (nếu có)",
  "type": "Loại trường (Đại học/Cao đẳng)",
  "location": "Địa điểm",
  "source": "Nguồn dữ liệu",
  "category": "Phân loại ngành (Advanced crawler)",
  "normalized_name": "Tên đã chuẩn hóa (Advanced crawler)",
  "crawled_at": "Thời gian crawl (Advanced crawler)"
}
```

## Output Files

### Crawler Cơ bản
- `universities.json` - Dữ liệu dạng JSON
- `universities.csv` - Dữ liệu dạng CSV

### Crawler Nâng cao
- `crawled_data/universities_[timestamp].json`
- `crawled_data/universities_[timestamp].csv`
- `crawled_data/report_[timestamp].json` - Báo cáo chi tiết

## Nguồn dữ liệu

### Crawler Cơ bản
1. **Wikipedia TP.HCM**: Danh sách trường đại học TP.HCM
2. **Wikipedia Hà Nội**: Danh sách trường đại học Hà Nội
3. **Bộ GD&ĐT**: Website chính thức
4. **Education.vn**: Website giáo dục

### Crawler Nâng cao
1. Tất cả nguồn từ crawler cơ bản
2. **Kênh tuyển sinh**: Website tuyển sinh
3. **Tuyensinh247.com**: Portal tuyển sinh
4. **Thongtintuyensinh.vn**: Thông tin tuyển sinh
5. **Dữ liệu thủ công**: Các trường đại học lớn

## Phân loại trường (Advanced)

Trường đại học được tự động phân loại theo:
- **Kỹ thuật**: Bách khoa, Kỹ thuật
- **Kinh tế**: Kinh tế, Thương mại
- **Y tế**: Y, Dược
- **Sư phạm**: Sư phạm, Giáo dục
- **Đa ngành**: Các trường khác

## Lưu ý

1. **Rate Limiting**: Script có delay giữa các request để tránh spam
2. **Error Handling**: Xử lý lỗi cho từng nguồn riêng biệt
3. **Data Validation**: Loại bỏ dữ liệu không hợp lệ
4. **Duplicate Removal**: Loại bỏ trùng lặp dựa trên tên trường

## Tùy chỉnh

### Thêm nguồn mới
1. Tạo method crawl mới trong class
2. Thêm vào danh sách sources trong `crawl_all_sources()`

### Thay đổi output format
- Sửa method `save_to_json()` hoặc `save_to_csv()`
- Thêm format mới nếu cần

### Thêm phân loại mới
- Sửa method `enrich_university_data()`
- Thêm logic phân loại mới

## Troubleshooting

### Lỗi kết nối
- Kiểm tra kết nối internet
- Thử lại sau vài phút

### Lỗi parsing
- Kiểm tra cấu trúc HTML của website
- Cập nhật selector nếu cần

### Dữ liệu không đầy đủ
- Một số website có thể thay đổi cấu trúc
- Cần cập nhật script tương ứng

## Đóng góp

Để thêm nguồn dữ liệu mới hoặc cải thiện script:

1. Fork repository
2. Tạo branch mới
3. Thêm tính năng
4. Test kỹ lưỡng
5. Submit pull request

## License

MIT License - Sử dụng tự do cho mục đích giáo dục và nghiên cứu. 