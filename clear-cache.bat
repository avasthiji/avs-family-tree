@echo off
echo Clearing Next.js cache and rebuilding...

REM Remove .next directory
if exist .next rmdir /s /q .next

REM Remove node_modules/.cache if exists
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo Cache cleared!
echo Starting dev server...

REM Start dev server
npm run dev

