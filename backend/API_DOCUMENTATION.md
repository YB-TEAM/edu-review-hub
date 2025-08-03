# 📚 API Documentation - Edu Review Hub

## 🎯 TỔNG QUAN

Hệ thống API cho nền tảng đánh giá trường đại học với đầy đủ tính năng quản lý, đánh giá và phân tích.

## 📊 THỐNG KÊ API

- **Tổng số API**: ~120+ endpoints
- **Public APIs**: 45 endpoints
- **Protected APIs**: 60 endpoints  
- **Admin APIs**: 15 endpoints
- **Authentication**: JWT + Refresh Token
- **Authorization**: Role-Based Access Control (RBAC)

## 🎯 ADMIN/SUPERADMIN DASHBOARD & SYSTEM MANAGEMENT

### 📈 Dashboard Analytics APIs (8 endpoints)
- `GET /dashboard/overview` - Tổng quan hệ thống
- `GET /dashboard/statistics` - Thống kê chi tiết
- `GET /dashboard/users/analytics` - Phân tích người dùng
- `GET /dashboard/content/analytics` - Phân tích nội dung
- `GET /dashboard/system/health` - Sức khỏe hệ thống
- `GET /dashboard/reports/:type` - Báo cáo theo loại
- `GET /dashboard/alerts` - Cảnh báo hệ thống
- `GET /dashboard/performance` - Hiệu suất hệ thống

### ⚙️ System Management APIs (15 endpoints)
- `GET /system/settings` - Xem cài đặt hệ thống
- `PATCH /system/settings` - Cập nhật cài đặt
- `POST /system/backup` - Tạo backup
- `GET /system/backups` - Danh sách backup
- `POST /system/backup/:backupId/restore` - Khôi phục backup
- `DELETE /system/backup/:backupId` - Xóa backup
- `POST /system/maintenance` - Bật/tắt chế độ bảo trì
- `GET /system/maintenance` - Trạng thái bảo trì
- `POST /system/cache/clear` - Xóa cache
- `GET /system/logs` - Xem logs hệ thống
- `POST /system/users/:userId/ban` - Cấm người dùng
- `POST /system/users/:userId/unban` - Bỏ cấm người dùng
- `GET /system/banned-users` - Danh sách người dùng bị cấm
- `POST /system/system/restart` - Khởi động lại hệ thống
- `GET /system/database/status` - Trạng thái database
- `POST /system/database/optimize` - Tối ưu database

## 🏫 UNIVERSITY MANAGEMENT SYSTEM

### 📚 University APIs (25 endpoints)

#### Public APIs (15 endpoints)
- `GET /universities` - Danh sách trường đại học (có filter)
- `GET /universities/featured` - Trường nổi bật
- `GET /universities/top-rated` - Trường đánh giá cao nhất
- `GET /universities/search` - Tìm kiếm trường
- `GET /universities/statistics` - Thống kê trường đại học
- `GET /universities/:id` - Chi tiết trường đại học
- `GET /universities/:id/reviews` - Đánh giá của trường
- `GET /universities/:id/statistics` - Thống kê đánh giá
- `GET /universities/:id/analytics` - Phân tích trường
- `POST /universities/compare` - So sánh trường đại học

#### Protected APIs (5 endpoints)
- `POST /universities/:id/reviews` - Tạo đánh giá (cần đăng nhập)
- `PUT /universities/reviews/:id` - Cập nhật đánh giá
- `DELETE /universities/reviews/:id` - Xóa đánh giá
- `GET /universities/recommendations` - Trường được đề xuất

#### Admin APIs (5 endpoints)
- `POST /universities` - Tạo trường mới (Admin only)
- `PUT /universities/:id` - Cập nhật thông tin trường
- `DELETE /universities/:id` - Xóa trường
- `PUT /universities/:id/status` - Cập nhật trạng thái
- `PUT /universities/:id/feature` - Đánh dấu nổi bật
- `PUT /universities/:id/verify` - Xác minh trường
- `POST /universities/:id/upload-image` - Upload ảnh trường
- `GET /universities/:id/report/:type` - Báo cáo trường
- `GET /universities/:id/insights` - Insights trường

### 📝 Review Management APIs (8 endpoints)
- `POST /universities/reviews/:id/moderate` - Kiểm duyệt đánh giá (Moderator/Admin)
- `GET /universities/reviews/pending` - Đánh giá chờ duyệt
- `GET /universities/reviews/reported` - Đánh giá bị báo cáo
- `PUT /universities/reviews/:id/approve` - Phê duyệt đánh giá
- `PUT /universities/reviews/:id/reject` - Từ chối đánh giá
- `PUT /universities/reviews/:id/hide` - Ẩn đánh giá
- `GET /universities/reviews/analytics` - Phân tích đánh giá
- `POST /universities/reviews/:id/report` - Báo cáo đánh giá

## 🔐 AUTHENTICATION & AUTHORIZATION

### 👥 User Roles
- **STUDENT**: Sinh viên, có thể đánh giá trường
- **ADMIN**: Quản trị viên, quản lý hệ thống
- **MODERATOR**: Kiểm duyệt viên, kiểm duyệt nội dung
- **UNIVERSITY_REP**: Đại diện trường đại học
- **SUPER_ADMIN**: Siêu quản trị viên

### 🔑 Permissions
- `university:read` - Xem thông tin trường
- `university:create` - Tạo trường mới
- `university:update` - Cập nhật thông tin trường
- `university:delete` - Xóa trường
- `review:create` - Tạo đánh giá
- `review:update` - Cập nhật đánh giá
- `review:delete` - Xóa đánh giá
- `review:moderate` - Kiểm duyệt đánh giá
- `dashboard:read` - Xem dashboard
- `dashboard:analytics` - Xem phân tích
- `system:manage` - Quản lý hệ thống
- `system:backup` - Backup/restore
- `system:maintenance` - Bảo trì hệ thống
- `system:logs` - Xem logs
- `system:users` - Quản lý người dùng

## 🏗️ ARCHITECTURE

### 📁 Project Structure
```
backend/
├── src/
│   ├── application/          # Business Logic Layer
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── services/        # Application Services
│   │   └── interfaces/      # Service Interfaces
│   ├── domain/              # Domain Layer
│   │   ├── entities/        # Domain Entities
│   │   └── repositories/    # Repository Interfaces
│   ├── infrastructure/      # Infrastructure Layer
│   │   ├── config/          # Configuration
│   │   ├── database/        # Database Layer
│   │   │   ├── entities/    # Database Entities
│   │   │   ├── migrations/  # Database Migrations
│   │   │   └── seeds/       # Database Seeds
│   │   └── services/        # External Services
│   └── presentation/        # Presentation Layer
│       ├── controllers/     # API Controllers
│       ├── guards/          # Authentication Guards
│       └── decorators/      # Custom Decorators
```

### 🗄️ Database Schema

#### Core Tables
- `users` - Người dùng hệ thống
- `universities` - Thông tin trường đại học
- `university_reviews` - Đánh giá trường đại học
- `university_review_scores` - Điểm đánh giá chi tiết
- `university_review_criteria` - Tiêu chí đánh giá
- `blogs` - Bài viết blog
- `tags` - Thẻ phân loại
- `activities` - Hoạt động người dùng
- `devices` - Thiết bị đăng nhập

#### Authentication Tables
- `refresh_tokens` - Refresh tokens
- `email_verifications` - Xác minh email
- `account_deactivations` - Tài khoản bị vô hiệu hóa

#### RBAC Tables
- `roles` - Vai trò người dùng
- `permissions` - Quyền hạn
- `role_permissions` - Phân quyền

## 🚀 DEPLOYMENT

### 📋 Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis (optional)
- Docker (optional)

### 🔧 Installation
```bash
# Clone repository
git clone <repository-url>
cd edu-review-hub/backend

# Install dependencies
npm install

# Environment setup
cp env.example .env
# Edit .env with your configuration

# Database setup
npm run migration:run
npm run seed

# Start development server
npm run start:dev
```

### 🐳 Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

## 📝 API RESPONSE FORMAT

### ✅ Success Response
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### ❌ Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Email is required"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔍 API TESTING

### 🧪 Swagger Documentation
- **URL**: `http://localhost:3000/api-docs`
- **Authentication**: Bearer Token
- **Testing**: Interactive API documentation

### 📊 Postman Collection
- Import collection from `docs/postman/`
- Environment variables included
- Pre-configured requests for all endpoints

## 📈 MONITORING & ANALYTICS

### 📊 Dashboard Metrics
- User growth and engagement
- Content performance
- System health monitoring
- Review analytics
- University rankings

### 🔍 System Monitoring
- API performance metrics
- Database health
- Error tracking
- User activity logs
- Security monitoring

## 🔒 SECURITY

### 🛡️ Security Features
- JWT Authentication
- Role-based authorization
- Rate limiting
- Input validation
- SQL injection prevention
- XSS protection
- CORS configuration

### 🔐 Best Practices
- Secure password hashing
- Token refresh mechanism
- Session management
- Audit logging
- Data encryption
- Regular security updates

## 📚 ADDITIONAL RESOURCES

### 📖 Documentation
- [Development Guide](docs/DEVELOPMENT_GUIDE.md)
- [Frontend Documentation](docs/FRONTEND_DOCUMENTATION.md)
- [Database Schema](database/)

### 🛠️ Development Tools
- [API Testing Guide](docs/API_TESTING.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

---

## 🎯 DEPRECATED APIs

> ⚠️ **Lưu ý**: Các API sau đã được deprecated và sẽ được thay thế bằng các API mới:

- `GET /profile/admin/users` → Sử dụng `GET /dashboard/users/analytics`
- `GET /blogs/admin/all` → Sử dụng `GET /dashboard/content/analytics`
- `GET /activities` → Sử dụng `GET /dashboard/overview`
- `GET /devices` → Sử dụng `GET /dashboard/system/health`

---

**📞 Support**: Nếu có thắc mắc, vui lòng liên hệ team development hoặc tạo issue trên repository. 