# 🏛️ UNIVERSITY IMAGE MANAGEMENT API GUIDE

## 📖 Tổng quan

Hệ thống quản lý ảnh university mới được thiết kế để thay thế cách lưu trữ ảnh cũ (chỉ lưu URL). Bây giờ mỗi ảnh được lưu trữ với đầy đủ metadata và có quan hệ trực tiếp với university ID.

## 🆕 Các API mới được thêm

### 1. **Upload Ảnh University** - `POST /universities/:id/upload-image`

**Mô tả**: Upload ảnh cho university với đầy đủ metadata

**Headers**:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Body (Form Data)**:

- `image`: File ảnh (JPEG, PNG, GIF, WebP, max 10MB)
- `imageType`: Loại ảnh (logo, banner, campus, facility, event, other)
- `title`: Tiêu đề ảnh (optional)
- `description`: Mô tả ảnh (optional)
- `altText`: Alt text cho SEO (optional)
- `sortOrder`: Thứ tự sắp xếp (optional, default: 0)
- `isPrimary`: Có phải ảnh chính không (optional, default: false)

**Ví dụ Request**:

```bash
curl -X POST "http://localhost:3001/api/v1/universities/1/upload-image" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "image=@logo.png" \
  -F "imageType=logo" \
  -F "title=Logo chính thức của trường" \
  -F "description=Logo chính thức của trường đại học ABC" \
  -F "altText=Logo trường ABC" \
  -F "isPrimary=true"
```

**Response**:

```json
{
  "statusCode": 201,
  "data": {
    "id": 1,
    "universityId": 1,
    "imageUrl": "https://res.cloudinary.com/.../universities/1/logo/abc123.png",
    "cloudinaryPublicId": "universities/1/logo/abc123",
    "imageType": "logo",
    "title": "Logo chính thức của trường",
    "description": "Logo chính thức của trường đại học ABC",
    "altText": "Logo trường ABC",
    "sortOrder": 0,
    "isPrimary": true,
    "isActive": true,
    "uploadedBy": "123",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  "message": "Image uploaded successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

### 2. **Lấy Danh Sách Ảnh** - `GET /universities/:id/images`

**Mô tả**: Lấy tất cả ảnh của một university

**Query Parameters**:

- `type` (optional): Lọc theo loại ảnh (logo, banner, campus, facility, event, other)

**Ví dụ Request**:

```bash
# Lấy tất cả ảnh
curl "http://localhost:3001/api/v1/universities/1/images"

# Lọc theo loại
curl "http://localhost:3001/api/v1/universities/1/images?type=logo"
```

### 3. **Lấy Ảnh Chính** - `GET /universities/:id/images/primary/:type`

**Mô tả**: Lấy ảnh chính của một loại cụ thể

**Ví dụ Request**:

```bash
curl "http://localhost:3001/api/v1/universities/1/images/primary/logo"
```

### 4. **Cập Nhật Metadata Ảnh** - `PATCH /universities/:id/images/:imageId`

**Mô tả**: Cập nhật thông tin metadata của ảnh

**Headers**:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body**:

```json
{
  "title": "Logo mới của trường",
  "description": "Logo được cập nhật năm 2024",
  "altText": "Logo trường ABC 2024",
  "sortOrder": 1,
  "isPrimary": true
}
```

### 5. **Xóa Ảnh** - `DELETE /universities/:id/images/:imageId`

**Mô tả**: Xóa ảnh khỏi university và Cloudinary

**Headers**:

```
Authorization: Bearer <JWT_TOKEN>
```

### 6. **Đặt Ảnh Làm Chính** - `POST /universities/:id/images/:imageId/set-primary`

**Mô tả**: Đặt một ảnh làm ảnh chính cho loại của nó

**Headers**:

```
Authorization: Bearer <JWT_TOKEN>
```

**Query Parameters**:

- `type`: Loại ảnh (logo, banner, campus, facility, event, other)

### 7. **Thống Kê Ảnh** - `GET /universities/:id/images/stats`

**Mô tả**: Lấy thống kê về ảnh của university

**Headers**:

```
Authorization: Bearer <JWT_TOKEN>
```

**Response**:

```json
{
  "statusCode": 200,
  "data": {
    "totalImages": 15,
    "imagesByType": {
      "logo": 3,
      "banner": 2,
      "campus": 5,
      "facility": 3,
      "event": 2,
      "other": 0
    },
    "primaryImages": {
      "logo": "https://res.cloudinary.com/.../logo1.png",
      "banner": "https://res.cloudinary.com/.../banner1.png",
      "campus": "https://res.cloudinary.com/.../campus1.png",
      "facility": "https://res.cloudinary.com/.../facility1.png",
      "event": "https://res.cloudinary.com/.../event1.png",
      "other": null
    }
  },
  "message": "Image statistics retrieved successfully",
  "timestamp": "2024-01-15T10:30:00Z"
}
```

## 🔄 Migration từ Hệ Thống Cũ

### Trước đây:

```typescript
// Chỉ lưu URL đơn giản
university.logo_url = "https://example.com/logo.png";
university.banner_url = "https://example.com/banner.png";
```

### Bây giờ:

```typescript
// Lưu đầy đủ metadata và quan hệ
const image = await universityImageService.uploadImage(
  universityId,
  file,
  {
    imageType: ImageType.LOGO,
    title: "Logo chính thức",
    description: "Logo của trường đại học",
    isPrimary: true,
  },
  userId,
  ipAddress,
  userAgent
);
```

## 🏗️ Cấu Trúc Database

### Bảng `university_images`:

- `id`: Primary key
- `university_id`: Foreign key đến bảng universities
- `image_url`: URL ảnh trên Cloudinary
- `cloudinary_public_id`: Public ID trên Cloudinary để quản lý
- `image_type`: Loại ảnh (logo, banner, campus, facility, event, other)
- `title`: Tiêu đề ảnh
- `description`: Mô tả ảnh
- `alt_text`: Alt text cho SEO
- `sort_order`: Thứ tự sắp xếp
- `is_primary`: Có phải ảnh chính không
- `is_active`: Trạng thái hoạt động
- `uploaded_by`: ID người upload
- `ip_address`: IP address khi upload
- `user_agent`: User agent khi upload
- `created_at`: Thời gian tạo
- `updated_at`: Thời gian cập nhật

## 🔐 Quyền Truy Cập

- **Public APIs**: Không cần xác thực
  - `GET /universities/:id/images`
  - `GET /universities/:id/images/primary/:type`

- **Admin APIs**: Cần role ADMIN hoặc SUPER_ADMIN
  - `POST /universities/:id/upload-image`
  - `PATCH /universities/:id/images/:imageId`
  - `DELETE /universities/:id/images/:imageId`
  - `POST /universities/:id/images/:imageId/set-primary`
  - `GET /universities/:id/images/stats`

## 📁 Cấu Trúc Thư Mục Cloudinary

```
universities/
├── 1/                    # University ID
│   ├── logo/            # Loại ảnh
│   │   ├── abc123.png   # Ảnh cụ thể
│   │   └── def456.png
│   ├── banner/
│   │   └── banner1.png
│   └── campus/
│       ├── campus1.png
│       └── campus2.png
└── 2/                    # University ID khác
    ├── logo/
    └── banner/
```

## 🚀 Lợi Ích của Hệ Thống Mới

1. **Quản lý ảnh tập trung**: Tất cả ảnh được lưu trữ có tổ chức
2. **Metadata đầy đủ**: Tiêu đề, mô tả, alt text cho SEO
3. **Phân loại ảnh**: Logo, banner, campus, facility, event
4. **Ảnh chính**: Mỗi loại có thể có ảnh chính
5. **Sắp xếp**: Hỗ trợ sắp xếp ảnh theo thứ tự
6. **Tracking**: Theo dõi người upload, IP, user agent
7. **Soft delete**: Ảnh có thể bị ẩn thay vì xóa hoàn toàn
8. **Quan hệ rõ ràng**: Mỗi ảnh gắn chặt với university ID

## 🔧 Cài Đặt và Chạy

1. **Chạy migration**:

```bash
npm run migration:run
```

2. **Kiểm tra database**:

```bash
# Kiểm tra bảng mới
SELECT * FROM university_images;
```

3. **Test API**:

```bash
# Test upload ảnh
curl -X POST "http://localhost:3001/api/v1/universities/1/upload-image" \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -F "image=@test.png" \
  -F "imageType=logo" \
  -F "title=Test Logo"
```

## 📝 Ghi Chú Quan Trọng

- **File size limit**: 10MB
- **Supported formats**: JPEG, PNG, GIF, WebP
- **Primary image**: Chỉ có 1 ảnh primary cho mỗi loại
- **Cascade delete**: Khi xóa university, tất cả ảnh sẽ bị xóa
- **Cloudinary cleanup**: Ảnh bị xóa sẽ được xóa khỏi Cloudinary
- **Audit trail**: Tất cả thao tác đều được ghi lại IP và User Agent
