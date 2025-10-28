@echo off
echo ========================================
echo    Nhà Văn Hóa Sinh Viên - Flutter App
echo ========================================
echo.

REM Set Flutter path for this session
set FLUTTER_PATH=C:\Users\admin\Downloads\flutter_windows_3.35.4-stable\flutter\bin

echo Available devices:
echo [1] Windows Desktop
echo [2] Chrome Browser  
echo [3] Edge Browser
echo [4] Android Emulator (if available)
echo.

set /p choice="Choose device (1-4): "

if "%choice%"=="1" (
    echo Starting Flutter app on Windows...
    "%FLUTTER_PATH%\flutter" run -d windows
) else if "%choice%"=="2" (
    echo Starting Flutter app on Chrome...
    "%FLUTTER_PATH%\flutter" run -d chrome
) else if "%choice%"=="3" (
    echo Starting Flutter app on Edge...
    "%FLUTTER_PATH%\flutter" run -d edge
) else if "%choice%"=="4" (
    echo Starting Flutter app on Android...
    "%FLUTTER_PATH%\flutter" run -d android
) else (
    echo Invalid choice. Please run the script again.
)

echo.
echo Press any key to exit...
pause >nul
