# 🎯 Admin Dashboard & System Management Guide

## 📋 Tổng quan

Hệ thống đã được bổ sung thêm **23 API endpoints** mới để phục vụ cho việc quản lý hệ thống bởi Admin và Super Admin:

- **📊 Dashboard Analytics APIs (8 endpoints)**
- **⚙️ System Management APIs (15 endpoints)**

## 🔐 Phân quyền

### **Dashboard APIs:**
- **ADMIN**: Có thể truy cập tất cả dashboard APIs
- **SUPER_ADMIN**: Có thể truy cập tất cả dashboard APIs + system health + performance metrics

### **System Management APIs:**
- **SUPER_ADMIN**: Có thể truy cập tất cả system management APIs

## 📊 Dashboard Analytics APIs

### **1. Tổng quan hệ thống**
```http
GET /dashboard/overview
```
**Quyền:** ADMIN, SUPER_ADMIN  
**Mô tả:** Lấy tổng quan hệ thống với thống kê real-time

**Response:**
```json
{
  "overview": {
    "totalUsers": 1250,
    "activeUsers": 1180,
    "totalBlogs": 456,
    "publishedBlogs": 420,
    "totalReviews": 2340,
    "totalUniversities": 89,
    "systemHealth": {
      "status": "healthy",
      "uptime": 86400,
      "memoryUsage": 65.2,
      "cpuUsage": 12.5
    }
  },
  "recentActivities": [...],
  "lastUpdated": "2024-01-15T10:30:00Z"
}
```

### **2. Thống kê chi tiết**
```http
GET /dashboard/statistics?period=30d&startDate=2024-01-01&endDate=2024-01-31
```
**Quyền:** ADMIN, SUPER_ADMIN  
**Mô tả:** Lấy thống kê chi tiết cho biểu đồ và phân tích

**Parameters:**
- `period`: Time period (1h, 24h, 7d, 30d)
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)

### **3. Phân tích người dùng**
```http
GET /dashboard/users/analytics?role=STUDENT&status=active
```
**Quyền:** ADMIN, SUPER_ADMIN  
**Mô tả:** Phân tích người dùng và nhân khẩu học

**Parameters:**
- `role`: Filter by user role (STUDENT, ADMIN, MODERATOR, etc.)
- `status`: Filter by user status (active, inactive)

### **4. Phân tích nội dung**
```http
GET /dashboard/content/analytics?type=blogs&status=pending
```
**Quyền:** ADMIN, SUPER_ADMIN  
**Mô tả:** Phân tích nội dung và kiểm duyệt

**Parameters:**
- `type`: Content type (blogs, reviews, all)
- `status`: Content status (published, pending, rejected, banned)

### **5. Sức khỏe hệ thống**
```http
GET /dashboard/system/health
```
**Quyền:** SUPER_ADMIN  
**Mô tả:** Sức khỏe hệ thống chi tiết

### **6. Tạo báo cáo**
```http
GET /dashboard/reports/users?format=json&startDate=2024-01-01&endDate=2024-01-31
```
**Quyền:** ADMIN, SUPER_ADMIN  
**Mô tả:** Tạo báo cáo hệ thống

**Parameters:**
- `type`: Report type (users, content, activity, system)
- `format`: Report format (json, csv, pdf)
- `startDate`: Start date
- `endDate`: End date

### **7. Cảnh báo hệ thống**
```http
GET /dashboard/alerts?severity=high&status=active
```
**Quyền:** ADMIN, SUPER_ADMIN  
**Mô tả:** Cảnh báo và thông báo hệ thống

**Parameters:**
- `severity`: Alert severity (low, medium, high)
- `status`: Alert status (active, resolved, dismissed)

### **8. Metrics hiệu suất**
```http
GET /dashboard/performance?period=24h
```
**Quyền:** SUPER_ADMIN  
**Mô tả:** Metrics hiệu suất chi tiết

## ⚙️ System Management APIs

### **1. Cài đặt hệ thống**
```http
GET /system/settings
PATCH /system/settings
```
**Quyền:** SUPER_ADMIN  
**Mô tả:** Quản lý cài đặt hệ thống

### **2. Backup hệ thống**
```http
POST /system/backup
GET /system/backups
POST /system/backup/:backupId/restore
DELETE /system/backup/:backupId
```
**Quyền:** SUPER_ADMIN  
**Mô tả:** Quản lý backup hệ thống

### **3. Maintenance Mode**
```http
POST /system/maintenance
GET /system/maintenance
```
**Quyền:** SUPER_ADMIN  
**Mô tả:** Bật/tắt chế độ bảo trì

### **4. Cache Management**
```http
POST /system/cache/clear?type=all
```
**Quyền:** SUPER_ADMIN  
**Mô tả:** Xóa cache hệ thống

**Parameters:**
- `type`: Cache type (all, database, memory, files)

### **5. System Logs**
```http
GET /system/logs?level=error&startDate=2024-01-01&limit=100
```
**Quyền:** SUPER_ADMIN  
**Mô tả:** Xem logs hệ thống

**Parameters:**
- `level`: Log level (error, warn, info, debug)
- `startDate`: Start date
- `endDate`: End date
- `limit`: Number of logs (default: 100)

### **6. User Management**
```http
POST /system/users/:userId/ban
POST /system/users/:userId/unban
GET /system/banned-users
```
**Quyền:** SUPER_ADMIN  
**Mô tả:** Quản lý ban/unban user

### **7. System Control**
```http
POST /system/system/restart
```
**Quyền:** SUPER_ADMIN  
**Mô tả:** Khởi động lại hệ thống

### **8. Database Management**
```http
GET /system/database/status
POST /system/database/optimize
```
**Quyền:** SUPER_ADMIN  
**Mô tả:** Quản lý database

## 🔧 Cài đặt và Chạy

### **1. Chạy Migration**
```bash
npm run migration:run
```

### **2. Khởi động server**
```bash
npm run start:dev
```

### **3. Kiểm tra API**
```bash
# Test Dashboard Overview
curl -X GET "http://localhost:3000/dashboard/overview" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Test System Settings
curl -X GET "http://localhost:3000/system/settings" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 📊 Dashboard Features

### **Real-time Analytics:**
- Tổng số users, blogs, reviews
- Thống kê hoạt động real-time
- Phân tích xu hướng
- Metrics hiệu suất

### **Content Management:**
- Phân tích nội dung
- Quản lý moderation queue
- Thống kê content growth
- Top universities, users

### **System Monitoring:**
- System health check
- Performance metrics
- Error tracking
- Resource usage

### **Reporting:**
- User reports
- Content reports
- Activity reports
- System reports

## ⚙️ System Management Features

### **Backup & Recovery:**
- Tạo backup tự động
- Restore từ backup
- Quản lý backup history
- Backup scheduling

### **Security Management:**
- User ban/unban
- System settings
- Security policies
- Access control

### **Maintenance:**
- Maintenance mode
- System restart
- Cache management
- Database optimization

### **Monitoring:**
- System logs
- Performance metrics
- Error tracking
- Health checks

## 🚀 Best Practices

### **Dashboard Usage:**
1. **Regular Monitoring:** Kiểm tra dashboard hàng ngày
2. **Alert Management:** Xử lý alerts kịp thời
3. **Report Generation:** Tạo báo cáo định kỳ
4. **Performance Tracking:** Theo dõi metrics hiệu suất

### **System Management:**
1. **Backup Strategy:** Tạo backup định kỳ
2. **Security Updates:** Cập nhật security settings
3. **Maintenance Planning:** Lên kế hoạch maintenance
4. **User Management:** Quản lý user accounts

### **Security Considerations:**
1. **Access Control:** Chỉ SUPER_ADMIN mới có quyền system management
2. **Audit Logging:** Ghi log tất cả system changes
3. **Backup Security:** Bảo vệ backup files
4. **API Security:** Validate tất cả inputs

## 📝 API Documentation

Xem chi tiết API documentation tại: `backend/API_DOCUMENTATION.md`

## 🔗 Related Files

- **Controllers:** `backend/src/presentation/controllers/dashboard.controller.ts`
- **Services:** `backend/src/application/services/dashboard.service.ts`
- **DTOs:** `backend/src/application/dto/dashboard/`
- **Modules:** `backend/src/infrastructure/config/dashboard.module.ts`

## 🎯 Next Steps

1. **Frontend Integration:** Tích hợp với admin dashboard UI
2. **Real-time Updates:** Implement WebSocket cho real-time data
3. **Advanced Analytics:** Thêm advanced analytics features
4. **Automation:** Implement automated backup và monitoring
5. **Mobile App:** Tích hợp với mobile admin app 