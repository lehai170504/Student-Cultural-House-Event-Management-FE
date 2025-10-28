# Student Cultural House Event Management - Mobile App

## Flutter Setup Complete! 🎉

Flutter project đã được cài đặt thành công trong thư mục `sche_management_mobile`.

### Cấu trúc Project
```
sche_management_mobile/
├── lib/
│   └── main.dart              # Entry point của ứng dụng
├── android/                   # Android platform code
├── ios/                       # iOS platform code
├── web/                       # Web platform code
├── windows/                   # Windows platform code
├── pubspec.yaml              # Dependencies và cấu hình
└── flutter_setup.bat         # Script để setup Flutter PATH
```

### Dependencies đã được cài đặt:
- **State Management**: `provider` - Quản lý state của ứng dụng
- **HTTP Requests**: `http`, `dio` - Gọi API
- **Navigation**: `go_router` - Điều hướng trong app
- **UI Components**: `flutter_screenutil`, `cached_network_image`
- **Local Storage**: `shared_preferences`, `hive`
- **Date & Time**: `intl` - Format ngày tháng
- **Image Picker**: `image_picker` - Chọn ảnh từ thiết bị
- **QR Code**: `qr_flutter`, `qr_code_scanner` - Tạo và quét QR code

### Cách sử dụng:

#### 1. Chạy Flutter commands:
```bash
# Sử dụng đường dẫn đầy đủ (như đã làm)
"C:\Users\admin\Downloads\flutter_windows_3.35.4-stable\flutter\bin\flutter" doctor

# Hoặc chạy flutter_setup.bat để setup PATH tạm thời
flutter_setup.bat
```

#### 2. Các lệnh thường dùng:
```bash
# Kiểm tra Flutter installation
flutter doctor

# Cài đặt dependencies
flutter pub get

# Chạy ứng dụng trên Android emulator
flutter run

# Chạy ứng dụng trên web
flutter run -d chrome

# Build APK cho Android
flutter build apk

# Build cho web
flutter build web
```

#### 3. Phát triển ứng dụng:
- File chính: `lib/main.dart`
- Thêm screens trong `lib/screens/`
- Thêm widgets trong `lib/widgets/`
- Thêm models trong `lib/models/`
- Thêm services trong `lib/services/`

### Lưu ý:
- Flutter binary chưa được thêm vào system PATH
- Để thêm vĩnh viễn, thêm đường dẫn này vào Environment Variables:
  `C:\Users\admin\Downloads\flutter_windows_3.35.4-stable\flutter\bin`
- Visual Studio chưa được cài đặt (cần cho Windows app development)

### Tiếp theo:
1. Mở project trong VS Code hoặc Android Studio
2. Bắt đầu phát triển UI và logic cho ứng dụng quản lý sự kiện
3. Kết nối với backend API (Next.js project trong thư mục cha)

Happy coding! 🚀
