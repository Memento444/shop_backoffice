@echo off
title Push Mama Shop to GitHub
cd /d "%~dp0"
set PATH=C:\Users\fung4\.gemini\antigravity\scratch\MinGit\cmd;%PATH%
echo ============================================================
echo   Push Mama Shop Back-Office to GitHub
echo ============================================================
echo.
set /p REPO_URL="Enter your GitHub Repository URL (e.g. https://github.com/username/mama-shop.git): "
if "%REPO_URL%"=="" (
  echo Error: Repository URL cannot be empty.
  pause
  exit /b
)
git remote remove origin 2>nul
git remote add origin %REPO_URL%
git branch -M main
echo Pushing to GitHub...
git push -u origin main
echo.
echo ============================================================
echo   Pushed to GitHub!
echo   Next Step: Go to https://vercel.com to import this repository.
echo ============================================================
pause
