"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100 transform transition-all hover:scale-[1.04] hover:shadow-2xl">
      {/* --- Title --- */}
      <h1 className="text-4xl font-extrabold text-center text-orange-500 mb-3 drop-shadow-sm">
        Xin chào 👋
      </h1>
      <p className="text-center text-gray-600 mb-6">
        Đăng nhập để bắt đầu hành trình của bạn!
      </p>

      {/* --- Google login button --- */}
      <Button
        variant="outline"
        size="lg"
        className="w-full flex items-center justify-center gap-3"
      >
        <FcGoogle className="text-2xl" />
        <span>Đăng nhập với Google</span>
      </Button>

      {/* --- Divider --- */}
      <div className="flex items-center my-6">
        <hr className="flex-grow border-gray-300" />
        <span className="px-3 text-sm text-gray-400">hoặc</span>
        <hr className="flex-grow border-gray-300" />
      </div>

      {/* --- Suggestion text --- */}
      <p className="text-center text-sm text-gray-500">
        Chưa có tài khoản?{" "}
        <a
          href="register"
          className="text-orange-500 font-semibold hover:underline hover:text-orange-600 transition"
        >
          Đăng ký ngay
        </a>
      </p>
    </div>
  );
}
