@echo off
echo Setting up Flutter environment...

REM Add Flutter to PATH for this session
set PATH=%PATH%;C:\Users\admin\Downloads\flutter_windows_3.35.4-stable\flutter\bin

echo Flutter setup complete!
echo You can now use 'flutter' commands directly.
echo.
echo Available commands:
echo   flutter doctor          - Check Flutter installation
echo   flutter pub get         - Install dependencies
echo   flutter run             - Run the app
echo   flutter build apk       - Build Android APK
echo   flutter build web       - Build for web
echo.
echo To make Flutter available permanently, add this path to your system PATH:
echo C:\Users\admin\Downloads\flutter_windows_3.35.4-stable\flutter\bin
echo.
cmd /k
