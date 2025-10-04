@echo off
echo ========================================
echo    Enable Windows Developer Mode
echo ========================================
echo.

REM Check if running as administrator
net session >nul 2>&1
if %errorLevel% == 0 (
    echo Running as Administrator - OK
) else (
    echo WARNING: Not running as Administrator
    echo Please right-click and "Run as Administrator"
    echo.
    pause
    exit /b 1
)

echo Opening Windows Developer Settings...
echo.
echo Please follow these steps:
echo 1. Turn ON "Developer Mode"
echo 2. Accept the warning dialog
echo 3. Restart your computer
echo 4. After restart, run your Flutter app again
echo.

REM Open developer settings
start ms-settings:developers

echo.
echo After enabling Developer Mode and restarting:
echo - Flutter will be able to build with plugins
echo - Symlink support will be enabled
echo - Your app will run successfully
echo.

echo Press any key to exit...
pause >nul
