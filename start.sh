#!/bin/bash

echo "================================================="
echo "🌌 Starting Antigravity 2.0 Custom IDE..."
echo "================================================="

# 1. Check for node_modules, install if missing
if [ ! -d "node_modules" ]; then
    echo "📦 node_modules not found. Installing dependencies..."
    npm install
fi

# 2. Start the local backend connection server in the background
echo "⚡ Launching WebSocket connection backend on port 8081..."
node server.js &
BACKEND_PID=$!

# 3. Start a local static file server and open the browser
echo "🌐 Starting local web server on port 8080..."
# We use npx http-server to serve the files
npx -y http-server -p 8080 &
SERVER_PID=$!

sleep 2

# Open default web browser matching OS
if command -v xdg-open &> /dev/null; then
    # Linux
    xdg-open http://localhost:8080
elif command -v open &> /dev/null; then
    # macOS
    open http://localhost:8080
else
    echo "⚠️ Could not open browser automatically. Please navigate manually to http://localhost:8080"
fi

echo "🚀 Antigravity 2.0 IDE is live! God Mode active."
echo "Press Ctrl+C to terminate the session."

# Capture interrupt signal and clean up child processes
cleanup() {
    echo -e "\n🛑 Stopping servers..."
    kill $BACKEND_PID
    kill $SERVER_PID
    exit
}

trap cleanup INT
wait
