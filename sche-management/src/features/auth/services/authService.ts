import {
  signIn,
  signUp,
  signOut,
  confirmSignUp,
  getCurrentUser,
  resendSignUpCode,
  resetPassword,
  confirmResetPassword,
  updatePassword,
} from "aws-amplify/auth";
import {
  SignUpParams,
  SignInParams,
  ConfirmSignUpParams,
} from "@/features/auth/types/auth";
import { AuthResponse } from "../types/auth";
import axiosInstance from "@/config/axiosInstance";

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

class AuthService {
  // Đăng ký tài khoản mới
  async signUp(email: string, password: string, name?: string): Promise<any> {
    try {
      const signUpParams: SignUpParams = {
        username: email,
        password,
        attributes: name ? { name } : {},
      };

      const result = await signUp(signUpParams);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: this.handleAuthError(error) };
    }
  }

  async getProfile(): Promise<
    | { success: true; data: AuthResponse["data"] }
    | { success: false; error: any }
  > {
    try {
      const res = await axiosInstance.get<AuthResponse>("/me");
      return { success: true, data: res.data.data };
    } catch (error: any) {
      console.error("❌ [getProfile] Lỗi khi lấy thông tin user:", error);
      return { success: false, error };
    }
  }

  // Xác thực email sau khi đăng ký
  async confirmSignUp(email: string, code: string): Promise<any> {
    try {
      const confirmParams: ConfirmSignUpParams = {
        username: email,
        confirmationCode: code,
      };

      const result = await confirmSignUp(confirmParams);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: this.handleAuthError(error) };
    }
  }

  // Đăng nhập
  async signIn(email: string, password: string): Promise<any> {
    try {
      const signInParams: SignInParams = {
        username: email,
        password,
      };

      const result = await signIn(signInParams);
      return { success: true, data: result };
    } catch (error: any) {
      return { success: false, error: this.handleAuthError(error) };
    }
  }

  // Đăng xuất
  async signOut(): Promise<any> {
    try {
      await signOut();
      return { success: true };
    } catch (error: any) {
      return { success: false, error: this.handleAuthError(error) };
    }
  }

  // Lấy thông tin user hiện tại
  async getCurrentUser(): Promise<any> {
    try {
      const user = await getCurrentUser();
      return { success: true, data: user };
    } catch (error: any) {
      return { success: false, error: this.handleAuthError(error) };
    }
  }

  // Kiểm tra trạng thái đăng nhập
  async isAuthenticated(): Promise<boolean> {
    try {
      await getCurrentUser();
      return true;
    } catch {
      return false;
    }
  }

  // Gửi lại mã xác thực
  async resendSignUp(email: string): Promise<any> {
    try {
      await resendSignUpCode({ username: email });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: this.handleAuthError(error) };
    }
  }

  // Quên mật khẩu
  async forgotPassword(email: string): Promise<any> {
    try {
      await resetPassword({ username: email });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: this.handleAuthError(error) };
    }
  }

  // Đặt lại mật khẩu
  async forgotPasswordSubmit(
    email: string,
    code: string,
    newPassword: string
  ): Promise<any> {
    try {
      await confirmResetPassword({
        username: email,
        confirmationCode: code,
        newPassword: newPassword,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: this.handleAuthError(error) };
    }
  }

  // Đổi mật khẩu
  async changePassword(oldPassword: string, newPassword: string): Promise<any> {
    try {
      const user = await getCurrentUser();
      await updatePassword({
        oldPassword,
        newPassword,
      });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: this.handleAuthError(error) };
    }
  }

  // Xử lý lỗi authentication
  private handleAuthError(error: any): AuthError {
    console.error("Auth Error:", error);

    switch (error.code) {
      case "UserNotFoundException":
        return { code: "USER_NOT_FOUND", message: "Người dùng không tồn tại" };
      case "NotAuthorizedException":
        return {
          code: "INVALID_CREDENTIALS",
          message: "Email hoặc mật khẩu không đúng",
        };
      case "UserNotConfirmedException":
        return {
          code: "USER_NOT_CONFIRMED",
          message: "Tài khoản chưa được xác thực",
        };
      case "UsernameExistsException":
        return { code: "USER_EXISTS", message: "Tài khoản đã tồn tại" };
      case "InvalidPasswordException":
        return {
          code: "INVALID_PASSWORD",
          message: "Mật khẩu không đúng định dạng",
        };
      case "CodeMismatchException":
        return { code: "INVALID_CODE", message: "Mã xác thực không đúng" };
      case "ExpiredCodeException":
        return { code: "EXPIRED_CODE", message: "Mã xác thực đã hết hạn" };
      case "LimitExceededException":
        return { code: "LIMIT_EXCEEDED", message: "Vượt quá giới hạn yêu cầu" };
      default:
        return {
          code: "UNKNOWN_ERROR",
          message: "Có lỗi xảy ra, vui lòng thử lại",
        };
    }
  }
}

export default new AuthService();
