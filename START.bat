@echo off
REM AVS Family Tree - Project Startup Script (Windows)
REM This script will start the development server and provide instructions

echo ======================================
echo AVS Family Tree - Startup Script
echo அகில இந்திய வேளாளர் சங்கம்
echo ======================================
echo.

REM Check if MongoDB is running
echo Checking MongoDB status...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo [OK] MongoDB is already running
) else (
    echo [WARNING] MongoDB is not running
    echo Please start MongoDB manually:
    echo   - Open MongoDB Compass and connect
    echo   - OR run: mongod --dbpath C:\path\to\your\data\directory
    echo.
    pause
)

echo.
echo ======================================
echo Starting Development Server...
echo ======================================
echo.

REM Check if .env.local exists
if not exist .env.local (
    echo [ERROR] .env.local file not found!
    echo The file should have been created automatically.
    echo Please ensure the file exists with proper configuration.
    echo.
) else (
    echo [OK] Environment file found
)

REM Check if node_modules exists
if not exist node_modules (
    echo [WARNING] node_modules not found. Installing dependencies...
    call npm install
    echo [OK] Dependencies installed
    echo.
)

REM Display information
echo ======================================
echo Application will be available at:
echo   http://localhost:3000
echo ======================================
echo.
echo Demo Accounts:
echo   Admin:      admin@avs.com / admin123
echo   Matchmaker: matchmaker@avs.com / matchmaker123
echo   User:       suresh.raman@email.com / password123
echo   Pending:    vijay.mohan@email.com / password123
echo.
echo ======================================
echo Database Seeding:
echo.
echo   Option 1 (Recommended):
echo   - Open http://localhost:3000/seed
echo   - Click 'Seed Database' button
echo.
echo   Option 2 (Command line):
echo   - Open a new command prompt
echo   - Run: npm run seed
echo.
echo ======================================
echo.
echo Press Ctrl+C to stop the server
echo.

REM Start the development server
call npm run dev
