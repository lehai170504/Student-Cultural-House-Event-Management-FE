"use client";

import { useState, useEffect } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import cognitoUserAttributesService from "@/features/auth/services/cognitoUserAttributesService";
import { studentService } from "@/features/students/services/studentService";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { useUniversities } from "@/features/universities/hooks/useUniversities";

export default function ProfileCompletionPage() {
  const auth = useAuth();
  const router = useRouter();

  const [userType, setUserType] = useState<string>("");
  const [university, setUniversity] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const { list: universitiesFromRedux = [], loadingList: universitiesLoading } =
    useUniversities();

  // Validate university format
  const validateUniversity = (value: string): boolean => {
    if (!value) return true; // Empty is ok if user_type is not student
    return value.toLowerCase().startsWith("trường");
  };

  // Form validation
  const isFormValid = (): boolean => {
    if (!userType) return false;
    if (userType === "sinh viên" && !university) return false;
    if (userType === "sinh viên" && !validateUniversity(university))
      return false;
    if (!phoneNumber.trim()) return false; // PhoneNumber là bắt buộc
    // avatarUrl là optional, không cần validate
    return true;
  };

  // Check authentication
  useEffect(() => {
    const checkAuth = async () => {
      setCheckingAuth(true);

      if (!auth.isLoading) {
        if (!auth.isAuthenticated || !auth.user) {
          // Not authenticated, redirect to login
          router.push("/login");
          return;
        }

        // Check if user already completed onboarding (to prevent loop)
        try {
          if (!auth.user.id_token) {
            router.push("/login");
            return;
          }

          const attributes =
            await cognitoUserAttributesService.fetchUserAttributes(
              auth.user.id_token
            );

          if (cognitoUserAttributesService.hasCompletedOnboarding(attributes)) {
            // Already completed, redirect to home
            router.push("/");
            return;
          }
        } catch (error) {
          console.error("Error checking onboarding status:", error);
          // Continue anyway
        }
      }

      setCheckingAuth(false);
    };

    checkAuth();
  }, [auth.isLoading, auth.isAuthenticated, auth.user, router]);

  // Không cần fetch thủ công: useUniversities tự load khi mount và lưu Redux

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!isFormValid()) {
      setError("Vui lòng điền đầy đủ thông tin");
      return;
    }

    if (!auth.user?.access_token || !auth.user?.id_token) {
      setError("Không có thông tin đăng nhập. Vui lòng đăng nhập lại.");
      return;
    }

    setIsLoading(true);

    try {
      // Prepare attributes to update
      const attributesToUpdate: Record<string, string> = {
        "custom:user_type": userType,
      };

      // Add university if user is a student
      if (userType === "sinh viên") {
        // Ensure university starts with "Trường" (capitalized)
        const universityValue = university.trim();
        if (!universityValue.toLowerCase().startsWith("trường")) {
          attributesToUpdate["custom:university"] = `Trường ${universityValue}`;
        } else {
          // Capitalize the T in "Trường"
          attributesToUpdate[
            "custom:university"
          ] = `Trường ${universityValue.substring(7)}`;
        }
      }

      // Bước 1: Update attributes trong Cognito (user_type, university) - chỉ 2 cái này gửi về Cognito
      await cognitoUserAttributesService.updateUserAttributes(
        auth.user.access_token,
        attributesToUpdate
      );

      // Bước 2: Gọi API complete-profile để lưu phoneNumber và avatarUrl vào BE (cho cả sinh viên và người ngoài)
      try {
        await studentService.completeProfile({
          phoneNumber: phoneNumber.trim(),
          avatarUrl: avatarUrl.trim() || "", // Avatar có thể để trống
        });
      } catch (apiError: any) {
        console.error("Error completing profile on backend:", apiError);
        // Nếu API fail nhưng Cognito đã update, vẫn tiếp tục
        // User có thể complete profile sau ở trang profile
        if (apiError?.response?.status !== 201) {
          console.warn("Backend profile completion failed, but Cognito updated successfully");
        }
      }

      setSuccess(true);

      // Bước 3: Sau khi update attributes, token hiện tại không có custom attributes mới
      // Cần refresh token để lấy token mới có custom attributes
      // Thử silent refresh trước, nếu không được thì redirect
      try {
        // Thử silent refresh token (không yêu cầu user login lại)
        await auth.signinSilent();
        
        // Nếu silent refresh thành công, redirect về home
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } catch (silentError) {
        console.warn("Silent refresh failed, redirecting to login:", silentError);
        // Nếu silent refresh không được (có thể do Cognito config), 
        // clear token và redirect về login để user login lại và lấy token mới
        const authority = process.env.NEXT_PUBLIC_COGNITO_AUTHORITY!;
        const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID!;
        const key = `oidc.user:${authority}:${clientId}`;
        
        if (typeof window !== "undefined") {
          localStorage.removeItem(key);
          sessionStorage.removeItem(key);
        }

        // Redirect về login để refresh token với attributes mới
        setTimeout(() => {
          auth.signinRedirect();
        }, 1500);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.");
      setIsLoading(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Đang kiểm tra...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        {/* Header */}
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Hoàn tất hồ sơ
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Vui lòng điền thông tin để tiếp tục sử dụng hệ thống
          </p>
        </div>

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* User Type */}
          <div>
            <Label
              htmlFor="user_type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Loại người dùng <span className="text-red-500">*</span>
            </Label>
            <Select value={userType} onValueChange={setUserType} required>
              <SelectTrigger
                className="w-full"
                aria-invalid={!userType && error ? true : undefined}
              >
                <SelectValue placeholder="Chọn loại người dùng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sinh viên">Sinh viên</SelectItem>
                <SelectItem value="người ngoài">Người ngoài</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* University (only show if user is a student) */}
          {userType === "sinh viên" && (
            <div>
              <Label
                htmlFor="university"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tên trường Đại học <span className="text-red-500">*</span>
              </Label>
              <Select
                value={university}
                onValueChange={setUniversity}
                required
                disabled={universitiesLoading}
              >
                <SelectTrigger className="w-full">
                  <SelectValue
                    placeholder={
                      universitiesLoading
                        ? "Đang tải danh sách trường..."
                        : "Chọn trường Đại học"
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {universitiesFromRedux.map((u: any) => {
                    const name = (u?.name ?? "").toString();
                    const id = Number(u?.id ?? 0);
                    return (
                      <SelectItem key={id} value={name}>
                        {name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Phone Number (required for all users) */}
          <div>
            <Label
              htmlFor="phoneNumber"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Số điện thoại <span className="text-red-500">*</span>
            </Label>
            <Input
              id="phoneNumber"
              type="tel"
              placeholder="Nhập số điện thoại (ví dụ: 0912345678)"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
              className="w-full"
            />
          </div>

          {/* Avatar URL (optional for all users) */}
          <div>
            <Label
              htmlFor="avatarUrl"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              URL Ảnh đại diện <span className="text-gray-500 text-xs">(Tùy chọn)</span>
            </Label>
            <Input
              id="avatarUrl"
              type="url"
              placeholder="Nhập URL ảnh đại diện (ví dụ: https://example.com/avatar.jpg) - Có thể để trống"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center gap-2 text-red-800">
              <AlertCircle className="h-5 w-5" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="bg-green-50 border border-green-200 rounded-md p-3 flex items-center gap-2 text-green-800">
              <CheckCircle2 className="h-5 w-5" />
              <p className="text-sm">
                Cập nhật thông tin thành công! Đang chuyển hướng...
              </p>
            </div>
          )}

          {/* Submit button */}
          <div>
            <Button
              type="submit"
              disabled={!isFormValid() || isLoading || success}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang cập nhật...
                </>
              ) : (
                "Hoàn tất"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
