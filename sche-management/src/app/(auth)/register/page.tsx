"use client";

import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 border border-gray-100">
      <h1 className="text-3xl font-bold text-center text-orange-500 mb-6">
        Đăng nhập
      </h1>

      {/* --- Google login button --- */}
      <Button
        type="button"
        className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white py-3 rounded-lg shadow-md hover:bg-gray-50 transition"
      >
        <FcGoogle className="text-2xl" />
        <span className="text-gray-700 font-medium">Đăng nhập với Google</span>
      </Button>

      {/* --- Footer --- */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Chưa có tài khoản?{" "}
        <a
          href="register"
          className="text-orange-500 font-medium hover:underline"
        >
          Đăng ký
        </a>
      </p>
    </div>
  );
}
