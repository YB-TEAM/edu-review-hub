import json
import os
from typing import Dict, Any, List
from dataclasses import dataclass
from enum import Enum

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
class SchemaField:
    name: str
    type: str
    required: bool
    nullable: bool = True
    max_length: int = None
    enum_values: List[str] = None

class SchemaValidator:
    def __init__(self):
        # Định nghĩa schema theo university.entity.ts
        self.schema = {
            "name": SchemaField("name", "string", True, False, 255),
            "short_name": SchemaField("short_name", "string", False, True, 100),
            "english_name": SchemaField("english_name", "string", False, True, 255),
            "address": SchemaField("address", "string", False, True, 500),
            "location": SchemaField("location", "array", False, True),
            "city": SchemaField("city", "string", False, True, 100),
            "province": SchemaField("province", "string", False, True, 100),
            "phone": SchemaField("phone", "string", False, True, 20),
            "email": SchemaField("email", "string", False, True, 255),
            "website": SchemaField("website", "string", False, True, 500),
            "facebook": SchemaField("facebook", "string", False, True, 500),
            "logo_url": SchemaField("logo_url", "string", False, True, 500),
            "banner_url": SchemaField("banner_url", "string", False, True, 500),
            "description": SchemaField("description", "text", False, True),
            "history": SchemaField("history", "text", False, True),
            "mission": SchemaField("mission", "text", False, True),
            "vision": SchemaField("vision", "text", False, True),
            "type": SchemaField("type", "enum", False, False, enum_values=["public", "private", "international", "college"]),
            "status": SchemaField("status", "enum", False, False, enum_values=["active", "inactive", "suspended"]),
            "founded_year": SchemaField("founded_year", "integer", False, True),
            "accreditation": SchemaField("accreditation", "string", False, True, 100),
            "specializations": SchemaField("specializations", "array", False, True),
            "facilities": SchemaField("facilities", "array", False, True),
            "achievements": SchemaField("achievements", "array", False, True),
            "ranking_national": SchemaField("ranking_national", "string", False, True, 100),
            "ranking_international": SchemaField("ranking_international", "string", False, True, 100),
            "student_count": SchemaField("student_count", "integer", False, True),
            "faculty_count": SchemaField("faculty_count", "integer", False, True),
            "acceptance_rate": SchemaField("acceptance_rate", "decimal", False, True),
            "tuition_fee_min": SchemaField("tuition_fee_min", "decimal", False, True),
            "tuition_fee_max": SchemaField("tuition_fee_max", "decimal", False, True),
            "currency": SchemaField("currency", "string", False, True, 20),
            "admission_requirements": SchemaField("admission_requirements", "array", False, True),
            "scholarships": SchemaField("scholarships", "array", False, True),
            "international_partnerships": SchemaField("international_partnerships", "array", False, True),
            "campus_map_url": SchemaField("campus_map_url", "string", False, True, 500),
            "latitude": SchemaField("latitude", "decimal", False, True),
            "longitude": SchemaField("longitude", "decimal", False, True),
            "is_featured": SchemaField("is_featured", "boolean", False, False),
            "is_verified": SchemaField("is_verified", "boolean", False, False),
            "view_count": SchemaField("view_count", "integer", False, False),
            "review_count": SchemaField("review_count", "integer", False, False),
            "average_rating": SchemaField("average_rating", "decimal", False, False),
            "total_rating": SchemaField("total_rating", "integer", False, False),
            "created_at": SchemaField("created_at", "timestamp", False, False),
            "updated_at": SchemaField("updated_at", "timestamp", False, False),
        }
    
    def validate_field(self, field_name: str, value: Any) -> List[str]:
        """Validate một field theo schema"""
        errors = []
        
        if field_name not in self.schema:
            errors.append(f"Field '{field_name}' không tồn tại trong schema")
            return errors
        
        field_schema = self.schema[field_name]
        
        # Kiểm tra required fields
        if field_schema.required and value is None:
            errors.append(f"Field '{field_name}' là bắt buộc nhưng có giá trị null")
            return errors
        
        # Kiểm tra nullable
        if not field_schema.nullable and value is None:
            errors.append(f"Field '{field_name}' không được phép null")
            return errors
        
        # Kiểm tra type
        if value is not None:
            if field_schema.type == "string":
                if not isinstance(value, str):
                    errors.append(f"Field '{field_name}' phải là string, nhận được {type(value)}")
                elif field_schema.max_length and len(value) > field_schema.max_length:
                    errors.append(f"Field '{field_name}' vượt quá độ dài tối đa {field_schema.max_length}")
            
            elif field_schema.type == "integer":
                if not isinstance(value, int):
                    errors.append(f"Field '{field_name}' phải là integer, nhận được {type(value)}")
            
            elif field_schema.type == "decimal":
                if not isinstance(value, (int, float)):
                    errors.append(f"Field '{field_name}' phải là decimal, nhận được {type(value)}")
            
            elif field_schema.type == "boolean":
                if not isinstance(value, bool):
                    errors.append(f"Field '{field_name}' phải là boolean, nhận được {type(value)}")
            
            elif field_schema.type == "array":
                if not isinstance(value, list):
                    errors.append(f"Field '{field_name}' phải là array, nhận được {type(value)}")
            
            elif field_schema.type == "enum":
                if not isinstance(value, str):
                    errors.append(f"Field '{field_name}' phải là string, nhận được {type(value)}")
                elif value not in field_schema.enum_values:
                    errors.append(f"Field '{field_name}' có giá trị '{value}' không hợp lệ. Giá trị hợp lệ: {field_schema.enum_values}")
            
            elif field_schema.type == "timestamp":
                # Kiểm tra timestamp format
                if not isinstance(value, str):
                    errors.append(f"Field '{field_name}' phải là timestamp string, nhận được {type(value)}")
        
        return errors
    
    def validate_university_data(self, data: Dict[str, Any]) -> Dict[str, List[str]]:
        """Validate toàn bộ dữ liệu trường đại học"""
        validation_results = {}
        
        for field_name, field_schema in self.schema.items():
            value = data.get(field_name)
            errors = self.validate_field(field_name, value)
            if errors:
                validation_results[field_name] = errors
        
        return validation_results
    
    def validate_file(self, file_path: str) -> Dict[str, Any]:
        """Validate file JSON chứa dữ liệu trường đại học"""
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                universities = json.load(f)
            
            results = {
                'file_path': file_path,
                'total_universities': len(universities),
                'valid_universities': 0,
                'invalid_universities': 0,
                'validation_details': []
            }
            
            for i, uni_data in enumerate(universities):
                validation_errors = self.validate_university_data(uni_data)
                
                if validation_errors:
                    results['invalid_universities'] += 1
                    results['validation_details'].append({
                        'index': i,
                        'name': uni_data.get('name', 'Unknown'),
                        'errors': validation_errors
                    })
                else:
                    results['valid_universities'] += 1
            
            return results
            
        except Exception as e:
            return {
                'file_path': file_path,
                'error': str(e)
            }
    
    def print_validation_report(self, results: Dict[str, Any]):
        """In báo cáo validation"""
        print(f"\n=== BÁO CÁO VALIDATION ===")
        print(f"File: {results['file_path']}")
        print(f"Tổng số trường: {results['total_universities']}")
        print(f"Trường hợp lệ: {results['valid_universities']}")
        print(f"Trường không hợp lệ: {results['invalid_universities']}")
        
        if results['validation_details']:
            print(f"\nChi tiết lỗi:")
            for detail in results['validation_details']:
                print(f"\n{detail['index'] + 1}. {detail['name']}")
                for field, errors in detail['errors'].items():
                    for error in errors:
                        print(f"   - {field}: {error}")
        else:
            print(f"\n✅ Tất cả dữ liệu đều hợp lệ!")

def main():
    """Hàm chính để validate dữ liệu"""
    validator = SchemaValidator()
    
    # Tìm file JSON mới nhất
    enhanced_dir = "enhanced_crawled_data"
    if not os.path.exists(enhanced_dir):
        print("Thư mục enhanced_crawled_data không tồn tại!")
        return
    
    json_files = [f for f in os.listdir(enhanced_dir) if f.endswith('.json')]
    if not json_files:
        print("Không tìm thấy file JSON nào!")
        return
    
    # Lấy file mới nhất
    latest_file = max(json_files, key=lambda x: os.path.getctime(os.path.join(enhanced_dir, x)))
    file_path = os.path.join(enhanced_dir, latest_file)
    
    print(f"Validating file: {file_path}")
    
    # Validate file
    results = validator.validate_file(file_path)
    
    # In báo cáo
    if 'error' in results:
        print(f"Error: {results['error']}")
    else:
        validator.print_validation_report(results)

if __name__ == "__main__":
    main() 