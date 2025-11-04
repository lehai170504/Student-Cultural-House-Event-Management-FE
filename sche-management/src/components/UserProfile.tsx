"use client";

import { useAuth } from "react-oidc-context";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { User as UserIcon, CreditCard, LogOut, CalendarDays } from "lucide-react";

export function UserProfile() {
  const auth = useAuth();

  if (!auth.isAuthenticated || !auth.user) {
    return null;
  }

  const handleLogout = () => {
    // Show toast
    toast.success("Đang đăng xuất...", {
      description: "Hẹn gặp lại bạn!",
    });
    
    // Small delay to show toast before redirect
    setTimeout(() => {
      // Redirect to Cognito logout
      const cognitoDomain = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || 'https://ap-southeast-29rljnqhok.auth.ap-southeast-2.amazoncognito.com';
      const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '6rer5strq9ga876qntv37ngv6d';
      const baseUri = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
      const logoutUri = baseUri + '/';
      const logoutUrl = `${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${encodeURIComponent(logoutUri)}`;
      // Clear local auth state first
      auth.removeUser();
      // Redirect
      window.location.href = logoutUrl;
    }, 100);
  };

  const avatarLetter = auth.user.profile?.name?.[0] || auth.user.profile?.email?.[0] || "U";
  const displayName = auth.user.profile?.name || auth.user.profile?.email || "User";
  const groupsFromProfile = (auth.user?.profile?.["cognito:groups"] as unknown) as string[] | undefined;
  const groups = Array.isArray(groupsFromProfile) ? groupsFromProfile : [];
  const isAdmin = groups.includes("Admin");
  const isPartners = groups.includes("PARTNERS");
  const profileHref = isAdmin ? "/admin/profile" : "/profile";


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-2 rounded-full border px-2 py-1 hover:bg-orange-50">
          <span className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
            {avatarLetter}
          </span>
          <span className="hidden md:inline text-sm font-medium text-gray-800">{displayName}</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="text-gray-700">
          {displayName}
          <div className="text-xs text-gray-500">{auth.user.profile?.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {isAdmin ? (
          <DropdownMenuItem asChild>
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        ) : isPartners ? (
          <DropdownMenuItem asChild>
            <Link href="/organizer/events" className="flex items-center gap-2">
              <UserIcon className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
        ) : (
          <>
            <DropdownMenuItem asChild>
              <Link href="/students/profile" className="flex items-center gap-2">
                <UserIcon className="h-4 w-4" />
                <span>Hồ sơ</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/card" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span>Thẻ ảo</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/students/my-events" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>Lịch sử sự kiện</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-700 flex items-center gap-2">
          <LogOut className="h-4 w-4" />
          <span>Đăng xuất</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}