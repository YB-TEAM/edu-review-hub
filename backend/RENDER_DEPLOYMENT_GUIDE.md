# 🚀 Hướng Dẫn Deploy Backend Lên Render Free Tier

## 📋 Tổng Quan

Hướng dẫn này sẽ giúp bạn deploy backend Edu Review Hub lên Render free tier một cách hoàn chỉnh, bao gồm:

- Tạo database PostgreSQL
- Deploy backend service
- Chạy migration và seed tự động
- Cấu hình environment variables

## 🛠️ Chuẩn Bị

### 1. Tài Khoản Render

- Đăng ký tài khoản tại [render.com](https://render.com)
- Xác thực email và thiết lập tài khoản

### 2. Repository GitHub

- Đảm bảo code đã được push lên GitHub
- Repository phải là public (cho free tier)

## 📱 Bước 1: Tạo Database PostgreSQL

### 1.1 Đăng nhập Render Dashboard

- Truy cập [dashboard.render.com](https://dashboard.render.com)
- Đăng nhập với tài khoản của bạn

### 1.2 Tạo Database

1. Click **"New +"** → **"PostgreSQL"**
2. Điền thông tin:

   - **Name**: `edu-review-hub-db`
   - **Database**: `edu_review_hub`
   - **User**: `edu_review_user`
   - **Region**: Chọn gần nhất với bạn
   - **PostgreSQL Version**: `15` (hoặc mới nhất)
   - **Plan**: `Free`

3. Click **"Create Database"**

### 1.3 Lưu Thông Tin Database

Sau khi tạo xong, lưu lại các thông tin:

- **Host**: `dpg-xxxxx-a.oregon-postgres.render.com`
- **Port**: `5432`
- **Database**: `edu_review_hub`
- **User**: `edu_review_user`
- **Password**: `xxxxxxxxxxxxxxxx`

## 🚀 Bước 2: Deploy Backend Service

### 2.1 Tạo Web Service

1. Click **"New +"** → **"Web Service"**
2. Kết nối với GitHub repository:
   - Chọn repository `edu-review-hub`
   - Chọn branch `main` (hoặc branch bạn muốn deploy)

### 2.2 Cấu Hình Service

Điền thông tin cơ bản:

- **Name**: `edu-review-hub-backend`
- **Environment**: `Node`
- **Region**: Chọn cùng region với database
- **Branch**: `main`
- **Root Directory**: `backend` (nếu backend nằm trong thư mục con)

### 2.3 Cấu Hình Build & Deploy

- **Build Command**:

```bash
npm ci
npm run build
```

- **Start Command**:

```bash
chmod +x deploy.sh && ./deploy.sh
```

### 2.4 Cấu Hình Environment Variables

Thêm các biến môi trường sau:

#### Database Configuration:

```
DB_HOST=dpg-xxxxx-a.oregon-postgres.render.com
DB_PORT=5432
DB_USERNAME=edu_review_user
DB_PASSWORD=xxxxxxxxxxxxxxxx
DB_DATABASE=edu_review_hub
```

#### Application Configuration:

```
NODE_ENV=production
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=7d
RENDER=true
```

#### Optional Configuration:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 2.5 Tạo Service

Click **"Create Web Service"**

## 🔄 Bước 3: Theo Dõi Deploy

### 3.1 Build Process

- Render sẽ tự động build ứng dụng
- Quá trình này có thể mất 5-10 phút
- Theo dõi logs để đảm bảo không có lỗi

### 3.2 Deploy Process

- Sau khi build thành công, deploy script sẽ chạy
- Script sẽ:
  1. Chờ database sẵn sàng
  2. Chạy database migrations
  3. Chạy database seeds
  4. Khởi động ứng dụng

### 3.3 Kiểm Tra Health Check

- Render sẽ kiểm tra endpoint `/health`
- Đảm bảo endpoint trả về status 200

## ✅ Bước 4: Kiểm Tra Deploy

### 4.1 Kiểm Tra Service

- Truy cập URL được cung cấp: `https://edu-review-hub-backend.onrender.com`
- Kiểm tra endpoint health: `/health`
- Kiểm tra API documentation: `/api` (nếu có Swagger)

### 4.2 Kiểm Tra Database

- Kiểm tra logs để đảm bảo migration và seed đã chạy thành công
- Kiểm tra dữ liệu đã được tạo trong database

### 4.3 Test API Endpoints

- Test các endpoint cơ bản
- Kiểm tra authentication
- Kiểm tra database operations

## 🔧 Bước 5: Cấu Hình Nâng Cao

### 5.1 Custom Domain (Optional)

1. Trong service settings, click **"Settings"**
2. Chọn **"Custom Domains"**
3. Thêm domain của bạn
4. Cấu hình DNS records

### 5.2 Environment Variables Management

- Sử dụng Render's environment variables để quản lý secrets
- Không commit `.env` files vào repository
- Sử dụng Render's built-in secret management

### 5.3 Auto-Deploy

- Render sẽ tự động deploy khi có push mới
- Có thể disable trong settings nếu cần

## 🚨 Troubleshooting

### Lỗi Thường Gặp

#### 1. Build Failed - "nest: not found"

**Nguyên nhân**: `@nestjs/cli` không có trong production dependencies

**Giải pháp**:

- Đảm bảo `@nestjs/cli` đã được di chuyển từ `devDependencies` sang `dependencies` trong `package.json`
- Commit và push lại code
- Redeploy service

#### 2. Database Connection Failed

- Kiểm tra database credentials
- Kiểm tra database đã được tạo
- Kiểm tra network access

#### 3. Migration Failed

- Kiểm tra database schema
- Kiểm tra migration files
- Kiểm tra database permissions

#### 4. Seed Failed

- Kiểm tra seed data format
- Kiểm tra database constraints
- Kiểm tra seed scripts

### Debug Commands

```bash
# Xem logs
render logs edu-review-hub-backend

# Restart service
render restart edu-review-hub-backend

# View service status
render ps edu-review-hub-backend
```

## 📊 Monitoring & Maintenance

### 1. Logs

- Render cung cấp real-time logs
- Có thể download logs để phân tích
- Logs được giữ trong 30 ngày (free tier)

### 2. Performance

- Monitor response times
- Kiểm tra database performance
- Theo dõi memory usage

### 3. Updates

- Cập nhật dependencies định kỳ
- Test locally trước khi deploy
- Sử dụng staging environment nếu có thể

## 🎯 Kết Luận

Sau khi hoàn thành các bước trên, bạn sẽ có:

- ✅ Backend service chạy trên Render
- ✅ PostgreSQL database được cấu hình
- ✅ Database migrations và seeds chạy tự động
- ✅ Health check endpoint hoạt động
- ✅ Auto-deploy khi có code mới

## 🔗 Liên Kết Hữu Ích

- [Render Documentation](https://render.com/docs)
- [PostgreSQL on Render](https://render.com/docs/databases)
- [Node.js Deployment](https://render.com/docs/deploy-node-express-app)
- [Environment Variables](https://render.com/docs/environment-variables)

## 📞 Hỗ Trợ

Nếu gặp vấn đề:

1. Kiểm tra Render logs
2. Kiểm tra application logs
3. Tham khảo Render documentation
4. Tạo support ticket trên Render

---

**Lưu ý**: Free tier có một số giới hạn:

- Service sẽ sleep sau 15 phút không có traffic
- Database có giới hạn 1GB storage
- Có thể mất vài giây để wake up service
