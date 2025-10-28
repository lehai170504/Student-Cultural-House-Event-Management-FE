"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import { AuthStatus } from "@/components/AuthStatus";

export default function LoginPage() {
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect to home if already authenticated
    if (auth.isAuthenticated) {
      router.push("/");
    }
  }, [auth.isAuthenticated, router]);

  const handleLogin = () => {
    auth.signinRedirect();
  };

  // Show loading state while checking authentication
  if (auth.isLoading) {
    return (
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang kiểm tra trạng thái đăng nhập...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100 transform transition-all hover:scale-[1.04] hover:shadow-2xl">
      {/* --- Auth Status Warning --- */}
      <AuthStatus />
      
      {/* --- Title --- */}
      <h1 className="text-4xl font-extrabold text-center text-orange-500 mb-3 drop-shadow-sm">
        Chào fen 👋
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Đăng nhập để bú hết các khuyến mãi nào!
      </p>

      {/* --- Error Message --- */}
      {auth.error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {auth.error.message || "Có lỗi xảy ra khi đăng nhập"}
        </div>
      )}

      {/* --- Login Button --- */}
      <Button
        onClick={handleLogin}
        size="lg"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        disabled={auth.isLoading}
      >
        {auth.isLoading ? "Đang đăng nhập..." : "Đăng nhập nào ní ơi"}
      </Button>

      {/* --- Info Text --- */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          Bạn sẽ được chuyển hướng đến trang đăng nhập của AE tui
        </p>
      </div>
    </div>
  );
}
