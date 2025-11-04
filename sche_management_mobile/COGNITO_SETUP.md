# AWS Cognito Setup cho Flutter Mobile App

## Bước 1: Vào AWS Cognito Console

1. Truy cập: https://ap-southeast-2.console.aws.amazon.com/cognito
2. Chọn User Pool: `ap-southeast-2_9RLjNQhOk`
3. Vào tab "App integration"

## Bước 2: Tìm App Client

Tìm App Client có ID: `36ocon6bf59e7dtt3vq13kkid2` (Dich-vu-sinh-vien-Mobile)

## Bước 3: Bật Hosted UI

1. Click vào App Client ID `36ocon6bf59e7dtt3vq13kkid2` hoặc App Client "Dich-vu-sinh-vien-Mobile"
2. Scroll xuống mục **"Advanced app client settings"**
3. Tìm phần **"Hosted UI"**
4. **Bật** switch **"Use Cognito Hosted UI"** ✅

## Bước 4: Cấu hình URLs

Trong phần **"Allowed callback URLs"**, thêm:
```
scheapp://login
```

Trong phần **"Allowed sign-out URLs"**, thêm:
```
scheapp://logout
```

## Bước 5: OAuth 2.0 Settings

**Allowed OAuth flows:**
- ✅ Authorization code grant

**Allowed OAuth scopes:**
- ✅ openid
- ✅ email
- ✅ profile
- ✅ aws.cognito.signin.user.admin

## Bước 6: Save và Test

1. Click **"Save changes"**
2. Hot restart Flutter app
3. Nhấn "Đăng nhập với Cognito"
4. Browser sẽ mở và chuyển đến Cognito Hosted UI

## Nếu vẫn không work

Kiểm tra:
1. App client ID đúng chưa? → `36ocon6bf59e7dtt3vq13kkid2`
2. Pool ID đúng chưa? → `ap-southeast-2_9RLjNQhOk`
3. Redirect URI khớp chưa? → `scheapp://login`
4. AndroidManifest có `<data android:scheme="scheapp" />` chưa?

## Debug

Mở Terminal/logcat, xem có lỗi gì:
```bash
flutter logs
```

Nếu thấy "Invalid redirect_uri", nghĩa là chưa thêm `scheapp://login` vào Allowed callback URLs trong Cognito Console.

