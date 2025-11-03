# NVH Sinh Viên - Flutter Mobile App

Ứng dụng di động tích điểm cho sinh viên sử dụng dịch vụ tại Nhà Văn Hóa Sinh Viên.

## Tính năng hiện có

### 1. Welcome/Onboarding Screen
- Màn hình chào mừng với logo NVH
- 3 slides giới thiệu về ứng dụng
- Auto-slide navigation
- Hỗ trợ bỏ qua để vào app nhanh

### 2. Đăng ký (Register)
- Form đăng ký với validation
- Email, password, confirm password
- UI hiện đại theo design hệ thống
- Tích hợp sẵn với Cognito

### 3. Đăng nhập (Login)
- Form đăng nhập với Cognito Hosted UI
- Forgot password (sẽ phát triển)
- Error handling
- UI/UX tương tự web app

### 4. Home Screen
- **Public access** - Không cần đăng nhập để xem
- **Login banner** - Hiển thị khi chưa đăng nhập
- Hero carousel với 4 slides events
- Auto-slide animation
- Quick actions: Sự kiện, Đổi quà, Thẻ thành viên, Điểm
- Rewards section
- Coming events list
- Modern Material Design

## Cấu trúc thư mục

```
lib/
├── config/
│   └── api_config.dart          # API configuration & endpoints
├── features/
│   ├── auth/
│   │   ├── login_page.dart      # Login screen
│   │   ├── register_page.dart   # Register screen
│   │   └── welcome_page.dart    # Onboarding/Welcome
│   └── home/
│       └── home_page.dart       # Home/Main screen
├── services/
│   ├── api_client.dart          # HTTP client với auth headers
│   └── auth_service.dart        # Cognito authentication
└── main.dart                    # App entry point
```

## Cấu hình

### 1. AWS Cognito
Đã cấu hình sẵn trong `main.dart`:
- Pool ID: `ap-southeast-2_9RLjNQhOk`
- App Client ID: `36ocon6bf59e7dtt3vq13kkid2`
- Region: `ap-southeast-2`

### 2. API Backend
Base URL: `https://brachycranic-noncorrelative-joya.ngrok-free.dev/api/v1`

Các endpoints:
- `/me` - Profile
- `/events` - Events list
- `/gifts` - Gifts shop
- `/students/me/complete-profile` - Complete profile

## Dependencies

```yaml
amplify_flutter: ^1.0.0          # AWS Amplify core
amplify_auth_cognito: ^1.0.0     # Cognito authentication
http: ^1.2.2                     # HTTP client
flutter_secure_storage: ^9.2.2   # Token storage
```

## Chạy app

```bash
# 1. Cài đặt dependencies
flutter pub get

# 2. Chạy trên Android
flutter run

# 3. Chạy trên iOS (nếu có Mac)
flutter run -d ios
```

## Screens Flow

1. **Home** → Màn hình chính (public access)
   - Hero carousel events
   - Quick actions
   - Rewards & coming events
   - Login banner nếu chưa đăng nhập

2. **Login/Register** → Chỉ khi cần dùng chức năng
   - Đăng ký/Đăng nhập với Cognito
   - Quay về Home sau khi đăng nhập

3. **Welcome** → Onboarding screen (optional)
   - Có thể bỏ qua
   - Hoặc xem giới thiệu app

## Next Steps

- [ ] Implement Events list screen
- [ ] Implement Gifts shop screen
- [ ] Implement Profile screen
- [ ] Implement QR Code scanner for events
- [ ] Implement Points history
- [ ] Push notifications
- [ ] Offline mode support

## Design System

### Colors
- Primary: `#FB923C` (Orange 400)
- Secondary: `#F97316` (Orange 500)
- Background: `#F9FAFB` (Gray 50)
- Text: `#111827` (Gray 900)

### Typography
- Headings: Bold, 24-32px
- Body: Regular, 14-16px
- Small: 12-14px

## Notes

- App chỉ dành cho **sinh viên**
- Tích điểm qua tham gia sự kiện
- Đổi quà bằng điểm tích lũy
- Cognito Hosted UI cho auth flow

