@echo off
echo ========================================
echo    Adding Flutter to System PATH
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

REM Flutter path
set FLUTTER_PATH=C:\Users\admin\Downloads\flutter_windows_3.35.4-stable\flutter\bin

echo Adding Flutter to system PATH...
echo Path: %FLUTTER_PATH%

REM Add to system PATH
setx PATH "%PATH%;%FLUTTER_PATH%" /M

if %errorLevel% == 0 (
    echo.
    echo ✅ Flutter added to PATH successfully!
    echo.
    echo IMPORTANT: Please restart your terminal/VS Code for changes to take effect.
    echo After restart, you can use 'flutter' command directly.
    echo.
) else (
    echo.
    echo ❌ Failed to add Flutter to PATH
    echo Please try running this script as Administrator
    echo.
)

echo Alternative: You can also add manually:
echo 1. Open System Properties ^> Environment Variables
echo 2. Edit PATH variable
echo 3. Add: %FLUTTER_PATH%
echo.

echo Press any key to exit...
pause >nul
