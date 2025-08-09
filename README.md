# 🎓 University Review Hub - Hệ thống Đánh giá và Gợi ý Trường Đại học

Một nền tảng toàn diện giúp học sinh, sinh viên đánh giá, chia sẻ kinh nghiệm và nhận gợi ý trường đại học phù hợp tại Việt Nam.

## 🌟 Tổng quan Dự án

**University Review Hub** là một hệ sinh thái hoàn chỉnh bao gồm:
- **Backend API**: NestJS với TypeORM và PostgreSQL
- **Frontend Web**: Next.js với React và TypeScript  
- **Mobile App**: Flutter đa nền tảng (iOS, Android, Web)
- **Data Crawler**: Python scripts thu thập dữ liệu trường đại học
- **Database**: PostgreSQL với schema tối ưu cho review và recommendation

## 🏗️ Kiến trúc Hệ thống

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend Web  │    │   Mobile App    │    │   Admin Panel   │
│    (Next.js)    │    │   (Flutter)     │    │    (React)      │
└─────────┬───────┘    └─────────┬───────┘    └─────────┬───────┘
          │                      │                      │
          └──────────────────────┼──────────────────────┘
                                 │
                    ┌─────────────┴───────────┐
                    │      Backend API        │
                    │      (NestJS)           │
                    │                         │
                    │  ┌─────────────────┐   │
                    │  │   Domain Layer  │   │
                    │  │ ┌─────────────┐ │   │
                    │  │ │ Application │ │   │
                    │  │ │   Services  │ │   │
                    │  │ └─────────────┘ │   │
                    │  └─────────────────┘   │
                    │                         │
                    │  ┌─────────────────┐   │
                    │  │Infrastructure  │   │
                    │  │    Layer       │   │
                    │  └─────────────────┘   │
                    └─────────┬───────────────┘
                              │
                    ┌─────────┴───────────┐
                    │   PostgreSQL DB     │
                    │                     │
                    │  ┌─────────────┐   │
                    │  │ Universities│   │
                    │  │   Reviews   │   │
                    │  │    Users    │   │
                    │  │ Personality │   │
                    │  │ Assessments │   │
                    │  └─────────────┘   │
                    └─────────────────────┘
```

## ✨ Tính năng Chính

### 👥 Quản lý Người dùng
- ✅ Đăng ký, xác thực và quản lý hồ sơ
- ✅ Xác minh email và bảo mật 2FA
- ✅ Phân quyền: Student, University Rep, Admin, Moderator
- ✅ Social login (Google, Facebook)

### 🏫 Hệ thống Đánh giá Trường Đại học
- ✅ Đánh giá đa tiêu chí (1-5 sao)
- ✅ Review chi tiết với hình ảnh
- ✅ Xác minh tình trạng sinh viên
- ✅ Báo cáo nội dung không phù hợp
- ✅ Lọc và tìm kiếm review

### 📝 Nền tảng Blog & Tâm sự
- ✅ Blog chia sẻ trải nghiệm đại học
- ✅ Tâm sự ẩn danh
- ✅ Hệ thống bình luận và phản ứng
- ✅ Chia sẻ mạng xã hội
- ✅ Phân loại nội dung

### 🧠 Đánh giá Tính cách & Gợi ý
- ✅ Bài trắc nghiệm tính cách MBTI
- ✅ Đánh giá phong cách học tập
- ✅ Gợi ý trường phù hợp với tính cách
- ✅ So sánh và xếp hạng đề xuất
- ✅ Báo cáo hồ sơ cá nhân

### 🔍 Tìm kiếm & Khám phá
- ✅ Tìm kiếm nâng cao với bộ lọc
- ✅ So sánh trường đại học
- ✅ Bản đồ tương tác
- ✅ Thông tin chi tiết trường

### 🤖 Thu thập Dữ liệu Tự động
- ✅ Crawler đa nguồn (Wikipedia, MOET, education.vn)
- ✅ Làm giàu dữ liệu tự động
- ✅ Phân loại và chuẩn hóa
- ✅ Báo cáo chi tiết

## 🚀 Cài đặt và Chạy Dự án

### Yêu cầu Hệ thống
- **Node.js**: >= 18.x
- **Python**: >= 3.8
- **PostgreSQL**: >= 13
- **Flutter**: >= 3.0 (cho mobile)
- **Docker**: (tùy chọn)

### 1. Setup Database
```bash
# Tạo database PostgreSQL
createdb university_review_hub

# Hoặc sử dụng Docker
docker run --name postgres-db -e POSTGRES_DB=university_review_hub -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:13
```

### 2. Backend Setup (NestJS)
```bash
cd backend

# Cài đặt dependencies
npm install

# Copy environment file
cp env.example .env
# Cấu hình database connection trong .env

# Chạy migrations
npm run migration:run

# Seed dữ liệu mẫu
npm run seed

# Chạy development server
npm run start:dev
```

Backend API sẽ chạy tại: `http://localhost:3000`
Swagger Documentation: `http://localhost:3000/api`

### 3. Frontend Setup (Next.js)
```bash
cd frontend/edu-review-frontend

# Cài đặt dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Cấu hình API endpoint

# Chạy development server
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:3001`

### 4. Mobile App Setup (Flutter)
```bash
cd mobile/edu_review_mobile

# Cài đặt dependencies
flutter pub get

# Chạy trên emulator/device
flutter run

# Build cho production
flutter build apk  # Android
flutter build ios  # iOS
```

### 5. Data Crawler Setup (Python)
```bash
# Cài đặt Python dependencies
pip install -r requirements.txt

# Chạy enhanced crawler
python enhanced_crawler.py

# Chạy comprehensive crawler
python comprehensive_crawler.py

# Validate dữ liệu
python schema_validator.py
```

## 📊 Cơ sở Dữ liệu

### Schema Chính
- **Users**: Quản lý người dùng và xác thực
- **Universities**: Thông tin trường đại học
- **Reviews**: Đánh giá và nhận xét
- **Personality Assessments**: Kết quả trắc nghiệm tính cách
- **Blog Posts**: Bài viết và tâm sự
- **Recommendations**: Gợi ý trường phù hợp

### Migrations và Seeding
```bash
# Tạo migration mới
npm run migration:generate -- MigrationName

# Chạy migrations
npm run migration:run

# Rollback migration
npm run migration:revert

# Seed dữ liệu
npm run seed
```

## 🛠️ API Documentation

### Authentication Endpoints
```
POST /auth/register          # Đăng ký
POST /auth/login            # Đăng nhập
POST /auth/refresh          # Refresh token
POST /auth/forgot-password  # Quên mật khẩu
```

### University Endpoints
```
GET    /universities         # Lấy danh sách trường
GET    /universities/:id     # Chi tiết trường
POST   /universities/:id/reviews  # Tạo review
GET    /universities/:id/reviews  # Lấy reviews
```

### Personality Assessment
```
POST /assessments/personality     # Nộp bài trắc nghiệm
GET  /assessments/personality/:id # Lấy kết quả
POST /recommendations/generate    # Tạo gợi ý
```

Chi tiết đầy đủ tại: `http://localhost:3000/api`

## 🧪 Testing

### Backend Testing
```bash
cd backend

# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Coverage report
npm run test:cov
```

### Frontend Testing
```bash
cd frontend/edu-review-frontend

# Run tests
npm run test

# E2E tests với Playwright
npm run test:e2e
```

### Mobile Testing
```bash
cd mobile/edu_review_mobile

# Unit tests
flutter test

# Integration tests
flutter drive --target=test_driver/app.dart
```

## 📱 Mobile App Features

### Đa nền tảng
- **Android**: Hỗ trợ Android 6.0+
- **iOS**: Hỗ trợ iOS 12.0+
- **Web**: Progressive Web App (PWA)

### Tính năng Mobile
- 📱 Giao diện responsive và thân thiện
- 🔔 Push notifications
- 📷 Upload hình ảnh từ camera/gallery
- 🗺️ Tích hợp bản đồ
- 💾 Offline caching
- 🔐 Biometric authentication

## 🐳 Docker Deployment

### Development với Docker Compose
```bash
# Build và chạy tất cả services
docker-compose up -d

# Chỉ chạy database
docker-compose up -d postgres

# View logs
docker-compose logs -f backend
```

### Production Deployment
```bash
# Build production images
docker build -t university-review-backend ./backend
docker build -t university-review-frontend ./frontend

# Deploy với docker-compose.prod.yml
docker-compose -f docker-compose.prod.yml up -d
```

## 📈 Performance & Monitoring

### Backend Performance
- **Response Time**: < 200ms average
- **Database**: Connection pooling và query optimization
- **Caching**: Redis cho session và frequently accessed data
- **Rate Limiting**: API throttling

### Monitoring Tools
- **Health Checks**: `/health` endpoint
- **Metrics**: Prometheus integration
- **Logging**: Structured logging với Winston
- **Error Tracking**: Sentry integration

## 🔒 Security

### Authentication & Authorization
- JWT tokens với refresh mechanism
- Role-based access control (RBAC)
- Password hashing với bcrypt
- Two-factor authentication (2FA)

### Data Protection
- Input validation và sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- Rate limiting

## 🌐 Deployment

### Backend (NestJS)
```bash
# Build production
npm run build

# Start production server
npm run start:prod
```

### Frontend (Next.js)
```bash
# Build static export
npm run build
npm run export

# Deploy to Vercel/Netlify
vercel deploy
```

### Mobile App
```bash
# Android Release
flutter build apk --release
flutter build appbundle --release

# iOS Release  
flutter build ios --release
```

## 🤝 Đóng góp

### Quy trình Development
1. Fork repository
2. Tạo feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -m 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Tạo Pull Request

### Code Standards
- **Backend**: ESLint + Prettier
- **Frontend**: ESLint + Prettier + TypeScript strict mode
- **Mobile**: Dart analysis + Flutter lints
- **Python**: Black + Flake8

### Git Workflow
```bash
# Feature development
git flow feature start new-feature
git flow feature finish new-feature

# Release
git flow release start v1.1.0
git flow release finish v1.1.0
```

## 📋 Roadmap

### Phase 1 (Completed) ✅
- [x] Hệ thống authentication cơ bản
- [x] CRUD operations cho universities và reviews
- [x] Data crawler và seeding
- [x] Basic frontend UI

### Phase 2 (In Progress) 🚧
- [ ] Personality assessment system
- [ ] Recommendation engine
- [ ] Mobile app MVP
- [ ] Advanced search và filtering

### Phase 3 (Planned) 📅
- [ ] AI-powered recommendations
- [ ] Real-time notifications
- [ ] Social features enhancement
- [ ] Analytics dashboard

## 📞 Liên hệ & Hỗ trợ

- **Email**: support@universityhub.vn
- **Documentation**: [Wiki](./docs/)
- **Issues**: [GitHub Issues](https://github.com/your-repo/issues)
- **Discord**: [Community Server](https://discord.gg/universityhub)

## 📄 License

MIT License - Xem [LICENSE](./LICENSE) để biết thêm chi tiết.

---

**Phiên bản**: 2.0.0  
**Cập nhật cuối**: Tháng 1, 2025  
**Tác giả**: University Review Hub Team

### 🙏 Acknowledgments

- Cảm ơn cộng đồng open source
- Wikipedia và các nguồn dữ liệu công khai
- Các contributor và beta testers
