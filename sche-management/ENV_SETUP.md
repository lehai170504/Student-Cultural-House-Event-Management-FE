# Cấu hình Environment Variables cho AWS Cognito OIDC

## Bước 1: Tạo file .env.local

Tạo file `.env.local` trong thư mục `sche-management` với nội dung sau:

```env
# AWS Cognito OIDC Configuration
NEXT_PUBLIC_COGNITO_AUTHORITY=https://cognito-idp.ap-southeast-2.amazonaws.com/ap-southeast-2_9RLjNQhOk
NEXT_PUBLIC_COGNITO_CLIENT_ID=6rer5strq9ga876qntv37ngv6d
NEXT_PUBLIC_COGNITO_DOMAIN=https://ap-southeast-29rljnqhok.auth.ap-southeast-2.amazoncognito.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Bước 2: Cấu hình trong AWS Cognito Console

### 2.1. Cấu hình Callback URLs

Trong AWS Cognito Console, vào **App Integration** → **Domain** và thêm các URL sau:

**Allowed callback URLs:**
```
http://localhost:3000/auth/callback
```

**Allowed sign-out URLs:**
```
http://localhost:3000
```

### 2.2. Cấu hình Silent Callback (tùy chọn)

Nếu bạn muốn sử dụng silent renewal, thêm:

**Allowed callback URLs:**
```
http://localhost:3000/auth/callback
http://localhost:3000/silent-callback
```

## Bước 3: Kiểm tra cấu hình

1. Chạy ứng dụng: `npm run dev`
2. Truy cập: `http://localhost:3000`
3. Click "Demo Authentication" hoặc "Đăng nhập"
4. Click "Sign in" để đăng nhập qua AWS Cognito
5. Bạn sẽ được chuyển hướng đến trang đăng nhập của Cognito

### Các trang demo:
- **Trang chủ**: `http://localhost:3000` - Hiển thị UserProfile nếu đã đăng nhập
- **Login**: `http://localhost:3000/login` - Trang đăng nhập
- **Auth Demo**: `http://localhost:3000/auth-demo` - Demo đầy đủ với tokens

## Cấu hình cho Production

Khi deploy lên production, cập nhật các biến sau:

```env
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

Và cập nhật callback URLs trong Cognito Console thành:
```
https://your-domain.com/auth/callback
https://your-domain.com/silent-callback
```

## Lưu ý

- File `.env.local` không được commit vào git
- Thay đổi `NEXT_PUBLIC_APP_URL` khi deploy lên domain khác
- Đảm bảo callback URLs trong Cognito Console khớp với cấu hình
