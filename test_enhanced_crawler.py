#!/usr/bin/env python3
"""
Test script cho Enhanced University Crawler
Kiểm tra các chức năng chính của crawler
"""

import sys
import os
from enhanced_university_crawler import EnhancedUniversityCrawler, UniversityData, UniversityType, UniversityStatus

def test_data_structure():
    """Test cấu trúc dữ liệu"""
    print("🧪 Testing data structure...")
    
    # Test tạo UniversityData
    uni = UniversityData(
        name="Trường Đại học Test",
        short_name="TEST",
        english_name="Test University",
        type=UniversityType.PUBLIC,
        status=UniversityStatus.ACTIVE
    )
    
    assert uni.name == "Trường Đại học Test"
    assert uni.short_name == "TEST"
    assert uni.english_name == "Test University"
    assert uni.type == UniversityType.PUBLIC
    assert uni.status == UniversityStatus.ACTIVE
    
    print("✅ Data structure test passed!")

def test_mapping_functions():
    """Test các hàm mapping"""
    print("🧪 Testing mapping functions...")
    
    crawler = EnhancedUniversityCrawler()
    
    # Test short name mapping
    short_name = crawler.extract_short_name("Trường Đại học Công nghệ Thông tin")
    assert short_name == "UIT"
    
    # Test english name mapping
    english_name = crawler.generate_english_name("Trường Đại học Công nghệ Thông tin")
    assert english_name == "University of Information Technology"
    
    print("✅ Mapping functions test passed!")

def test_data_classification():
    """Test phân loại dữ liệu"""
    print("🧪 Testing data classification...")
    
    crawler = EnhancedUniversityCrawler()
    
    # Test university type classification
    public_type = crawler.classify_university_type("Trường Đại học Công nghệ Thông tin")
    assert public_type == UniversityType.PUBLIC
    
    private_type = crawler.classify_university_type("Trường Đại học FPT")
    assert private_type == UniversityType.PRIVATE
    
    international_type = crawler.classify_university_type("Trường Đại học RMIT")
    assert international_type == UniversityType.INTERNATIONAL
    
    print("✅ Data classification test passed!")

def test_address_parsing():
    """Test phân tích địa chỉ"""
    print("🧪 Testing address parsing...")
    
    crawler = EnhancedUniversityCrawler()
    
    # Test Hà Nội address
    city, province = crawler.parse_address("Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội")
    assert city == "Hà Nội"
    assert province == "Hà Nội"
    
    # Test TP.HCM address
    city, province = crawler.parse_address("Khu phố 6, Phường Linh Trung, TP.HCM")
    assert city == "TP.HCM"
    assert province == "TP.HCM"
    
    print("✅ Address parsing test passed!")

def test_manual_data():
    """Test dữ liệu thủ công"""
    print("🧪 Testing manual data...")
    
    crawler = EnhancedUniversityCrawler()
    manual_universities = crawler.add_manual_data()
    
    assert len(manual_universities) > 0
    
    # Kiểm tra UIT
    uit = next((uni for uni in manual_universities if uni.short_name == "UIT"), None)
    assert uit is not None
    assert uit.name == "Trường Đại học Công nghệ Thông tin"
    assert uit.english_name == "University of Information Technology"
    assert uit.type == UniversityType.PUBLIC
    assert uit.city == "TP.HCM"
    assert uit.phone == "028 3725 2000"
    assert uit.email == "info@uit.edu.vn"
    
    print("✅ Manual data test passed!")

def test_duplicate_removal():
    """Test loại bỏ trùng lặp"""
    print("🧪 Testing duplicate removal...")
    
    crawler = EnhancedUniversityCrawler()
    
    # Tạo dữ liệu trùng lặp
    universities = [
        UniversityData(name="Trường Đại học Test", source="Source 1"),
        UniversityData(name="Trường Đại học Test", source="Source 2"),
        UniversityData(name="Trường Đại học Khác", source="Source 3")
    ]
    
    unique_universities = crawler.remove_duplicates(universities)
    assert len(unique_universities) == 2
    
    print("✅ Duplicate removal test passed!")

def test_data_extraction():
    """Test trích xuất dữ liệu"""
    print("🧪 Testing data extraction...")
    
    crawler = EnhancedUniversityCrawler()
    
    # Test phone and email extraction
    text = "Liên hệ: 028 3725 2000 hoặc info@uit.edu.vn"
    phone, email = crawler.extract_contact_info(text)
    assert phone == "028 3725 2000"
    assert email == "info@uit.edu.vn"
    
    # Test founded year extraction
    year = crawler.extract_founded_year("Trường thành lập năm 2006")
    assert year == 2006
    
    # Test specializations extraction
    specs = crawler.extract_specializations("Trường đào tạo Công nghệ thông tin và Kỹ thuật")
    assert "Công nghệ thông tin" in specs
    assert "Kỹ thuật" in specs
    
    print("✅ Data extraction test passed!")

def run_all_tests():
    """Chạy tất cả test"""
    print("🚀 Starting Enhanced University Crawler Tests...")
    print("=" * 60)
    
    try:
        test_data_structure()
        test_mapping_functions()
        test_data_classification()
        test_address_parsing()
        test_manual_data()
        test_duplicate_removal()
        test_data_extraction()
        
        print("=" * 60)
        print("🎉 All tests passed successfully!")
        print("✅ Enhanced University Crawler is working correctly!")
        
    except Exception as e:
        print("=" * 60)
        print(f"❌ Test failed: {e}")
        sys.exit(1)

if __name__ == "__main__":
    run_all_tests()
