# 🚀 Render Deployment - Edu Review Hub Backend

## Quick Start

### 1. Deploy to Render

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

### 2. Manual Setup

1. Create PostgreSQL database on Render
2. Create Web Service pointing to this repository
3. Set environment variables
4. Deploy!

## Environment Variables

```bash
# Required
DB_HOST=your-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
DB_DATABASE=edu_review_hub
JWT_SECRET=your-jwt-secret
NODE_ENV=production
PORT=3000
RENDER=true
DB_SSL=true

# Optional
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email
SMTP_PASS=your-password
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Build & Start Commands

- **Build Command**: `npm ci && npm run build`
- **Start Command**: `bash -c "chmod +x deploy.sh && ./deploy.sh"`

## Health Check

Endpoint: `/health`

## Features

- ✅ Automatic database migrations
- ✅ Automatic database seeding
- ✅ Health check endpoint
- ✅ Production-ready configuration
- ✅ Docker support
