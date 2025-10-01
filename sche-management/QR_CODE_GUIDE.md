# 📱 Hướng dẫn sử dụng QR Code Check-in

## 🎯 QR Code đã được cập nhật!

QR Code hiện tại đã sử dụng thư viện `qrcode` thực tế, có thể quét được bằng điện thoại.

### ✅ Tính năng QR Code:

1. **QR Code thực tế**: Sử dụng thư viện `qrcode` để tạo QR code có thể quét được
2. **Thông tin đầy đủ**: Chứa JSON data với thông tin sinh viên đầy đủ
3. **Tải xuống**: Có thể download QR code dưới dạng PNG
4. **Copy mã**: Copy mã QR để chia sẻ
5. **Làm mới**: Refresh QR code nếu cần
6. **Test QR Code**: Component test để kiểm tra QR code hoạt động

### 📋 Thông tin trong QR Code:

QR Code chứa JSON data với thông tin sinh viên:

```json
{
  "id": "STU2024001",
  "name": "Nguyễn Văn A",
  "studentId": "john_doe",
  "type": "student_checkin",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0"
}
```

### 🔧 Cách sử dụng:

1. **Truy cập tab "QR Code"** trong profile
2. **QR Code chính**: Hiển thị QR code cá nhân để check-in sự kiện
3. **Test QR Code**: Sử dụng để kiểm tra QR code có hoạt động không

### 📱 Test QR Code:

1. Nhấn "Tạo QR Code Test" để tạo QR code test
2. Sử dụng app quét QR trên điện thoại (Camera, QR Scanner, etc.)
3. Quét QR code và kiểm tra xem có hiển thị JSON data không
4. JSON data sẽ chứa thông tin đầy đủ của sinh viên
5. Nếu quét được và hiển thị đúng thông tin thì QR Code hoạt động tốt

### 🎨 Cấu hình QR Code:

```javascript
const qrDataUrl = await QRCode.toDataURL(qrCodeIdentifier, {
  width: 200,           // Kích thước QR code
  margin: 2,            // Lề xung quanh
  color: {
    dark: '#000000',    // Màu đen cho pattern
    light: '#FFFFFF'    // Màu trắng cho background
  },
  errorCorrectionLevel: 'M'  // Mức độ sửa lỗi
});
```

### 🚀 Cách check-in sự kiện:

1. Mở tab "QR Code" trong profile
2. Hiển thị QR code cho ban tổ chức
3. Ban tổ chức quét QR code bằng app quản lý sự kiện
4. Hệ thống sẽ tự động check-in và cộng điểm

### 🔒 Bảo mật:

- QR Code chứa mã định danh duy nhất của sinh viên
- Không chia sẻ QR code với người khác
- QR code có thể được làm mới nếu cần thiết
- Mỗi lần check-in thành công sẽ nhận được điểm thưởng

### 📦 Dependencies đã cài:

```bash
npm install qrcode @types/qrcode
```

### 🎉 Kết quả:

QR Code hiện tại đã có thể quét được bằng điện thoại và chứa đúng mã định danh sinh viên!
