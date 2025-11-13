"use client";

import {
  Sidebar,
  SidebarProvider,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Calendar, Bell, Wallet, Receipt } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
// 🌟 IMPORTS SHEET MỚI
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// 🌟 Import component nội dung profile Partner
import PartnerProfileSheetContent from "@/components/partner/profile/PartnerProfileSheetContent";

const menuSections = [
  {
    title: "Quản lý",
    items: [
      { label: "Sự kiện", href: "/partner/events", icon: Calendar },
      { label: "Ví", href: "/partner/wallet", icon: Wallet },
      { label: "Tạo thông báo", href: "/partner/notifications", icon: Bell },
      { label: "Quản lí đổi quà", href: "/partner/invoice", icon: Receipt },
    ],
  },
];

export default function PartnerSidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useUserProfile();

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        className="border-r bg-white/90 backdrop-blur-sm shadow-lg w-64"
      >
        {/* Header với avatar + info - 🌟 SỬ DỤNG SHEET TRIGGER */}
        <SidebarHeader className="border-b px-4 py-4">
          <Sheet>
            <SheetTrigger asChild>
              <button
                className="flex items-center gap-3 w-full hover:bg-orange-50 p-2 rounded-lg transition-all duration-200 text-left"
                aria-label="Xem hồ sơ Partner"
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
                      : "P"}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden sm:block truncate">
                  <p className="text-sm font-semibold text-gray-800 hover:text-orange-600 transition-colors truncate">
                    {!isLoading && user?.fullName ? user.fullName : "Partner"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {!isLoading && user?.email ? user.email : "Partner Email"}
                  </p>
                </div>
              </button>
            </SheetTrigger>

            {/* CONTENT CỦA SHEET */}
            <SheetContent side="right" className="w-full sm:max-w-md p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-xl font-bold text-gray-800">
                  Hồ sơ Đối tác
                </SheetTitle>
              </SheetHeader>
              {/* 🌟 Nhúng component nội dung Partner Profile */}
              <PartnerProfileSheetContent />
            </SheetContent>
          </Sheet>
        </SidebarHeader>

        {/* Menu (Giữ nguyên) */}
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
