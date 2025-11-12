"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { cognitoDomain } from "@/config/oidc-config";

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
    <header className="w-full sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b shadow-md transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 md:px-6 h-20">
        {/* Logo + Title */}
        <div className="flex items-center gap-5">
          <div className="flex-shrink-0">
            <Image
              src="/LogoRMBG.png"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain hover:scale-110 transition-transform duration-300"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-2xl md:text-3xl font-extrabold text-orange-600 leading-tight">
              Partner Panel
            </h1>
            <h2 className="text-lg md:text-xl font-semibold text-gray-700">
              Management
            </h2>
          </div>
        </div>

        {/* Search */}
        <div className="hidden md:flex items-center relative w-1/3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-orange-400 h-5 w-5" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            className="pl-10 pr-3 py-2 w-full rounded-lg bg-orange-50 border border-orange-200 focus:border-orange-500 focus:ring focus:ring-orange-200 focus:ring-opacity-50 shadow-sm transition-all duration-300"
          />
        </div>

        {/* Notification + User */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <Button
            variant="ghost"
            size="icon"
            className="relative rounded-full hover:bg-orange-100 transition-all duration-200"
          >
            <Bell className="h-5 w-5 text-orange-500" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-md">
              3
            </span>
          </Button>

          {/* User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 px-3 py-2 hover:bg-orange-50 rounded-lg transition-all duration-200"
              >
                <img
                  src={
                    !isLoading && user?.avatar
                      ? user.avatar
                      : "https://i.pravatar.cc/40"
                  }
                  alt="avatar"
                  className="w-8 h-8 rounded-full border border-orange-200 shadow-sm"
                />
                <span className="hidden sm:inline text-gray-700 font-medium">
                  {!isLoading && user?.fullName ? user.fullName : "Partner"}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-48 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg border border-orange-100"
              align="end"
              sideOffset={8}
            >
              <DropdownMenuItem asChild>
                <Link href="/partner/profile" className="w-full">
                  Xem Profile
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link href="/" className="w-full">
                  Trang Chủ
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="border-orange-100" />

              <DropdownMenuItem
                className="text-red-600 hover:bg-red-50 focus:bg-red-50 rounded-md transition-colors"
                onClick={handleLogout}
              >
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
