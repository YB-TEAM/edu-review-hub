#!/bin/bash

# Edu Review Hub Backend Deployment Script for Render
# This script handles the complete deployment process including database setup

set -e  # Exit on any error

echo "🚀 Starting Edu Review Hub Backend Deployment..."

# Function to log with timestamp
log() {
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if we're running on Render
if [ "$RENDER" = "true" ]; then
    log "✅ Running on Render platform"
else
    log "⚠️  Not running on Render platform"
fi

# Wait for database to be ready
wait_for_database() {
    log "⏳ Waiting for database to be ready..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if pg_isready -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USERNAME" >/dev/null 2>&1; then
            log "✅ Database is ready!"
            return 0
        fi
        
        log "⏳ Database not ready yet (attempt $attempt/$max_attempts)..."
        sleep 2
        attempt=$((attempt + 1))
    done
    
    log "❌ Database connection failed after $max_attempts attempts"
    return 1
}

# Run database migrations
run_migrations() {
    log "🔄 Running database migrations..."
    
    if npm run migration:run; then
        log "✅ Database migrations completed successfully"
    else
        log "❌ Database migrations failed"
        return 1
    fi
}

# Run database seeds
run_seeds() {
    log "🌱 Running database seeds..."
    
    if npm run seed; then
        log "✅ Database seeding completed successfully"
    else
        log "❌ Database seeding failed"
        return 1
    fi
}

# Main deployment process
main() {
    log "📋 Starting deployment process..."
    
    # Wait for database
    if ! wait_for_database; then
        log "❌ Failed to connect to database"
        exit 1
    fi
    
    # Run migrations
    if ! run_migrations; then
        log "❌ Failed to run migrations"
        exit 1
    fi
    
    # Run seeds
    if ! run_seeds; then
        log "❌ Failed to run seeds"
        exit 1
    fi
    
    log "🎉 Deployment completed successfully!"
    log "🚀 Starting the application..."
    
    # Start the application
    exec npm run start:prod
}

# Run main function
main "$@"
