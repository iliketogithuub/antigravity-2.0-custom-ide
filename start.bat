@echo off
title Antigravity 2.0 Custom IDE Launcher
echo =================================================
echo 🌌 Starting Antigravity 2.0 Custom IDE...
echo =================================================

:: 1. Check for node_modules, install if missing
if not exist node_modules (
    echo 📦 node_modules not found. Installing dependencies...
    call npm install
)

:: 2. Start the local backend connection server in a separate background window
echo ⚡ Launching WebSocket connection backend on port 8081...
start "Antigravity IDE Backend" /min node server.js

:: 3. Start a local static file server and open the browser
echo 🌐 Starting local web server on port 8080...
start "Antigravity Web Server" /min npx -y http-server -p 8080
timeout /t 2 /nobreak >nul

echo 🚀 Launching default web browser...
start http://localhost:8080

echo =================================================
echo 🚀 Antigravity 2.0 IDE is live! God Mode active.
echo You can minimize this window. Press any key to stop.
echo =================================================
pause
taskkill /fi "windowtitle eq Antigravity IDE Backend*" /f >nul 2>&1
taskkill /fi "windowtitle eq Antigravity Web Server*" /f >nul 2>&1
