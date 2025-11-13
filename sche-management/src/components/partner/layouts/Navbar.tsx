"use client";

import Image from "next/image";
import Link from "next/link";
// 🌟 Import các Icons cần thiết
import { Bell, Search, UserCircle, LogOut, Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Sheet, // 🌟 Import Sheet
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { cognitoDomain } from "@/config/oidc-config";

// 🌟 Import component nội dung Profile Partner
import PartnerProfileSheetContent from "@/components/partner/profile/PartnerProfileSheetContent";

export default function PartnerNavbar() {
  const { user, isLoading } = useUserProfile();

  const handleLogout = async () => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUri = `${base}/`;
    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string;
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
      window.localStorage.removeItem(storageKey);
    } catch {}

    const url = `${cognitoDomain}/logout?client_id=${encodeURIComponent(
      clientId
    )}&logout_uri=${encodeURIComponent(redirectUri)}${
      idToken ? `&id_token_hint=${encodeURIComponent(idToken)}` : ""
    }`;
    window.location.href = url;
  };

  return (
    // 🌟 Thay đổi: Nền trắng tuyệt đối, shadow nhẹ hơn
    <header className="w-full sticky top-0 z-50 bg-white border-b shadow-sm transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-8 h-16 md:h-20">
        {/* 1. Logo + Title */}
        <div className="flex items-center gap-2 md:gap-4 ml-0">
          <div className="flex-shrink-0">
            <Image
              src="/LogoRMBG.png"
              alt="Logo"
              width={50} // 🌟 Giảm kích thước logo để phù hợp navbar
              height={50}
              className="object-contain hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-800 leading-none">
              Partner Panel
            </h1>
            <h2 className="text-sm md:text-base font-semibold text-orange-600">
              Management
            </h2>
          </div>
        </div>

        {/* 2. Notification + User Actions */}
        <div className="flex items-center gap-2 md:gap-4">
          {/* 🌟 Nút Thông báo (Bổ sung nếu cần) */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full text-gray-600 hover:bg-orange-50 transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-0 right-0 h-3 w-3 rounded-full bg-red-500 border border-white"></span>
          </Button>

          {/* User Dropdown MENU */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 pl-2 pr-3 py-2 hover:bg-orange-50 rounded-full transition-all duration-200"
              >
                <img
                  src={
                    !isLoading && user?.avatar
                      ? user.avatar
                      : "https://i.pravatar.cc/40"
                  }
                  alt="avatar"
                  className="w-9 h-9 rounded-full border-2 border-orange-400 object-cover shadow-md"
                />
                <span className="hidden md:inline text-gray-700 font-medium text-base">
                  {!isLoading && user?.fullName ? user.fullName : "Partner"}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 bg-white shadow-xl rounded-lg border border-gray-100 p-1"
              align="end"
              sideOffset={10}
            >
              {/* Thông tin User Top */}
              <div className="px-3 py-2 mb-1 border-b border-gray-100">
                <p className="font-semibold text-gray-800">
                  {!isLoading && user?.fullName ? user.fullName : "Partner"}
                </p>
                <p className="text-sm text-gray-500 truncate">
                  {!isLoading && user?.email ? user.email : "Loading..."}
                </p>
              </div>

              {/* 🌟 MỤC MỚI: Xem Profile (Sheet Trigger) */}
              <Sheet>
                <DropdownMenuItem
                  asChild
                  onSelect={(e) => e.preventDefault()}
                  className="p-0"
                >
                  <SheetTrigger className="flex items-center w-full px-3 py-2 text-sm cursor-pointer text-gray-700 hover:bg-orange-50 rounded-md transition-colors">
                    <UserCircle className="w-4 h-4 mr-2 text-indigo-500" />
                    Xem Profile
                  </SheetTrigger>
                </DropdownMenuItem>

                <SheetContent side="right" className="w-full sm:max-w-md p-0">
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle className="text-xl font-bold text-gray-800">
                      Hồ sơ Đối tác
                    </SheetTitle>
                  </SheetHeader>
                  {/* 🌟 Nhúng component nội dung */}
                  <PartnerProfileSheetContent />
                </SheetContent>
              </Sheet>

              {/* Trang Chủ */}
              <DropdownMenuItem asChild className="p-0">
                <Link
                  href="/"
                  className="w-full flex items-center px-3 py-2 text-gray-700 hover:bg-orange-50 rounded-md transition-colors"
                >
                  <Home className="w-4 h-4 mr-2 text-gray-500" />
                  <span>Trang Chủ</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="my-1 border-gray-200" />

              {/* Đăng xuất */}
              <DropdownMenuItem
                className="text-red-600 focus:text-white hover:bg-red-500 focus:bg-red-600 rounded-md transition-colors flex items-center px-3 py-2"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
