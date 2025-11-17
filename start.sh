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

echo "[2/3] Starting server on http://localhost:3000"
echo ""
echo "Terminal will open in your browser automatically."
echo "Press Ctrl+C to stop the server."
echo ""
echo "================================================"
echo ""

# Open browser (try different commands for different systems)
sleep 2
if command -v xdg-open &> /dev/null; then
    xdg-open http://localhost:3000 &
elif command -v open &> /dev/null; then
    open http://localhost:3000 &
fi

# Start server
npx serve -p 3000
