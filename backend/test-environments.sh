#!/bin/bash

# Test script to compare development vs production environments
echo "🧪 Testing Edu Review Hub Backend Environments..."

echo ""
echo "🔧 Testing Development Environment (No SSL):"
echo "=============================================="
NODE_ENV=development node test-db-connection.js

echo ""
echo "🚀 Testing Production Environment (SSL Enabled):"
echo "================================================="
NODE_ENV=production node test-db-connection.js

echo ""
echo "📋 Environment Summary:"
echo "======================="
echo "✅ Development: Should work (no SSL required)"
echo "❌ Production: Will fail locally (SSL not supported)"
echo "✅ Production: Will work on Render (SSL supported)"
echo ""
echo "💡 This is expected behavior!"
echo "   - Local database doesn't support SSL"
echo "   - Render PostgreSQL requires SSL"
echo "   - SSL config is correct for production deployment"
