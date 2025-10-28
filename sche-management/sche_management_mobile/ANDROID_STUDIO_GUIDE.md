# 🚀 Hướng Dẫn Chạy Flutter App Trên Android Studio

## ✅ Bạn hoàn toàn có thể chạy Flutter app trên Android Studio!

### 📋 Bước 1: Mở Project trong Android Studio

1. **Mở Android Studio**
2. **File → Open** (hoặc **Open an existing Android Studio project**)
3. **Navigate đến thư mục**: `D:\SWD\Student-Cultural-House-Event-Management-FE\sche-management\sche_management_mobile`
4. **Click "OK"** để mở project

### 📱 Bước 2: Thiết lập Android Emulator

#### **Tạo Virtual Device:**
1. Trong Android Studio, click **Device Manager** (icon điện thoại ở thanh công cụ)
2. Click **"Create Device"**
3. Chọn **Phone** → **Pixel 4** (hoặc device bạn muốn)
4. Click **"Next"**
5. Chọn **System Image** (recommend: **API 33** hoặc **API 34**)
6. Click **"Download"** nếu chưa có
7. Click **"Next"** → **"Finish"**

#### **Khởi động Emulator:**
1. Trong **Device Manager**, click **▶️ Play button** bên cạnh device vừa tạo
2. Đợi emulator khởi động (có thể mất vài phút lần đầu)

### 🎯 Bước 3: Chạy Flutter App

#### **Cách 1: Sử dụng Android Studio**
1. **Chọn device** từ dropdown (emulator vừa tạo)
2. Click **▶️ Run button** (hoặc **Shift + F10**)
3. App sẽ tự động build và chạy trên emulator

#### **Cách 2: Sử dụng Terminal trong Android Studio**
1. Mở **Terminal** trong Android Studio (View → Tool Windows → Terminal)
2. Chạy lệnh:
```bash
"C:\Users\admin\Downloads\flutter_windows_3.35.4-stable\flutter\bin\flutter" run
```

### 🔧 Bước 4: Troubleshooting

#### **Nếu không thấy emulator:**
```bash
# Kiểm tra devices có sẵn
"C:\Users\admin\Downloads\flutter_windows_3.35.4-stable\flutter\bin\flutter" devices

# Khởi động emulator từ command line
"C:\Users\admin\Downloads\android-sdk\emulator\emulator" -avd <device_name>
```

#### **Nếu gặp lỗi build:**
1. **File → Invalidate Caches and Restart**
2. **Tools → Flutter → Flutter Clean**
3. **Tools → Flutter → Flutter Pub Get**

### 📱 Bước 5: Test Footer Menu

Khi app chạy trên emulator, bạn sẽ thấy:

1. **🏠 Tab Trang chủ**: Dashboard với thống kê và sự kiện sắp tới
2. **🎪 Tab Sự kiện**: Danh sách sự kiện với filter
3. **🔔 Tab Thông báo**: Quản lý thông báo
4. **👤 Tab Hồ sơ**: Thông tin cá nhân và menu

### 🎮 Hot Reload & Debug

- **Hot Reload**: Save file (Ctrl+S) để xem thay đổi ngay lập tức
- **Hot Restart**: Click **🔄 Restart button** để restart app
- **Debug**: Set breakpoints và debug như Android app thông thường

### 📊 DevTools

Flutter DevTools sẽ tự động mở để bạn có thể:
- **Inspector**: Kiểm tra widget tree
- **Performance**: Phân tích hiệu suất
- **Memory**: Theo dõi memory usage
- **Network**: Kiểm tra network requests

### 🚀 Lợi ích của Android Studio

✅ **Better debugging** với Flutter DevTools
✅ **Hot reload** nhanh hơn
✅ **Emulator integration** mượt mà
✅ **Code completion** và IntelliSense
✅ **Git integration** tốt hơn
✅ **Plugin support** (Flutter, Dart)

### 📝 Lưu ý

- **Lần đầu build** có thể mất 5-10 phút
- **Emulator** cần ít nhất 4GB RAM
- **Enable USB Debugging** nếu dùng thiết bị thật
- **Keep Android Studio updated** để có performance tốt nhất

### 🎯 Kết quả mong đợi

Sau khi setup xong, bạn sẽ có:
- Flutter app chạy mượt mà trên Android emulator
- Footer menu hoạt động hoàn hảo
- Khả năng debug và phát triển dễ dàng
- Trải nghiệm phát triển chuyên nghiệp

**Chúc bạn thành công! 🎉**
