"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export default function PublicNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    // Hysteresis để tránh nhấp nháy khi gần đỉnh trang và trong lúc resize
    const onScroll = () => {
      if (isResizing) return;
      const y = window.scrollY;
      setIsScrolled((prev) => {
        // Bật khi vượt ngưỡng cao, tắt khi xuống dưới ngưỡng thấp
        if (!prev && y > 24) return true;
        if (prev && y < 4) return false;
        return prev;
      });
    };

    const onResize = () => {
      setIsResizing(true);
      if (resizeTimerRef.current) window.clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = window.setTimeout(() => setIsResizing(false), 150);
      // Trong khi resize, gọi lại scroll 1 lần sau cùng để đồng bộ trạng thái
      // nhưng đã debounce bằng timer phía trên
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [isResizing]);

  const navItems = [
    { label: "Trang chủ", href: "/" },
    { label: "Sự kiện", href: "/events" },
    { label: "Đổi quà", href: "/gifts" },
    { label: "Đăng ký thẻ", href: "/card/register" },
    { label: "Liên hệ", href: "/contact" },
  ];

  return (
    <header
      className={clsx(
        // Hạn chế transition để tránh rung khi layout thay đổi
        "w-full bg-white border-b px-4 md:px-6 shadow-sm flex items-center justify-between transition-colors duration-300 sticky top-0 z-50 h-16 md:h-20"
      )}
    >
      <div
        className={clsx(
          "relative w-full flex items-center justify-between origin-top will-change-transform transform-gpu transition-transform duration-300",
          isScrolled ? "scale-95" : "scale-100"
        )}
      >
        {/* Logo bên trái */}
        <Link
          href="/"
          className={clsx(
            "font-bold text-orange-600 transition-colors duration-300 text-xl md:text-2xl"
          )}
        >
          Student Cultural House
        </Link>

        {/* Menu giữa */}
        <nav className="absolute left-1/2 -translate-x-1/2 hidden md:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "rounded-lg font-medium transition-colors duration-200 px-4 py-2 text-sm",
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
        <div className="hidden md:flex items-center gap-2">
          <Button
            asChild
            variant="ghost"
            className={clsx(
              "hover:bg-orange-50 hover:text-orange-600 transition-colors duration-200 h-10 px-4 text-sm"
            )}
          >
            <Link href="/login">Đăng nhập</Link>
          </Button>
          <Button
            asChild
            className={clsx(
              "bg-orange-500 hover:bg-orange-600 text-white transition-colors duration-200 h-10 px-5 text-sm"
            )}
          >
            <Link href="/register">Đăng kí</Link>
          </Button>
        </div>

        {/* Mobile menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[85vw] xs:w-[320px] p-0">
              <SheetHeader className="p-4 border-b">
                <SheetTitle className="text-orange-600">Menu</SheetTitle>
              </SheetHeader>
              <div className="p-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={clsx(
                          "block rounded-lg font-medium px-4 py-3",
                          isActive
                            ? "bg-orange-500 text-white"
                            : "text-gray-700 hover:bg-orange-50 hover:text-orange-600"
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}
                <div className="pt-2 grid grid-cols-2 gap-2">
                  <SheetClose asChild>
                    <Link href="/login">
                      <Button variant="outline" className="w-full">Đăng nhập</Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Link href="/register">
                      <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white">Đăng kí</Button>
                    </Link>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}


