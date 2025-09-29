"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
 

export default function LoginPage() {
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
              Chào mừng trở lại
            </h2>
            <p className="text-gray-600 text-lg max-w-md">
              Đăng nhập để quản lý sự kiện, tích điểm và đổi quà nhanh chóng.
            </p>
            <div className="rounded-3xl border border-orange-100 bg-white/70 backdrop-blur p-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl">🏆</div>
                <div>
                  <p className="font-semibold text-gray-800">Tích lũy điểm thưởng</p>
                  <p className="text-sm text-gray-500">Tham gia sự kiện để nhận quà hấp dẫn</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form panel */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white shadow-xl rounded-2xl p-6 sm:p-8 border border-gray-100">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
                Đăng nhập
              </h1>
              <p className="text-sm text-gray-600 mb-6">
                Rất vui được gặp lại bạn 👋
              </p>

              {/* Google login button */}
              <Button
                variant="outline"
                size="lg"
                className="w-full flex items-center justify-center gap-3"
              >
                <FcGoogle className="text-2xl" />
                <span>Đăng nhập với Google</span>
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
