"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import Image from "next/image";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-orange-100 via-white to-orange-50 p-6 text-center">
      <div className="max-w-md space-y-6 bg-white shadow-lg rounded-2xl p-8 border border-orange-100">
        <Image
          src="/LogoRMBG.png"
          alt="Logo"
          width={80}
          height={80}
          className="mx-auto object-contain"
        />
        <div className="flex justify-center">
          <ShieldAlert className="w-16 h-16 text-orange-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Không có quyền truy cập</h1>
        <p className="text-gray-500 text-lg">
          Bạn không có quyền truy cập vào trang này.  
          Vui lòng đăng nhập bằng tài khoản được cấp quyền hợp lệ.
        </p>

        <div className="flex justify-center gap-3 mt-6">
          <Button
            asChild
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-lg px-6 py-3"
          >
            <Link href="/login">Đăng nhập lại</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="border-orange-500 text-orange-600 hover:bg-orange-50 px-6 py-3"
          >
            <Link href="/">Về trang chủ</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
