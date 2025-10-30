"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

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

  // Layout wrapper
  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      {children}
    </div>
  );

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-amber-50 px-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl w-full">
        {/* Side illustration */}
        <div className="hidden md:block">
          <div className="relative h-72 w-full">
            <Image src="/LogoRMBG.png" alt="SVH Events" fill className="object-contain opacity-90" />
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">SVH Events</h2>
          <p className="text-gray-600">Cổng sự kiện sinh viên, tích điểm – đổi quà – kết nối.</p>
        </div>

        {/* Auth card */}
        <Card>
          <div className="text-center mb-6">
            <h1 className="text-3xl font-extrabold text-gray-800 mb-1">Đăng nhập</h1>
            <p className="text-gray-600 text-sm">Tiếp tục để quản lý sự kiện và tích điểm</p>
          </div>

          {auth.error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded">
              {auth.error.message || "Có lỗi xảy ra khi đăng nhập"}
            </div>
          )}

          <Button
            onClick={handleLogin}
            size="lg"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
            disabled={auth.isLoading}
          >
            {auth.isLoading ? "Đang đăng nhập..." : "Đăng nhập với tài khoản trường"}
          </Button>

          <div className="mt-6 text-center text-sm text-gray-500">
            <span>Bằng việc tiếp tục, bạn đồng ý với </span>
            <Link href="#" className="text-orange-600 hover:underline">Điều khoản</Link>
            <span> và </span>
            <Link href="#" className="text-orange-600 hover:underline">Chính sách</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
