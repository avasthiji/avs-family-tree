#!/bin/bash

# AVS Family Tree - Project Startup Script
# This script will start MongoDB, run the development server, and provide seeding instructions

echo "======================================"
echo "AVS Family Tree - Startup Script"
echo "அகில இந்திய வேளாளர் சங்கம்"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if MongoDB is running
echo -e "${BLUE}Checking MongoDB status...${NC}"
if pgrep -x "mongod" > /dev/null
then
    echo -e "${GREEN}✓ MongoDB is already running${NC}"
else
    echo -e "${YELLOW}⚠ MongoDB is not running. Starting MongoDB...${NC}"
    
    # Try to start MongoDB using brew services (macOS)
    if command -v brew &> /dev/null; then
        brew services start mongodb-community 2>/dev/null
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✓ MongoDB started successfully${NC}"
        else
            echo -e "${RED}✗ Failed to start MongoDB with brew${NC}"
            echo -e "${YELLOW}Please start MongoDB manually:${NC}"
            echo "  mongod --dbpath /path/to/your/data/directory"
        fi
    else
        echo -e "${YELLOW}Please start MongoDB manually:${NC}"
        echo "  mongod --dbpath /path/to/your/data/directory"
    fi
fi

echo ""
echo "======================================"
echo -e "${BLUE}Starting Development Server...${NC}"
echo "======================================"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo -e "${RED}✗ .env.local file not found!${NC}"
    echo -e "${YELLOW}The file should have been created automatically.${NC}"
    echo -e "${YELLOW}Please ensure the file exists with proper configuration.${NC}"
    echo ""
else
    echo -e "${GREEN}✓ Environment file found${NC}"
fi

# Check if node_modules exists
if [ ! -d node_modules ]; then
    echo -e "${YELLOW}⚠ node_modules not found. Installing dependencies...${NC}"
    npm install
    echo -e "${GREEN}✓ Dependencies installed${NC}"
    echo ""
fi

# Start the development server
echo -e "${GREEN}Starting Next.js Development Server...${NC}"
echo ""
echo "======================================"
echo "📍 Application will be available at:"
echo "   ${GREEN}http://localhost:3000${NC}"
echo "======================================"
echo ""
echo -e "${YELLOW}🔑 Demo Accounts:${NC}"
echo "   Admin:      admin@avs.com / admin123"
echo "   Matchmaker: matchmaker@avs.com / matchmaker123"
echo "   User:       suresh.raman@email.com / password123"
echo "   Pending:    vijay.mohan@email.com / password123"
echo ""
echo "======================================"
echo -e "${YELLOW}📦 Database Seeding:${NC}"
echo ""
echo "   Option 1 (Recommended):"
echo "   → Open ${GREEN}http://localhost:3000/seed${NC}"
echo "   → Click 'Seed Database' button"
echo ""
echo "   Option 2 (Command line):"
echo "   → Open a new terminal"
echo "   → Run: ${GREEN}npm run seed${NC}"
echo ""
echo "======================================"
echo ""
echo -e "${BLUE}Press Ctrl+C to stop the server${NC}"
echo ""

# Start the development server
npm run dev
