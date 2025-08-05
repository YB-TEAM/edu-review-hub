import json
import os
from datetime import datetime
from typing import List, Dict, Any
import pandas as pd

def load_json_data(filename: str) -> List[Dict[str, Any]]:
    """Load dữ liệu từ file JSON"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"File {filename} không tồn tại")
        return []
    except Exception as e:
        print(f"Lỗi khi đọc file {filename}: {e}")
        return []

def combine_university_data() -> List[Dict[str, Any]]:
    """Kết hợp dữ liệu từ các nguồn khác nhau"""
    print("=== KẾT HỢP DỮ LIỆU TRƯỜNG ĐẠI HỌC ===")
    
    all_universities = []
    
    # Load dữ liệu từ crawler cơ bản
    basic_data = load_json_data('universities.json')
    if basic_data:
        print(f"Đã load {len(basic_data)} trường từ crawler cơ bản")
        all_universities.extend(basic_data)
    
    # Load dữ liệu từ crawler nâng cao
    advanced_files = []
    if os.path.exists('crawled_data'):
        for file in os.listdir('crawled_data'):
            if file.startswith('universities_') and file.endswith('.json'):
                advanced_files.append(os.path.join('crawled_data', file))
    
    if advanced_files:
        # Lấy file mới nhất
        latest_file = max(advanced_files, key=os.path.getctime)
        advanced_data = load_json_data(latest_file)
        if advanced_data:
            print(f"Đã load {len(advanced_data)} trường từ crawler nâng cao")
            all_universities.extend(advanced_data)
    
    # Loại bỏ trùng lặp
    unique_universities = []
    seen_names = set()
    
    for uni in all_universities:
        name = uni['name'].lower().strip()
        if name not in seen_names and len(name) > 3:
            seen_names.add(name)
            unique_universities.append(uni)
    
    print(f"Tổng số trường đại học sau khi loại bỏ trùng lặp: {len(unique_universities)}")
    return unique_universities

def enrich_combined_data(universities: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Làm giàu dữ liệu kết hợp"""
    print("Làm giàu dữ liệu...")
    
    for uni in universities:
        # Thêm timestamp
        uni['combined_at'] = datetime.now().isoformat()
        
        # Chuẩn hóa tên trường
        name = uni['name'].strip()
        if name.startswith('Trường '):
            name = name[7:]
        if name.startswith('Đại học '):
            name = name[9:]
        
        uni['normalized_name'] = name
        
        # Phân loại trường
        if any(keyword in name.lower() for keyword in ['bách khoa', 'kỹ thuật', 'công nghệ']):
            uni['category'] = 'Kỹ thuật'
        elif any(keyword in name.lower() for keyword in ['kinh tế', 'thương mại', 'quản trị']):
            uni['category'] = 'Kinh tế'
        elif any(keyword in name.lower() for keyword in ['y', 'dược', 'y tế']):
            uni['category'] = 'Y tế'
        elif any(keyword in name.lower() for keyword in ['sư phạm', 'giáo dục']):
            uni['category'] = 'Sư phạm'
        elif any(keyword in name.lower() for keyword in ['luật', 'pháp']):
            uni['category'] = 'Luật'
        elif any(keyword in name.lower() for keyword in ['ngoại ngữ', 'ngôn ngữ']):
            uni['category'] = 'Ngoại ngữ'
        else:
            uni['category'] = 'Đa ngành'
    
    return universities

def save_combined_data(universities: List[Dict[str, Any]]):
    """Lưu dữ liệu kết hợp"""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    
    # Lưu JSON
    json_filename = f"combined_universities_{timestamp}.json"
    with open(json_filename, 'w', encoding='utf-8') as f:
        json.dump(universities, f, ensure_ascii=False, indent=2)
    print(f"Đã lưu dữ liệu JSON: {json_filename}")
    
    # Lưu CSV
    csv_filename = f"combined_universities_{timestamp}.csv"
    df = pd.DataFrame(universities)
    df.to_csv(csv_filename, index=False, encoding='utf-8-sig')
    print(f"Đã lưu dữ liệu CSV: {csv_filename}")
    
    return json_filename, csv_filename

def generate_statistics(universities: List[Dict[str, Any]]):
    """Tạo thống kê chi tiết"""
    print("\n=== THỐNG KÊ CHI TIẾT ===")
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
    
    # In danh sách 15 trường đầu tiên
    print(f"\nDanh sách 15 trường đầu tiên:")
    for i, uni in enumerate(universities[:15], 1):
        print(f"{i}. {uni['name']} - {uni.get('location', 'N/A')} - {uni.get('category', 'N/A')}")

def main():
    """Hàm chính"""
    print("Bắt đầu kết hợp dữ liệu trường đại học...")
    
    # Kết hợp dữ liệu
    universities = combine_university_data()
    
    if universities:
        # Làm giàu dữ liệu
        universities = enrich_combined_data(universities)
        
        # Lưu dữ liệu
        json_file, csv_file = save_combined_data(universities)
        
        # Tạo thống kê
        generate_statistics(universities)
        
        print(f"\nDữ liệu đã được lưu vào:")
        print(f"- {json_file}")
        print(f"- {csv_file}")
    else:
        print("Không có dữ liệu để kết hợp!")

if __name__ == "__main__":
    main() 