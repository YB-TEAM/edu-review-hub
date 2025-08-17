# 📚 API COMPREHENSIVE DOCUMENTATION - Edu Review Hub Backend

## 🎯 TỔNG QUAN

Đây là tài liệu API đầy đủ cho hệ thống **Edu Review Hub** - nền tảng đánh giá và đề xuất trường đại học. Hệ thống được xây dựng bằng NestJS với kiến trúc Clean Architecture.

### 📊 THỐNG KÊ API TỔNG QUAN

- **Base URL**: `http://localhost:3001/api/v1`
- **Swagger Documentation**: `http://localhost:3001/api/docs`
- **Tổng số Controllers**: 16 controllers
- **Tổng số API Endpoints**: 160+ endpoints
- **Authentication**: JWT Bearer Token
- **Authorization**: Role-Based Access Control (RBAC)

---

## 📋 DANH SÁCH TẤT CẢ API ENDPOINTS

### 🏥 1. HEALTH APIs (`/api/v1/health`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| `GET` | `/health` | Kiểm tra sức khỏe hệ thống | ❌ | Public |

**Chi tiết:**
- Trả về trạng thái hệ thống, uptime, environment
- Không cần xác thực, dùng để health check

---

### 🔐 2. AUTHENTICATION APIs (`/api/v1/auth`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| `POST` | `/auth/register` | Đăng ký tài khoản mới | ❌ | Public |
| `POST` | `/auth/login` | Đăng nhập hệ thống | ❌ | Public |
| `POST` | `/auth/refresh` | Làm mới access token | ❌ | Public |
| `POST` | `/auth/logout` | Đăng xuất khỏi hệ thống | ✅ | All |

**Chi tiết:**
- **Register**: Tạo tài khoản mới, gửi email xác thực
- **Login**: Xác thực và trả về JWT token + refresh token
- **Refresh**: Sử dụng refresh token để lấy access token mới
- **Logout**: Vô hiệu hóa tất cả session của user

---

### 📧 3. EMAIL VERIFICATION APIs (`/api/v1/email-verification`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| `POST` | `/email-verification/verify-email` | Xác thực email bằng OTP | ❌ | Public |
| `POST` | `/email-verification/resend-verification` | Gửi lại mã xác thực | ❌ | Public |
| `POST` | `/email-verification/forgot-password` | Gửi email reset mật khẩu | ❌ | Public |
| `POST` | `/email-verification/reset-password` | Reset mật khẩu bằng OTP | ❌ | Public |
| `POST` | `/email-verification/change-email` | Yêu cầu đổi email | ✅ | All |
| `POST` | `/email-verification/confirm-email-change` | Xác nhận đổi email bằng OTP | ❌ | Public |

**Chi tiết:**
- Sử dụng OTP 6 số gửi qua email
- Thời gian hiệu lực OTP: 15 phút
- Hỗ trợ đổi email khi đã đăng nhập

---

### 👤 4. USER PROFILE APIs (`/api/v1/profile`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| `GET` | `/profile/me` | Lấy thông tin profile hiện tại | ✅ | All |
| `PATCH` | `/profile/me` | Cập nhật profile | ✅ | All |
| `POST` | `/profile/me/avatar` | Upload avatar (Cloudinary) | ✅ | All |
| `PATCH` | `/profile/admin/user/:userId` | Admin cập nhật thông tin user | ✅ | Admin+ |
| `GET` | `/profile/admin/user/:userId` | Admin xem profile user | ✅ | Admin+ |
| `GET` | `/profile/admin/users` | Admin xem tất cả users | ✅ | Admin+ |

**Chi tiết:**
- Avatar upload tự động xóa ảnh cũ
- Admin có thể quản lý thông tin tất cả users
- Hỗ trợ Cloudinary cho việc lưu trữ ảnh

---

### 🏛️ 5. UNIVERSITY APIs (`/api/v1/universities`)

#### 🌐 Public APIs (không cần xác thực)

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/universities` | Danh sách trường ĐH (có phân trang) | `type`, `location`, `search`, `page`, `limit` |
| `GET` | `/universities/featured` | Trường đại học nổi bật | - |
| `GET` | `/universities/top-rated` | Trường đánh giá cao nhất | `limit` |
| `GET` | `/universities/search` | Tìm kiếm trường đại học | `q` (query) |
| `GET` | `/universities/statistics` | Thống kê tổng quan | - |
| `GET` | `/universities/:id` | Chi tiết trường đại học | - |
| `GET` | `/universities/:id/reviews` | Đánh giá của trường | `status`, `page`, `limit` |
| `GET` | `/universities/:id/statistics` | Thống kê đánh giá trường | - |
| `GET` | `/universities/:id/analytics` | Phân tích trường | - |
| `POST` | `/universities/compare` | So sánh trường đại học | `universityIds[]` |

#### 🔒 Protected APIs (cần xác thực)

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `POST` | `/universities/:id/reviews` | Tạo đánh giá trường | All |
| `PUT` | `/universities/reviews/:id` | Cập nhật đánh giá | All |
| `DELETE` | `/universities/reviews/:id` | Xóa đánh giá | All |
| `GET` | `/universities/recommendations` | Trường được đề xuất | All |

#### ⚡ Admin APIs

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `POST` | `/universities` | Tạo trường mới | Admin+ |
| `PUT` | `/universities/:id` | Cập nhật thông tin trường | Admin+ |
| `DELETE` | `/universities/:id` | Xóa trường | Admin+ |
| `PUT` | `/universities/:id/status` | Cập nhật trạng thái trường | Admin+ |
| `PUT` | `/universities/:id/feature` | Đánh dấu trường nổi bật | Admin+ |
| `PUT` | `/universities/:id/verify` | Xác minh trường | Admin+ |
| `POST` | `/universities/reviews/:id/moderate` | Kiểm duyệt đánh giá | Moderator+ |
| `POST` | `/universities/:id/upload-image` | Upload ảnh trường | Admin+ |
| `GET` | `/universities/:id/report/:type` | Tạo báo cáo trường | Admin+ |
| `GET` | `/universities/:id/insights` | Insights trường | Admin+ |

---

### 📝 6. BLOG APIs (`/api/v1/blogs`)

#### 🌐 Public/Protected APIs

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| `GET` | `/blogs` | Danh sách blog công khai | Optional | All |
| `GET` | `/blogs/public/:id` | Xem blog công khai | ❌ | Public |
| `GET` | `/blogs/my` | Blog của tôi | ✅ | All |
| `GET` | `/blogs/:id` | Chi tiết blog | ✅ | All |
| `POST` | `/blogs` | Tạo blog mới | ✅ | All |
| `PATCH` | `/blogs/:id` | Cập nhật blog | ✅ | All |
| `POST` | `/blogs/:id/publish` | Gửi blog để kiểm duyệt | ✅ | All |
| `POST` | `/blogs/:id/like` | Like/Unlike blog | ✅ | All |
| `DELETE` | `/blogs/:id` | Xóa blog | ✅ | All |
| `POST` | `/blogs/:id/restore` | Khôi phục blog đã xóa | ✅ | All |

#### ⚡ Admin/Moderator APIs

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/blogs/pending` | Blog chờ kiểm duyệt | Moderator+ |
| `GET` | `/blogs/admin/all` | Tất cả blog (admin) | Moderator+ |
| `GET` | `/blogs/admin/all-with-deleted` | Tất cả blog kể cả đã xóa | Moderator+ |
| `GET` | `/blogs/admin/:id/with-deleted` | Blog chi tiết kể cả đã xóa | Moderator+ |
| `PATCH` | `/blogs/:id/approve` | Phê duyệt blog | Moderator+ |
| `PATCH` | `/blogs/:id/reject` | Từ chối blog | Moderator+ |
| `PATCH` | `/blogs/:id/ban` | Cấm blog | Moderator+ |
| `PATCH` | `/blogs/:id/unban` | Bỏ cấm blog | Moderator+ |

**Chi tiết:**
- Blog có các trạng thái: Draft, Pending, Approved, Rejected, Banned
- Hỗ trợ tìm kiếm theo title, content, author
- Hệ thống like/unlike với tracking IP và User Agent
- Hỗ trợ soft delete và restore

---

### 🏷️ 7. TAG APIs (`/api/v1/tags`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| `GET` | `/tags` | Danh sách tất cả tags | Permission | tag:read |
| `GET` | `/tags/:id` | Chi tiết tag | Permission | tag:read |
| `POST` | `/tags` | Tạo tag mới | ✅ | Admin+ |
| `PATCH` | `/tags/:id` | Cập nhật tag | ✅ | Admin+ |
| `DELETE` | `/tags/:id` | Xóa tag | ✅ | Admin+ |

**Chi tiết:**
- Chỉ xóa được tag không được sử dụng bởi blog nào
- Hỗ trợ permission-based access control

---

### 📊 8. DASHBOARD APIs (`/api/v1/dashboard`)

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/dashboard/overview` | Tổng quan hệ thống | Admin+ |
| `GET` | `/dashboard/statistics` | Thống kê chi tiết | Admin+ |
| `GET` | `/dashboard/users/analytics` | Phân tích người dùng | Admin+ |
| `GET` | `/dashboard/content/analytics` | Phân tích nội dung | Admin+ |
| `GET` | `/dashboard/system/health` | Sức khỏe hệ thống | Admin+ |
| `GET` | `/dashboard/reports/:type` | Tạo báo cáo | Admin+ |
| `GET` | `/dashboard/alerts` | Cảnh báo hệ thống | Admin+ |
| `GET` | `/dashboard/performance` | Metrics hiệu suất | Admin+ |

**Chi tiết:**
- Tất cả API dashboard yêu cầu quyền Admin trở lên
- Cung cấp dữ liệu real-time cho admin dashboard
- Hỗ trợ nhiều loại báo cáo: user, content, system, engagement

---

### ⚙️ 9. SYSTEM MANAGEMENT APIs (`/api/v1/system`)

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/system/settings` | Cài đặt hệ thống | Super Admin |
| `PATCH` | `/system/settings` | Cập nhật cài đặt | Super Admin |
| `POST` | `/system/backup` | Tạo backup | Super Admin |
| `GET` | `/system/backups` | Danh sách backup | Super Admin |
| `POST` | `/system/backup/:backupId/restore` | Khôi phục backup | Super Admin |
| `DELETE` | `/system/backup/:backupId` | Xóa backup | Super Admin |
| `POST` | `/system/maintenance` | Bật/tắt bảo trì | Super Admin |
| `GET` | `/system/maintenance` | Trạng thái bảo trì | Super Admin |
| `POST` | `/system/cache/clear` | Xóa cache | Super Admin |
| `GET` | `/system/logs` | Xem logs hệ thống | Super Admin |
| `POST` | `/system/users/:userId/ban` | Cấm user | Super Admin |
| `POST` | `/system/users/:userId/unban` | Bỏ cấm user | Super Admin |
| `GET` | `/system/banned-users` | Danh sách user bị cấm | Super Admin |
| `POST` | `/system/system/restart` | Khởi động lại hệ thống | Super Admin |
| `GET` | `/system/database/status` | Trạng thái database | Super Admin |
| `POST` | `/system/database/optimize` | Tối ưu database | Super Admin |

**Chi tiết:**
- Chỉ Super Admin mới có quyền truy cập
- Cung cấp đầy đủ tính năng quản trị hệ thống
- Hỗ trợ backup/restore tự động

---

### 📤 10. UPLOAD APIs (`/api/v1/upload`)

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `POST` | `/upload/image` | Upload ảnh | All |
| `PUT` | `/upload/image/:publicId` | Cập nhật ảnh | All |
| `DELETE` | `/upload/image/:publicId` | Xóa ảnh | All |
| `GET` | `/upload/files` | Danh sách file đã upload | All |

**Chi tiết:**
- Sử dụng Cloudinary để lưu trữ
- Hỗ trợ định dạng: JPEG, PNG, GIF, WebP
- Giới hạn kích thước: 10MB
- Permission-based access control

---

### 📱 11. DEVICE APIs (`/api/v1/devices`)

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/devices/my` | Thiết bị của tôi | All |
| `GET` | `/devices/all` | Tất cả thiết bị (admin) | Admin+ |

**Chi tiết:**
- Theo dõi thiết bị đăng nhập
- Hỗ trợ phân trang
- Admin có thể xem tất cả thiết bị

---

### 📈 12. ACTIVITY APIs (`/api/v1/activities`)

| Method | Endpoint | Description | Roles |
|--------|----------|-------------|-------|
| `GET` | `/activities/my` | Hoạt động của tôi | All |
| `GET` | `/activities/all` | Tất cả hoạt động (admin) | Admin+ |

**Chi tiết:**
- Theo dõi hoạt động người dùng
- Hỗ trợ filter theo loại hoạt động
- Lưu trữ IP address và User Agent

---

### 🏃 13. USER ACTIVITY APIs (`/api/v1/activity`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/activity/me` | Lịch sử hoạt động | ✅ |
| `GET` | `/activity/me/count` | Số lượng hoạt động | ✅ |

---

### 🔐 14. ACCOUNT DEACTIVATION APIs (`/api/v1/account`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/account/deactivate` | Vô hiệu hóa tài khoản | ✅ |
| `POST` | `/account/delete` | Xóa tài khoản | ✅ |
| `POST` | `/account/reactivate` | Kích hoạt lại tài khoản | ❌ |

---

### 🎯 15. UNIVERSITY REVIEW APIs (`/api/v1/university-reviews`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| `GET` | `/university-reviews/:id` | Chi tiết đánh giá | ❌ | Public |
| `GET` | `/university-reviews/university/:universityId` | Đánh giá theo trường | ❌ | Public |
| `GET` | `/university-reviews/user/:userId` | Đánh giá theo user | ✅ | Super Admin |
| `POST` | `/university-reviews` | Tạo đánh giá | ✅ | Student |
| `PATCH` | `/university-reviews/:id` | Cập nhật đánh giá | ✅ | Student |
| `DELETE` | `/university-reviews/:id` | Xóa đánh giá | ✅ | Student |
| `PATCH` | `/university-reviews/:id/moderate` | Kiểm duyệt đánh giá | ✅ | Moderator+ |

---

### 📏 16. UNIVERSITY REVIEW CRITERION APIs (`/api/v1/university-review-criteria`)

| Method | Endpoint | Description | Auth Required | Roles |
|--------|----------|-------------|---------------|-------|
| `GET` | `/university-review-criteria` | Danh sách tiêu chí | ❌ | Public |
| `POST` | `/university-review-criteria` | Tạo tiêu chí | ✅ | Super Admin |
| `PATCH` | `/university-review-criteria/:id` | Cập nhật tiêu chí | ✅ | Super Admin |
| `DELETE` | `/university-review-criteria/:id` | Xóa tiêu chí | ✅ | Super Admin |

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### 👥 USER ROLES

| Role | Description | Level |
|------|-------------|-------|
| `STUDENT` | Sinh viên, có thể tạo đánh giá và blog | 1 |
| `UNIVERSITY_REP` | Đại diện trường đại học | 2 |
| `MODERATOR` | Kiểm duyệt viên nội dung | 3 |
| `ADMIN` | Quản trị viên hệ thống | 4 |
| `SUPER_ADMIN` | Siêu quản trị viên | 5 |

### 🔑 PERMISSIONS

| Permission | Description |
|------------|-------------|
| `university:read` | Xem thông tin trường |
| `university:create` | Tạo trường mới |
| `university:update` | Cập nhật trường |
| `university:delete` | Xóa trường |
| `review:create` | Tạo đánh giá |
| `review:moderate` | Kiểm duyệt đánh giá |
| `blog:create` | Tạo blog |
| `blog:moderate` | Kiểm duyệt blog |
| `upload:create` | Upload file |
| `upload:update` | Cập nhật file |
| `upload:delete` | Xóa file |
| `upload:read` | Xem file |
| `tag:read` | Xem tag |

---

## 📊 API RESPONSE FORMAT

### ✅ Success Response
```json
{
  "statusCode": 200,
  "data": {
    // Response data
  },
  "message": "Success",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### ❌ Error Response
```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

---

## 🔧 DEVELOPMENT INFORMATION

### 🏗️ Architecture
- **Framework**: NestJS
- **Architecture**: Clean Architecture (Domain-Driven Design)
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT + Refresh Token
- **File Storage**: Cloudinary
- **API Documentation**: Swagger/OpenAPI

### 📁 Project Structure
```
src/
├── application/          # Business Logic Layer
│   ├── dto/             # Data Transfer Objects
│   └── services/        # Application Services
├── domain/              # Domain Layer
├── infrastructure/      # Infrastructure Layer
│   └── database/        # Database Layer
└── presentation/        # Presentation Layer
    ├── controllers/     # API Controllers (16 files)
    ├── guards/          # Authentication Guards
    └── decorators/      # Custom Decorators
```

### 🌐 API Configuration
- **Base URL**: `/api/v1`
- **CORS**: Enabled for all origins
- **Validation**: Global ValidationPipe enabled
- **Swagger**: Available at `/api/docs`

---

## 📝 NOTES

1. **Authentication**: Hầu hết API đều yêu cầu JWT token trong header `Authorization: Bearer <token>`
2. **Pagination**: Các API danh sách đều hỗ trợ phân trang với `page` và `limit`
3. **Permissions**: Một số API sử dụng permission-based access control thay vì role-based
4. **File Upload**: Sử dụng Cloudinary, hỗ trợ tự động xóa file cũ khi upload mới
5. **Activity Tracking**: Hệ thống tự động ghi lại IP address và User Agent cho các hoạt động quan trọng
6. **Health Check**: Endpoint `/health` dùng để kiểm tra trạng thái hệ thống, không cần xác thực

---

**📞 Support**: Để biết thêm chi tiết về từng API, vui lòng tham khao Swagger documentation tại `http://localhost:3001/api/docs`