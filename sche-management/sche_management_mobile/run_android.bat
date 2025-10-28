@echo off
echo ========================================
echo    Flutter Android Development Helper
echo ========================================
echo.

REM Set Flutter path
set FLUTTER_PATH=C:\Users\admin\Downloads\flutter_windows_3.35.4-stable\flutter\bin

echo Checking Flutter devices...
echo.

REM Check available devices
"%FLUTTER_PATH%\flutter" devices

echo.
echo ========================================
echo Available options:
echo ========================================
echo [1] Run on Android Emulator
echo [2] Run on Connected Android Device
echo [3] Create new Android Emulator
echo [4] List Android Emulators
echo [5] Start existing Emulator
echo [0] Exit
echo.

set /p choice="Choose option (0-5): "

if "%choice%"=="1" (
    echo.
    echo Starting Flutter app on Android Emulator...
    "%FLUTTER_PATH%\flutter" run -d android
) else if "%choice%"=="2" (
    echo.
    echo Starting Flutter app on Connected Device...
    "%FLUTTER_PATH%\flutter" run -d android
) else if "%choice%"=="3" (
    echo.
    echo Opening Android Studio AVD Manager...
    echo Please create a new Virtual Device in Android Studio:
    echo 1. Tools ^> AVD Manager
    echo 2. Create Virtual Device
    echo 3. Choose device and system image
    echo 4. Configure and finish
    start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe"
) else if "%choice%"=="4" (
    echo.
    echo Listing Android Emulators...
    "%FLUTTER_PATH%\flutter" emulators
) else if "%choice%"=="5" (
    echo.
    echo Available emulators:
    "%FLUTTER_PATH%\flutter" emulators
    echo.
    set /p emulator="Enter emulator name: "
    echo Starting emulator: %emulator%
    "%FLUTTER_PATH%\flutter" emulators --launch %emulator%
) else if "%choice%"=="0" (
    echo Goodbye!
    exit /b 0
) else (
    echo Invalid choice. Please try again.
)

echo.
echo Press any key to exit...
pause >nul
