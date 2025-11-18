#!/bin/bash

echo "================================================"
echo "   ARTI Terminal - Starting Local Server"
echo "================================================"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    echo ""
    exit 1
fi

echo "[1/3] Checking Node.js installation..."
node --version
echo ""

echo "[2/4] Starting Slack proxy on http://localhost:3001"
node slack-proxy.js &
PROXY_PID=$!
echo ""

echo "[3/4] Starting static server on http://localhost:3000"
echo ""
echo "Terminal will open in your browser automatically."
echo "Press Ctrl+C to stop both servers."
echo ""
echo "================================================"
echo ""

# Cleanup function to kill both processes
cleanup() {
    echo ""
    echo "Stopping servers..."
    kill $PROXY_PID 2>/dev/null
    exit 0
}
trap cleanup INT TERM

# Wait for proxy to start
sleep 2

# Open browser (try different commands for different systems)
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000 &
elif command -v open &> /dev/null; then
    open http://localhost:3000 &
fi

# Start server
npx serve -p 3000
