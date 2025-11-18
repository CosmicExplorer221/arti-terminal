@echo off
echo ================================================
echo    ARTI Terminal - Starting Local Server
echo ================================================
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from: https://nodejs.org/
    echo.
    pause
    exit /b 1
)

echo [1/3] Checking Node.js installation...
node --version
echo.

echo [2/4] Starting Slack proxy on http://localhost:3001
start /B node slack-proxy.js
echo.

echo [3/4] Starting static server on http://localhost:3000
echo.
echo Terminal will open in your browser automatically.
echo Press Ctrl+C to stop both servers.
echo.
echo ================================================
echo.

REM Wait a moment for proxy to start
timeout /t 2 /nobreak >nul

REM Start browser and static server
start http://localhost:3000
npx serve -p 3000

pause
