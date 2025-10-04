# Footer Menu - Hướng Dẫn Sử Dụng

## 🎉 Footer Menu đã được tạo thành công!

Footer menu cho ứng dụng Nhà Văn Hóa Sinh Viên đã được thiết kế và triển khai hoàn chỉnh.

### 📱 Cấu trúc Footer Menu

Footer menu bao gồm 4 tab chính:

1. **🏠 Trang chủ** (`HomeScreen`)
   - Thống kê tổng quan (sự kiện, thành viên, hoạt động, tin tức)
   - Lời chào mừng và thông tin giới thiệu
   - Danh sách sự kiện sắp tới
   - Giao diện gradient đẹp mắt với màu tím chủ đạo

2. **🎪 Sự kiện** (`EventsScreen`)
   - Danh sách tất cả sự kiện
   - Filter theo danh mục (Văn hóa, Thể thao, Giáo dục, Giải trí)
   - Thông tin chi tiết sự kiện (mô tả, thời gian, địa điểm, giá)
   - Nút đăng ký cho mỗi sự kiện

3. **🔔 Thông báo** (`NotificationsScreen`)
   - Thống kê thông báo (chưa đọc/đã đọc)
   - Filter thông báo theo loại
   - Danh sách thông báo với icon và trạng thái đọc/chưa đọc
   - Hiển thị thời gian và nội dung thông báo

4. **👤 Hồ sơ** (`ProfileScreen`)
   - Thông tin cá nhân người dùng
   - Thống kê hoạt động (sự kiện tham gia, điểm tích lũy, bạn bè)
   - Menu tài khoản (thông tin, đổi mật khẩu, cài đặt)
   - Menu hoạt động (lịch sử, đánh giá, chứng nhận)
   - Menu hỗ trợ (trợ giúp, liên hệ, đăng xuất)

### 🎨 Thiết kế UI/UX

- **Màu sắc chủ đạo**: Deep Purple với gradient
- **Typography**: Font chữ rõ ràng, dễ đọc
- **Icons**: Sử dụng Material Icons phù hợp với từng chức năng
- **Cards**: Thiết kế card với shadow và border radius hiện đại
- **Responsive**: Tối ưu cho nhiều kích thước màn hình
- **Animation**: Smooth transitions giữa các tab

### 📂 Cấu trúc Files

```
lib/
├── main.dart                 # Entry point với theme configuration
├── screens/
│   ├── main_screen.dart      # Main screen với BottomNavigationBar
│   ├── home_screen.dart      # Trang chủ
│   ├── events_screen.dart    # Sự kiện
│   ├── notifications_screen.dart # Thông báo
│   └── profile_screen.dart   # Hồ sơ
└── widgets/                  # Custom widgets (để mở rộng sau)
```

### 🚀 Cách chạy ứng dụng

```bash
# Chạy trên Android emulator
flutter run

# Chạy trên web
flutter run -d chrome

# Chạy trên Windows (nếu có Visual Studio)
flutter run -d windows
```

### 🔧 Tính năng đã triển khai

✅ **BottomNavigationBar** với 4 tab chính
✅ **IndexedStack** để giữ state của từng screen
✅ **Responsive design** với gradient backgrounds
✅ **Card-based UI** với shadows và rounded corners
✅ **Icon integration** với Material Icons
✅ **Navigation** smooth giữa các tab
✅ **Theme configuration** với Material 3

### 📋 TODO - Tính năng có thể mở rộng

- [ ] Thêm animation khi chuyển tab
- [ ] Thêm badge số thông báo chưa đọc
- [ ] Tích hợp API thật cho dữ liệu
- [ ] Thêm pull-to-refresh
- [ ] Thêm search functionality
- [ ] Thêm dark mode
- [ ] Thêm localization (đa ngôn ngữ)

### 🎯 Cách sử dụng

1. **Chuyển tab**: Tap vào icon ở bottom navigation
2. **Xem thông tin**: Scroll để xem nội dung chi tiết
3. **Tương tác**: Tap vào các button và card để thực hiện hành động
4. **Tìm kiếm**: Sử dụng search icon trong app bar (Events screen)

Footer menu đã sẵn sàng để sử dụng và có thể dễ dàng mở rộng thêm tính năng mới! 🎉
