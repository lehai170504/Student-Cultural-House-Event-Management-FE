"use client";

import { useAuth } from "react-oidc-context";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const auth = useAuth();

  const handleLogin = () => {
    auth.signinRedirect();
  };

  const Card = ({ children }: { children: React.ReactNode }) => (
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
      {children}
    </div>
  );

  // ✅ Nếu đang login (sau khi redirect về callback), show spinner
  if (auth.isLoading) {
    return (
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-orange-500 mx-auto mb-4" />
        <p className="text-gray-600">Đang xử lý đăng nhập...</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center max-w-5xl w-full mx-auto p-6">
      {/* --- Hình minh họa --- */}
      <div className="hidden md:block text-center">
        <div className="relative h-72 w-full">
          <Image
            src="/LogoRMBG.png"
            alt="SVH Events"
            fill
            className="object-contain opacity-90"
          />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-gray-800">SVH Events</h2>
        <p className="text-gray-600">
          Cổng sự kiện sinh viên – tích điểm, đổi quà, kết nối cộng đồng.
        </p>
      </div>

      {/* --- Form login --- */}
      <Card>
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-1">
            Đăng nhập
          </h1>
          <p className="text-gray-600 text-sm">
            Tiếp tục để quản lý sự kiện và tích điểm
          </p>
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
          Đăng nhập với tài khoản trường
        </Button>

        <div className="mt-6 text-center text-sm text-gray-500">
          <span>Bằng việc tiếp tục, bạn đồng ý với </span>
          <Link href="#" className="text-orange-600 hover:underline">
            Điều khoản
          </Link>
          <span> và </span>
          <Link href="#" className="text-orange-600 hover:underline">
            Chính sách bảo mật
          </Link>
        </div>
      </Card>
    </div>
  );
}
