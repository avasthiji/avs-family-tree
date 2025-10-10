#!/bin/bash

echo "🧹 Clearing Next.js cache and rebuilding..."

# Remove .next directory
rm -rf .next

# Remove node_modules/.cache if exists
rm -rf node_modules/.cache

echo "✅ Cache cleared!"
echo "🚀 Starting dev server..."

# Start dev server
npm run dev

