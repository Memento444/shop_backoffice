@echo off
title Mama Shop Back-Office Server
cd /d "%~dp0"
set PATH=C:\Program Files\nodejs;%PATH%
echo ============================================================
echo   Mama Shop Back-Office - Production Server
echo ============================================================
echo   Local PC Access:   http://localhost:3000
echo   Mobile Wi-Fi:      http://192.168.1.112:3000
echo ============================================================
echo Starting Next.js Production Server...
npm run start
pause
