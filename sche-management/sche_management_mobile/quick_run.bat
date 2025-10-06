@echo off
echo ========================================
echo    Flutter App Runner
echo ========================================
echo.

REM Navigate to Flutter project directory
cd /d "D:\SWD\Student-Cultural-House-Event-Management-FE\sche-management\sche_management_mobile"

REM Set Flutter path
set FLUTTER_PATH=C:\Users\admin\Downloads\flutter_windows_3.35.4-stable\flutter\bin

echo Current directory: %CD%
echo Flutter path: %FLUTTER_PATH%
echo.

echo Available options:
echo [1] Run on Chrome (Web)
echo [2] Run on Android Emulator
echo [3] Run on Windows Desktop
echo [4] Check Flutter devices
echo [5] Clean and rebuild
echo [0] Exit
echo.

set /p choice="Choose option (0-5): "

if "%choice%"=="1" (
    echo.
    echo Starting Flutter app on Chrome...
    "%FLUTTER_PATH%\flutter" run -d chrome
) else if "%choice%"=="2" (
    echo.
    echo Starting Flutter app on Android Emulator...
    "%FLUTTER_PATH%\flutter" run -d android
) else if "%choice%"=="3" (
    echo.
    echo Starting Flutter app on Windows Desktop...
    "%FLUTTER_PATH%\flutter" run -d windows
) else if "%choice%"=="4" (
    echo.
    echo Checking available devices...
    "%FLUTTER_PATH%\flutter" devices
    echo.
    pause
) else if "%choice%"=="5" (
    echo.
    echo Cleaning and rebuilding...
    "%FLUTTER_PATH%\flutter" clean
    "%FLUTTER_PATH%\flutter" pub get
    echo.
    echo Clean completed! You can now run the app.
    pause
) else if "%choice%"=="0" (
    echo Goodbye!
    exit /b 0
) else (
    echo Invalid choice. Please try again.
    pause
)

echo.
echo Press any key to exit...
pause >nul
