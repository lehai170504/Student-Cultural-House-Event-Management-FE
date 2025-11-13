"use client";

import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Calendar,
  Users,
  Settings,
  Bell,
  BarChart3,
  Gift,
  MessageCircle,
  Receipt,
  // UserCircle, // Đã có trong các file trước
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import AdminProfileSheetContent from "@/components/admin/profile/AdminProfileSheet";

const menuSections = [
  {
    title: "Quản lý",
    items: [
      { label: "Doanh thu", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Sự kiện", href: "/admin/events", icon: Calendar },
      { label: "Người dùng", href: "/admin/users", icon: Users },
      { label: "Quà tặng", href: "/admin/product", icon: Gift },
      { label: "Đánh giá", href: "/admin/feedback", icon: MessageCircle },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      {
        label: "Quản lý Đổi quà",
        href: "/admin/invoice",
        icon: Receipt,
      },
      {
        label: "Giao dịch ví",
        href: "/admin/transactions",
        icon: BarChart3,
      },
      { label: "Cài đặt", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useUserProfile();

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="border-r bg-white/90 backdrop-blur-sm shadow-lg w-64"
      >
        {/* Header với avatar + info - DÙNG SHEET TRIGGER */}
        <SidebarHeader className="border-b px-4 py-4">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="flex items-center gap-3 w-full hover:bg-orange-50 p-2 rounded-lg transition-all duration-200 text-left"
                aria-label="Xem hồ sơ Admin"
              >
                <Avatar className="w-10 h-10 border border-orange-200 shadow-sm flex-shrink-0">
                  <AvatarImage
                    src={
                      !isLoading && user?.avatar
                        ? user.avatar
                        : "https://i.pravatar.cc/100"
                    }
                  />
                  <AvatarFallback>
                    {!isLoading && user?.fullName
                      ? user.fullName.charAt(0)
                      : "A"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block truncate">
                  <p className="text-sm font-semibold text-gray-800 hover:text-orange-600 transition-colors truncate">
                    {!isLoading && user?.fullName ? user.fullName : "Admin"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {!isLoading && user?.email ? user.email : "Administrator"}
                  </p>
                </div>
              </button>
            </SheetTrigger>

            {/* CONTENT CỦA SHEET */}
            <SheetContent side="right" className="w-full sm:max-w-md p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-xl font-bold text-gray-800">
                  Hồ sơ Quản trị viên
                </SheetTitle>
              </SheetHeader>
              <AdminProfileSheetContent />
            </SheetContent>
          </Sheet>
        </SidebarHeader>

        {/* Menu */}
        <SidebarContent className="mt-2 px-2">
          {menuSections.map((section) => (
            <div key={section.title} className="mb-4">
              <p className="px-3 mb-2 text-xs font-semibold uppercase tracking-wide text-gray-400">
                {section.title}
              </p>
              <SidebarMenu>
                {section.items.map((item) => {
                  const isActive = pathname.startsWith(item.href);
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton asChild>
                        <Link
                          href={item.href}
                          className={clsx(
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-300",
                            "hover:bg-orange-50 hover:text-orange-600 hover:shadow-md",
                            isActive
                              ? "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-600 border-l-4 border-orange-500 shadow-inner"
                              : "text-gray-600"
                          )}
                        >
                          <item.icon
                            className={clsx(
                              "h-5 w-5 transition-colors duration-300",
                              isActive ? "text-orange-500" : "text-gray-400"
                            )}
                          />
                          <span>{item.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </div>
          ))}
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
