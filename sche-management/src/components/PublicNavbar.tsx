"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function PublicNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Sự kiện", href: "/events" },
    { label: "Đổi quà", href: "/gifts" },
    { label: "Liên hệ", href: "/contact" },
  ];

  return (
    <header
      className={clsx(
        "w-full bg-white border-b px-6 shadow-sm flex items-center justify-between transition-all duration-300 sticky top-0 z-50",
        isScrolled ? "h-14" : "h-20"
      )}
    >
      {/* Logo bên trái */}
      <Link
        href="/"
        className={clsx(
          "font-bold text-orange-600 transition-all duration-300",
          isScrolled ? "text-lg" : "text-2xl"
        )}
      >
        Student Cultural House
      </Link>

      {/* Menu giữa */}
      <nav className="absolute left-1/2 -translate-x-1/2 flex items-center gap-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                "rounded-lg font-medium transition-all duration-300",
                isScrolled ? "px-3 py-2 text-sm" : "px-5 py-3 text-base",
                isActive
                  ? "bg-orange-500 text-white shadow"
                  : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Actions bên phải */}
      <div className="flex items-center gap-2">
        <Button
          asChild
          variant="ghost"
          className={clsx(
            "hover:bg-orange-50 hover:text-orange-600 transition-all duration-300",
            isScrolled ? "h-9 px-3 text-sm" : "h-10 px-4 text-base"
          )}
        >
          <Link href="/login">Đăng nhập</Link>
        </Button>
        <Button
          asChild
          className={clsx(
            "bg-orange-500 hover:bg-orange-600 text-white transition-all duration-300",
            isScrolled ? "h-9 px-4 text-sm" : "h-10 px-5 text-base"
          )}
        >
          <Link href="/register">Đăng kí</Link>
        </Button>
      </div>
    </header>
  );
}


