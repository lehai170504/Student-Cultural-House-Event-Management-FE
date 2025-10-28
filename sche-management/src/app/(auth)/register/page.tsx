"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  return (
    <main className="flex mt-30 items-center bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <div className="container mx-auto w-full px-4 sm:px-6 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* Visual / marketing panel */}
          <div className="hidden md:flex flex-col gap-6">
            <div className="inline-flex items-center gap-2 text-orange-600 font-semibold">
              <span className="text-2xl">🎉</span>
              <span>Nhà Văn Hóa Sinh Viên</span>
            </div>
            <h2 className="text-4xl font-extrabold leading-tight text-gray-900">
              Tham gia cộng đồng NVH
            </h2>
            <p className="text-gray-600 text-lg max-w-md">
              Đăng ký nhanh bằng Google để theo dõi sự kiện và đổi quà.
            </p>
            <div className="rounded-3xl border border-orange-100 bg-white/70 backdrop-blur p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">✨</div>
                <div>
                  <p className="font-semibold text-gray-800">Bắt đầu trong vài giây</p>
                  <p className="text-sm text-gray-500">Không cần tạo mật khẩu</p>
                </div>
              </div>
            </div>
          </div>

          {/* Register with Google */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-100">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                Đăng ký
              </h1>
              <p className="text-sm text-gray-600 mb-6">
                Tạo tài khoản bằng Google để bắt đầu 🎈
              </p>

              <Button
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-3"
              >
                <FcGoogle className="text-2xl" />
                <span>Đăng ký với Google</span>
              </Button>

              <p className="text-center text-xs text-gray-500 mt-4">
                Sử dụng tài khoản Google của bạn để tiếp tục.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
