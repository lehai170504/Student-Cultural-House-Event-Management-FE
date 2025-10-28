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
import cognitoUserAttributesService from "@/services/cognitoUserAttributesService";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export default function ProfileCompletionPage() {
  const auth = useAuth();
  const router = useRouter();

  const [userType, setUserType] = useState<string>("");
  const [university, setUniversity] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Validate university format
  const validateUniversity = (value: string): boolean => {
    if (!value) return true; // Empty is ok if user_type is not student
    return value.toLowerCase().startsWith("trường");
  };

  // Form validation
  const isFormValid = (): boolean => {
    if (!userType) return false;
    if (userType === "sinh viên" && !university) return false;
    if (userType === "sinh viên" && !validateUniversity(university)) return false;
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
          
          const attributes = await cognitoUserAttributesService.fetchUserAttributes(auth.user.id_token);
          
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
          attributesToUpdate["custom:university"] = `Trường ${universityValue.substring(7)}`;
        }
      }

      // Update attributes in Cognito
      await cognitoUserAttributesService.updateUserAttributes(
        auth.user.access_token,
        attributesToUpdate
      );

      setSuccess(true);

      // Redirect to home after 1.5 seconds
      setTimeout(() => {
        router.push("/");
      }, 1500);
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
            <Label htmlFor="user_type" className="block text-sm font-medium text-gray-700 mb-2">
              Loại người dùng <span className="text-red-500">*</span>
            </Label>
            <Select value={userType} onValueChange={setUserType} required>
              <SelectTrigger className="w-full" aria-invalid={!userType && error ? true : undefined}>
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
              <Label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">
                Tên trường Đại học <span className="text-red-500">*</span>
              </Label>
              <Input
                id="university"
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="Ví dụ: Trường Đại Học FPT"
                className="w-full"
                aria-invalid={university && !validateUniversity(university) ? true : undefined}
                aria-describedby={university && !validateUniversity(university) ? "university-error" : undefined}
              />
              {university && !validateUniversity(university) && (
                <p id="university-error" className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Tên trường phải bắt đầu bằng &quot;Trường&quot;
                </p>
              )}
            </div>
          )}

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
              <p className="text-sm">Cập nhật thông tin thành công! Đang chuyển hướng...</p>
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
