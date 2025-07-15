# Edu Review Hub Backend

Backend API cho dự án Review & Gợi ý Đại học được xây dựng với NestJS, TypeORM, PostgreSQL và Swagger.

## 🏗️ Kiến trúc

Dự án được tổ chức theo Clean Architecture với các layer:

- **Domain**: Entities, Repository interfaces, Domain services
- **Application**: DTOs, Application services, Use cases
- **Infrastructure**: Database entities, Repository implementations, External services
- **Presentation**: Controllers, Guards, Middleware

## 🚀 Cài đặt

### Yêu cầu hệ thống

- Node.js (v18+)
- PostgreSQL (v12+)
- npm hoặc yarn

### Cài đặt dependencies

```bash
npm install
```

### Cấu hình môi trường

1. Copy file `env.example` thành `.env`:

```bash
cp env.example .env
```

2. Cập nhật các biến môi trường trong file `.env`:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=edu_review_hub

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d

# Application Configuration
PORT=3000
NODE_ENV=development
```

### Tạo database

```sql
CREATE DATABASE edu_review_hub;
```

### Chạy migrations (nếu có)

```bash
npm run migration:run
```

## 🏃‍♂️ Chạy ứng dụng

### Development mode

```bash
npm run start:dev
```

### Production mode

```bash
npm run build
npm run start:prod
```

## 📚 API Documentation

Sau khi chạy ứng dụng, truy cập Swagger UI tại:

```
http://localhost:3000/api/docs
```

## 🔐 Authentication

### Đăng ký tài khoản

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "student123",
  "email": "student@example.com",
  "password": "password123",
  "phone": "0123456789",
  "accountType": "student"
}
```

### Đăng nhập

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "identifier": "student@example.com",
  "password": "password123",
  "deviceId": "device123",
  "rememberMe": false
}
```

### Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "your-refresh-token"
}
```

### Đăng xuất

```http
POST /api/v1/auth/logout
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "deviceId": "device123"
}
```

## 🗄️ Database Schema

Dự án sử dụng PostgreSQL với các bảng chính:

- `users`: Thông tin người dùng
- `user_profiles`: Hồ sơ chi tiết người dùng
- `user_sessions`: Quản lý phiên đăng nhập
- `user_devices`: Quản lý thiết bị

## 🧪 Testing

```bash
# Unit tests
npm run test

# e2e tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📦 Scripts

- `npm run build`: Build ứng dụng
- `npm run start`: Chạy ứng dụng
- `npm run start:dev`: Chạy với hot reload
- `npm run start:debug`: Chạy với debug mode
- `npm run start:prod`: Chạy production
- `npm run lint`: Kiểm tra code style
- `npm run test`: Chạy unit tests
- `npm run test:e2e`: Chạy e2e tests
- `npm run migration:generate`: Tạo migration
- `npm run migration:run`: Chạy migrations
- `npm run migration:revert`: Revert migration

## 🏛️ Project Structure

```
src/
├── domain/                 # Domain layer
│   ├── entities/          # Domain entities
│   ├── repositories/      # Repository interfaces
│   └── services/          # Domain services
├── application/           # Application layer
│   ├── dto/              # Data Transfer Objects
│   ├── interfaces/       # Service interfaces
│   └── services/         # Application services
├── infrastructure/       # Infrastructure layer
│   ├── config/          # Configuration files
│   ├── database/        # Database related
│   │   ├── entities/    # TypeORM entities
│   │   ├── migrations/  # Database migrations
│   │   └── repositories/# Repository implementations
│   └── external/        # External services
├── presentation/         # Presentation layer
│   ├── controllers/     # API controllers
│   ├── guards/          # Authentication guards
│   ├── middleware/      # Custom middleware
│   └── decorators/      # Custom decorators
└── shared/              # Shared utilities
    ├── constants/       # Application constants
    ├── decorators/      # Shared decorators
    ├── enums/          # Enumerations
    ├── exceptions/     # Custom exceptions
    ├── filters/        # Exception filters
    ├── interceptors/   # Interceptors
    └── utils/          # Utility functions
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
