@echo off
title Chicken Mashwi - Local Web Server
color 0E

echo =========================================================
echo            CHICKEN MASHWI - WEBSITE LAUNCHER
echo                 Good Food, Good Mood
echo =========================================================
echo.

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] Node.js detected! Starting local web server on port 3000...
    echo.
    echo Website URL:  http://localhost:3000
    echo Menu Card:    http://localhost:3000/menu.html
    echo Contact Page: http://localhost:3000/contact.html
    echo.
    echo Opening website in your default browser...
    
    :: Wait 1 second and open browser
    start "" http://localhost:3000
    
    echo.
    echo ---------------------------------------------------------
    echo Server is actively running!
    echo To stop the server, press Ctrl + C or close this window.
    echo ---------------------------------------------------------
    echo.
    node server.js
) else (
    echo [NOTE] Node.js is not found. Opening index.html directly...
    start "" "%~dp0index.html"
    echo.
    echo Opened index.html in your default browser.
    pause
)
