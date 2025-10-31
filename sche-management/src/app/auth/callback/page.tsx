"use client";

import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
// @ts-ignore - UI toast lib may not have types in this env
import { toast } from "sonner"; 
import cognitoUserAttributesService from "@/features/auth/services/cognitoUserAttributesService";

export default function AuthCallback() {
  const auth = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    const handleCallback = async () => {
      if (auth.isLoading) return;

      if (!auth.isAuthenticated) {
        setStatus("redirecting-login");
        toast.error("Phiên đăng nhập không hợp lệ. Vui lòng thử lại.");
        router.push("/login");
        return;
      }

      try {
        setStatus("reading-profile");

        let role: string | null = null;

        // ✅ 1️⃣ Lấy dữ liệu OIDC từ sessionStorage
        const storedKeys = Object.keys(sessionStorage).filter((k) =>
          k.startsWith("oidc.user:")
        );

        if (storedKeys.length > 0) {
          const data = JSON.parse(
            sessionStorage.getItem(storedKeys[0]) || "{}"
          );
          role = data?.profile?.["cognito:groups"]?.[0] || null;
        }

        // ✅ 2️⃣ Fallback sang auth.user.profile
        if (!role && auth.user?.profile) {
          const profile = auth.user.profile as Record<string, any>;
          role = profile?.["cognito:groups"]?.[0] || null;
        }

        // ✅ 3️⃣ Kiểm tra lần đầu đăng nhập: nếu chưa đủ hồ sơ → đưa đi onboarding
        try {
          const idToken = auth.user?.id_token;
          if (idToken) {
            const attributes =
              await cognitoUserAttributesService.fetchUserAttributes(idToken);
            const needs = cognitoUserAttributesService.needsOnboarding(attributes);
            if (needs) {
              setStatus("redirecting");
              router.push("/onboarding/profile-completion");
              return; 
            }
          }
        } catch (err) {
          
          console.warn("Skip onboarding check due to error:", err);
        }

        // ✅ 4️⃣ Thông báo & chuyển hướng theo role
        setStatus("redirecting");

        toast.success("Đăng nhập thành công 🎉", {
          description: "Chào mừng bạn quay lại hệ thống!",
          duration: 2500,
          position: "top-right",
          className:
            "border border-green-200 bg-green-50 text-green-800 dark:bg-green-950 dark:text-green-100 shadow-lg",
        });

        if (role === "Admin") {
          router.push("/admin/dashboard");
        } else if (role === "PARTNER" || role === "PARTNERS") {
          router.push("/partner/events");
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Error during callback:", error);
        toast.error("Có lỗi xảy ra khi xử lý đăng nhập.");
        setStatus("redirecting-login");
        router.push("/login");
      }
    };

    handleCallback();
  }, [auth.isAuthenticated, auth.isLoading, auth.user, router]);

  const statusMessages: Record<string, string> = {
    checking: "Đang kiểm tra đăng nhập...",
    "reading-profile": "Đang đọc thông tin tài khoản...",
    redirecting: "Đang chuyển hướng...",
    "redirecting-login": "Đang quay lại trang đăng nhập...",
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Loader2 className="h-12 w-12 animate-spin text-orange-500 mx-auto mb-4" />
        <p className="text-gray-600">{statusMessages[status]}</p>
      </div>
    </div>
  );
}
