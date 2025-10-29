import { User } from "oidc-client-ts";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  attributes?: Record<string, any>;
}

export interface AuthError {
  code: string;
  message: string;
}

class OIDCAuthService {
  // Lấy thông tin user hiện tại
  getUser(): User | null {
    // This will be handled by the OIDC context
    return null;
  }

  // Kiểm tra trạng thái đăng nhập
  isAuthenticated(): boolean {
    // This will be handled by the OIDC context
    return false;
  }

  // Đăng nhập (sẽ redirect đến Cognito)
  async signIn(): Promise<void> {
    // This will be handled by the OIDC context
    throw new Error("Use OIDC context hooks instead");
  }

  // Đăng xuất
  async signOut(): Promise<void> {
    // This will be handled by the OIDC context
    throw new Error("Use OIDC context hooks instead");
  }

  // Xử lý lỗi authentication
  private handleAuthError(error: any): AuthError {
    console.error('Auth Error:', error);
    
    if (error.message?.includes('User cancelled')) {
      return { code: 'USER_CANCELLED', message: 'Người dùng đã hủy đăng nhập' };
    }
    
    if (error.message?.includes('Network error')) {
      return { code: 'NETWORK_ERROR', message: 'Lỗi kết nối mạng' };
    }
    
    if (error.message?.includes('Invalid credentials')) {
      return { code: 'INVALID_CREDENTIALS', message: 'Thông tin đăng nhập không hợp lệ' };
    }
    
    return { code: 'UNKNOWN_ERROR', message: 'Có lỗi xảy ra, vui lòng thử lại' };
  }
}

export default new OIDCAuthService();
