"use client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Search } from "lucide-react";
import Image from "next/image";
import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import { cognitoDomain } from "@/config/oidc-config";

export default function Navbar() {
  const auth = useAuth();

  const handleLogout = async () => {
    // Show toast
    toast.success("Đang đăng xuất...", {
      description: "Hẹn gặp lại bạn!",
    });
    
    // Small delay to show toast before redirect
    setTimeout(async () => {
      const base = typeof window !== "undefined" ? window.location.origin : "";
      const redirectUri = `${base}/`;

    // Xây URL logout theo chuẩn Cognito Hosted UI
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string;
    // Lấy id_token hiện tại nếu còn để thêm id_token_hint (tuỳ chọn)
    const authority = process.env.NEXT_PUBLIC_COGNITO_AUTHORITY as string;
    const storageKey = `oidc.user:${authority}:${clientId}`;
    const userJson =
      (typeof window !== "undefined" && localStorage.getItem(storageKey)) ||
      "{}";
    const idToken = (() => {
      try {
        return JSON.parse(userJson)?.id_token || "";
      } catch {
        return "";
      }
    })();

    try {
      await auth.removeUser();
    } catch {}

    const url = `${cognitoDomain}/logout?client_id=${encodeURIComponent(
      clientId
    )}&logout_uri=${encodeURIComponent(redirectUri)}${
      idToken ? `&id_token_hint=${encodeURIComponent(idToken)}` : ""
    }`;
    window.location.href = url;
  };

  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      {/* Logo + Tiêu đề */}
      <div className="flex items-center gap-3">
        <Image
          src="/LogoRMBG.png"
          alt="Logo"
          width={40}
          height={40}
          className="object-contain hover:scale-105 transition-transform duration-300"
        />
        <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
      </div>

      {/* Thanh search */}
      <div className="hidden md:flex items-center w-1/3 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          type="text"
          placeholder="Tìm kiếm..."
          className="pl-9 pr-3 py-2 w-full rounded-lg bg-gray-50 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
        />
      </div>

      {/* Notify + User dropdown */}
      <div className="flex items-center gap-4">
        {/* Nút chuông thông báo */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-full hover:bg-orange-50"
        >
          <Bell className="h-5 w-5 text-gray-600" />
          {/* Badge số thông báo */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </Button>

        {/* Dropdown người dùng */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 px-3 py-2"
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="avatar"
                className="w-8 h-8 rounded-full"
              />
              <span className="hidden sm:inline text-gray-700 font-medium">
                Admin
              </span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent className="w-44" align="end" sideOffset={8}>
            <DropdownMenuItem asChild>
              <a href="/admin/profile" className="w-full">
                Xem Profile
              </a>
            </DropdownMenuItem>

            {/* Mục mới dẫn về trang chủ */}
            <DropdownMenuItem asChild>
              <a href="/" className="w-full">
                Trang Chủ
              </a>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              className="text-red-600 focus:bg-red-50"
              onClick={handleLogout}
            >
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
