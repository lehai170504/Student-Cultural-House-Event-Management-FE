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
} from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const menuItems = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Events", href: "/admin/events", icon: Calendar },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Audit Log", href: "/admin/audit", icon: FileSearch },
  { label: "Notifications", href: "/admin/notifications", icon: Bell },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r bg-white shadow-sm">
        {/* Header */}
        <SidebarHeader className="border-b px-4 py-3">
          <h2 className="text-lg font-bold text-orange-600 tracking-wide">
            Event Management
          </h2>
        </SidebarHeader>

        {/* Menu */}
        <SidebarContent className="mt-4">
          <SidebarMenu>
            {menuItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.href}
                      className={clsx(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        "hover:bg-orange-50 hover:text-orange-600",
                        isActive
                          ? "bg-orange-100 text-orange-600"
                          : "text-gray-600"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
    </SidebarProvider>
  );
}
