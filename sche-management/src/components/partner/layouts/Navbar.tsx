"use client";

import Image from "next/image";
import Link from "next/link";
import { useAuth } from "react-oidc-context";
import { cognitoDomain } from "@/config/oidc-config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PartnerNavbar() {
  const auth = useAuth();
  const displayName = (auth.user?.profile as any)?.name || (auth.user?.profile as any)?.email || "Partner";
  const letter = String(displayName || "P").charAt(0).toUpperCase();

  const handleLogout = async () => {
    const base = typeof window !== "undefined" ? window.location.origin : "";
    const redirectUri = `${base}/`;

    const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string;
    const authority = process.env.NEXT_PUBLIC_COGNITO_AUTHORITY as string;
    const storageKey = `oidc.user:${authority}:${clientId}`;
    const userJson = (typeof window !== "undefined" && localStorage.getItem(storageKey)) || "{}";
    const idToken = (() => {
      try { return JSON.parse(userJson)?.id_token || ""; } catch { return ""; }
    })();

    try { await auth.removeUser(); } catch {}

    const url = `${cognitoDomain}/logout?client_id=${encodeURIComponent(clientId)}&logout_uri=${encodeURIComponent(redirectUri)}${idToken ? `&id_token_hint=${encodeURIComponent(idToken)}` : ""}`;
    window.location.href = url;
  };

  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center gap-3">
        <Image src="/LogoRMBG.png" alt="Logo" width={40} height={40} />
        <h1 className="text-xl font-bold text-gray-800">Partner Panel</h1>
      </div>
      <nav className="flex items-center gap-4 text-sm">
        {/* Avatar + menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-orange-50">
              <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {letter}
              </span>
              <span className="hidden md:inline text-sm font-medium text-gray-800">{displayName}</span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel className="text-gray-700">{displayName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/partner/profile">Trang cá nhân</Link>
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
      </nav>
    </header>
  );
}


