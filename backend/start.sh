#!/bin/bash

# Start script for Render deployment
# This script ensures proper permissions and runs the deploy script

set -e

echo "🚀 Starting Edu Review Hub Backend on Render..."

# Make deploy script executable
chmod +x deploy.sh

# Run the deploy script
exec ./deploy.sh
