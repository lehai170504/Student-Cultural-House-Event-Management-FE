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
  FileSearch,
  BarChart3,
  Ticket,
  Gift,
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const menuSections = [
  {
    title: "Quản lý",
    items: [
      { label: "Doanh thu", href: "/admin/dashboard", icon: LayoutDashboard },
      { label: "Sự kiện", href: "/admin/events", icon: Calendar },
      { label: "Người dùng", href: "/admin/users", icon: Users },
      { label: "Khuyến mãi", href: "/admin/vouchers", icon: Ticket },
      { label: "Quà tặng", href: "/admin/product", icon: Gift },
    ],
  },
  {
    title: "Hệ thống",
    items: [
      { label: "Theo dõi", href: "/admin/audit", icon: FileSearch },
      { label: "Thông báo", href: "/admin/notifications", icon: Bell },
      { label: "Báo cáo", href: "/admin/reports", icon: BarChart3 },
      { label: "Cài đặt", href: "/admin/settings", icon: Settings },
    ],
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r bg-white shadow-sm">
        {/* Header với avatar + admin info */}
        <SidebarHeader className="border-b px-4 py-4">
          <Link
            href="/admin/profile"
            className="flex items-center gap-3 hover:bg-orange-50 p-2 rounded-lg transition-colors"
          >
            <Avatar className="w-10 h-10 border">
              <AvatarImage src="https://i.pravatar.cc/100?img=12" />
              <AvatarFallback>A</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-gray-800">
                Nguyễn Admin
              </p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
          </Link>
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
                            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                            "hover:bg-orange-50 hover:text-orange-600",
                            isActive
                              ? "bg-gradient-to-r from-orange-100 to-orange-50 text-orange-600 border-l-4 border-orange-500"
                              : "text-gray-600"
                          )}
                        >
                          <item.icon className="h-5 w-5" />
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
