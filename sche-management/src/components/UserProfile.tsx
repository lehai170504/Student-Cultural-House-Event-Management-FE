"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { studentService } from "@/features/students/services/studentService";
import type { StudentProfile } from "@/features/students/types/student";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import Link from "next/link";
import {
  User as UserIcon,
  CreditCard,
  LogOut,
  CalendarDays,
  Bell,
  Loader2,
} from "lucide-react";

export function UserProfile() {
  const auth = useAuth();
  const [studentProfile, setStudentProfile] = useState<StudentProfile | null>(null);

  if (!auth.isAuthenticated || !auth.user) {
    return null;
  }

  const groupsFromProfile = (auth.user?.profile?.["cognito:groups"] as unknown) as string[] | undefined;
  const groups = Array.isArray(groupsFromProfile) ? groupsFromProfile : [];
  const isAdmin = groups.includes("Admin");
  const isPartners = groups.includes("PARTNERS");
  const isStudent = !isAdmin && !isPartners;

  // Fetch student profile để lấy avatarUrl và listen realtime updates
  useEffect(() => {
    if (!isStudent || !auth.isAuthenticated) {
      return;
    }

    let isMounted = true;

    const fetchProfile = async () => {
      try {
        const profile = await studentService.getProfile();
        if (isMounted) {
          setStudentProfile(profile);
        }
      } catch (error) {
        // Silently fail - không hiển thị error vì có thể profile chưa được tạo
      }
    };

    fetchProfile();

    const handleProfileUpdated = (event: Event) => {
      const detail = (event as CustomEvent<StudentProfile | undefined>).detail;
      if (detail) {
        setStudentProfile(detail);
      } else {
        fetchProfile();
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener(
        "student-profile-updated",
        handleProfileUpdated as EventListener
      );
    }

    return () => {
      isMounted = false;
      if (typeof window !== "undefined") {
        window.removeEventListener(
          "student-profile-updated",
          handleProfileUpdated as EventListener
        );
      }
    };
  }, [isStudent, auth.isAuthenticated]);

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

  // Lấy avatar từ student profile nếu có, fallback về letter
  const avatarUrl = isStudent && studentProfile?.avatarUrl ? studentProfile.avatarUrl : null;
  const displayNameForAvatar = isStudent && studentProfile?.fullName 
    ? studentProfile.fullName 
    : auth.user.profile?.name || auth.user.profile?.email || "User";
  const avatarLetter = displayNameForAvatar[0]?.toUpperCase() || "U";
  const displayName = isStudent && studentProfile?.fullName 
    ? studentProfile.fullName 
    : auth.user.profile?.name || auth.user.profile?.email || "User";
  const profileHref = isAdmin ? "/admin/profile" : "/profile";


  return (
    <div className="flex items-center gap-3">
      {isStudent ? <StudentNotificationBell /> : null}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex cursor-pointer items-center gap-2 rounded-full border px-2 py-1 hover:bg-orange-50">
            <Avatar className="w-8 h-8 cursor-pointer">
              {avatarUrl ? <AvatarImage src={avatarUrl} alt={displayName} /> : null}
              <AvatarFallback className="bg-orange-500 text-white font-semibold text-sm">
                {avatarLetter}
              </AvatarFallback>
            </Avatar>
            <span className="hidden md:inline cursor-pointer text-sm font-medium text-gray-800">
              {displayName}
            </span>
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
    </div>
  );
}

function StudentNotificationBell() {
  const {
    notifications,
    loading,
    unreadCount,
    loadNotifications,
    setNotificationsRead,
  } = useNotifications();

  useEffect(() => {
    loadNotifications();

    const handler = () => loadNotifications();

    if (typeof window !== "undefined") {
      window.addEventListener("student-notification-updated", handler);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("student-notification-updated", handler);
      }
    };
  }, [loadNotifications]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full border bg-white text-gray-600 transition-colors hover:bg-orange-50 hover:text-orange-600"
          aria-label="Thông báo"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 ? (
            <span className="absolute -top-1 -right-1 min-w-[18px] rounded-full bg-red-500 px-1.5 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          ) : null}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold text-gray-800">Thông báo</p>
          <p className="text-xs text-gray-500">
            {unreadCount > 0
              ? `${unreadCount} thông báo mới`
              : "Không có thông báo mới"}
          </p>
        </div>
        <div className="max-h-64 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-6 text-sm text-gray-500">
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang tải...
            </div>
          ) : notifications.length === 0 ? (
            <div className="px-4 py-6 text-sm text-gray-500">
              Hiện chưa có thông báo nào cho bạn.
            </div>
          ) : (
            notifications.slice(0, 4).map((item) => (
              <div
                key={item.deliveryId}
                className="border-b px-4 py-3 last:border-b-0 hover:bg-orange-50"
              >
                <p
                  className={`text-sm font-semibold ${
                    (item.status || "").toUpperCase() === "UNREAD"
                      ? "text-orange-600"
                      : "text-gray-800"
                  }`}
                >
                  {item.eventTitle || "Thông báo"}
                </p>
                {item.messageContent ? (
                  <p className="mt-1 text-xs text-gray-600 whitespace-pre-line">
                    {item.messageContent}
                  </p>
                ) : null}
                <p className="mt-1 text-[11px] uppercase tracking-wide text-gray-400">
                  {item.sentAt
                    ? formatNotificationTime(item.sentAt)
                    : ""}
                </p>
                {(item.status || "").toUpperCase() === "UNREAD" ? (
                  <button
                    className="mt-2 text-xs text-orange-600 hover:text-orange-700"
                    onClick={() => setNotificationsRead([item.deliveryId])}
                  >
                    Đánh dấu đã đọc
                  </button>
                ) : null}
              </div>
            ))
          )}
        </div>
        <div className="border-t px-3 py-2 text-right">
          <Link
            href="/students/notifications"
            className="text-xs font-medium text-orange-600 hover:text-orange-700"
          >
            Xem tất cả
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function formatNotificationTime(value: string) {
  try {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return date.toLocaleString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return value;
  }
}