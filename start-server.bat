@echo off
title WebXHere Local Server Launcher
echo ===================================================
echo   WebXHere Studio - Local Web Server Launcher
echo ===================================================
echo.

:: Check for Python
where python >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Python detected!
    echo Starting Python http.server on port 8000...
    echo Browser will open automatically at http://localhost:8000
    echo.
    start http://localhost:8000
    python -m http.server 8000
    goto end
)

:: Check for Node.js (npx)
where npx >nul 2>nul
if %errorlevel% equ 0 (
    echo [OK] Node.js/npx detected!
    echo Starting serve on port 3000...
    echo Browser will open automatically at http://localhost:3000
    echo.
    start http://localhost:3000
    npx -y serve
    goto end
)

echo [WARNING] Neither Python nor Node.js was found in your system's PATH.
echo.
echo Modern browsers (like Chrome and Edge) block JavaScript from running
echo when HTML files are opened directly via double-click from system folders 
echo (due to file:// protocol security restrictions).
echo.
echo Suggestions:
echo 1. Install Python or Node.js to run this launcher.
echo 2. Try opening index.html using Firefox (which has less restrictive local file policies).
echo 3. Copy the 'webxhere-studio' folder onto your Desktop or Documents and open index.html.
echo.
pause

:end
