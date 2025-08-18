# API Configuration Guide

## Overview

Dự án edu-review-frontend đã được cập nhật để sử dụng cấu hình API tập trung và linh hoạt thông qua environment variables.

## Cấu trúc hiện tại

### 1. Base Query (`src/lib/api.ts`)

- **`baseQueryWithErrorHandling`**: Base query chung cho tất cả API calls
- **`getApiBaseUrl()`**: Hàm lấy URL backend từ environment variables
- **`getApiTimeout()`**: Hàm lấy timeout từ environment variables
- **Error handling**: Xử lý lỗi tập trung cho tất cả API calls

### 2. API Services

Tất cả các API services đều sử dụng `baseQueryWithErrorHandling` chung:

- `authApi.ts` - Authentication
- `blogApi.ts` - Blog management
- `profileApi.ts` - User profile
- `reviewApi.ts` - Reviews
- `courseApi.ts` - Courses
- `institutionApi.ts` - Institutions
- `uploadApi.ts` - File uploads

### 3. Environment Configuration

#### Tạo file `.env.local`:

```bash
# Backend API Base URL
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1

# API Timeout (in milliseconds)
NEXT_PUBLIC_API_TIMEOUT=15000
```

#### Các giá trị mặc định:

- **Development**: `http://localhost:3000/api/v1`
- **Production**: `https://edu-review-hub.onrender.com/api/v1`
- **Timeout**: 15000ms (15 giây)

## Cách sử dụng

### 1. Trong Components

```typescript
import { useGetBlogsQuery } from "@/lib/services/blogApi";

function BlogList() {
  const { data, error, isLoading } = useGetBlogsQuery({ page: 1, limit: 10 });
  // ... rest of component
}
```

### 2. Trong API Services

```typescript
import { baseQueryWithErrorHandling } from "../api";

export const myApi = createApi({
  reducerPath: "myApi",
  baseQuery: baseQueryWithErrorHandling, // Sử dụng base query chung
  tagTypes: ["MyData"],
  endpoints: (builder) => ({
    // ... endpoints
  }),
});
```

### 3. Error Handling

```typescript
import { errorHandler } from "@/lib/api";

// Kiểm tra loại lỗi
if (errorHandler.isAuthError(error)) {
  // Xử lý lỗi authentication
}

if (errorHandler.isValidationError(error)) {
  // Xử lý lỗi validation
}
```

## Lợi ích

### ✅ **Tập trung hóa**

- Tất cả API calls sử dụng cùng một base query
- Cấu hình URL backend tập trung
- Error handling nhất quán

### ✅ **Linh hoạt**

- Dễ dàng thay đổi URL backend qua environment variables
- Hỗ trợ nhiều môi trường (dev, staging, production)
- Có thể override timeout cho từng môi trường

### ✅ **Bảo trì**

- Chỉ cần sửa một chỗ để thay đổi cấu hình
- Error handling tập trung, dễ debug
- Code nhất quán giữa các API services

## Deployment

### Development

```bash
# Sử dụng localhost
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api/v1
```

### Staging

```bash
# Sử dụng staging server
NEXT_PUBLIC_API_BASE_URL=https://staging.edu-review-hub.com/api/v1
```

### Production

```bash
# Sử dụng production server
NEXT_PUBLIC_API_BASE_URL=https://edu-review-hub.onrender.com/api/v1
```

## Troubleshooting

### 1. API không kết nối được

- Kiểm tra `NEXT_PUBLIC_API_BASE_URL` trong `.env.local`
- Đảm bảo backend server đang chạy
- Kiểm tra CORS configuration

### 2. Timeout errors

- Tăng `NEXT_PUBLIC_API_TIMEOUT` nếu cần
- Kiểm tra network connectivity
- Kiểm tra backend performance

### 3. Authentication errors

- Kiểm tra token trong localStorage
- Kiểm tra token expiration
- Kiểm tra backend auth configuration
