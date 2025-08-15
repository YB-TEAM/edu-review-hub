#!/bin/bash

# Test deployment script for local development
# This script simulates the Render deployment process

set -e

echo "🧪 Testing Edu Review Hub Backend Deployment Locally..."

# Function to log with timestamp
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    log "❌ Please run this script from the backend directory"
    exit 1
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    log "⚠️  .env file not found. Please create one based on env.example"
    log "📝 Copy env.example to .env and fill in your database credentials"
    exit 1
fi

# Install dependencies
log "📦 Installing dependencies..."
npm ci

# Build the application
log "🔨 Building the application..."
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    log "❌ Build failed - dist directory not found"
    exit 1
fi

log "✅ Build completed successfully!"

# Test database connection
log "🔌 Testing database connection..."
if npm run typeorm -- query "SELECT 1" > /dev/null 2>&1; then
    log "✅ Database connection successful"
else
    log "❌ Database connection failed"
    log "💡 Make sure your database is running and .env is configured correctly"
    exit 1
fi

# Test migrations
log "🔄 Testing migrations..."
if npm run migration:run; then
    log "✅ Migrations completed successfully"
else
    log "❌ Migrations failed"
    exit 1
fi

# Test seeds
log "🌱 Testing seeds..."
if npm run seed; then
    log "✅ Seeds completed successfully"
else
    log "❌ Seeds failed"
    exit 1
fi

# Test health endpoint
log "🏥 Testing health endpoint..."
# Start the application in background
npm run start:prod &
APP_PID=$!

# Wait for app to start
sleep 10

# Test health endpoint
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    log "✅ Health endpoint is working"
else
    log "❌ Health endpoint failed"
    kill $APP_PID 2>/dev/null || true
    exit 1
fi

# Stop the application
kill $APP_PID 2>/dev/null || true

log "🎉 All tests passed! Your application is ready for deployment."
log "📋 Next steps:"
log "   1. Push your code to GitHub"
log "   2. Follow the deployment guide in RENDER_DEPLOYMENT_GUIDE.md"
log "   3. Deploy to Render!"
