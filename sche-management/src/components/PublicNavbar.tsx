"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "react-oidc-context";
import { UserProfile } from "@/components/UserProfile";

export default function PublicNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const resizeTimerRef = useRef<number | null>(null);
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onScroll = () => {
      if (isResizing) return;
      const y = window.scrollY;
      setIsScrolled((prev) => {
        if (!prev && y > 24) return true;
        if (prev && y < 4) return false;
        return prev;
      });
    };

    const onResize = () => {
      setIsResizing(true);
      if (resizeTimerRef.current) window.clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = window.setTimeout(
        () => setIsResizing(false),
        150
      );
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
    { label: "Liên hệ", href: "/contact" },
  ];

  return (
    <header
      className={clsx(
        "fixed top-0 left-0 w-full z-50 transition-all duration-500 backdrop-blur-md border-b border-orange-100",
        isScrolled
          ? "bg-white/90 shadow-lg scale-[0.99]"
          : "bg-gradient-to-r from-orange-50/80 via-amber-50/70 to-white/60"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-10 flex items-center justify-between h-16 md:h-20 transition-transform duration-300">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 group transition-transform duration-300 hover:scale-[1.03]"
        >
          <img
            src="/LogoRMBG.png"
            alt="Student Cultural House Logo"
            className="h-10 md:h-12 object-contain"
          />
          <span className="font-bold bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent text-lg md:text-xl group-hover:brightness-110">
            Student Cultural House
          </span>
        </Link>

        {/* Navigation (Desktop) */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300",
                  isActive
                    ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md"
                    : "text-gray-700 hover:text-orange-600 hover:bg-orange-50/80"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          {mounted && auth?.isAuthenticated ? (
            <UserProfile />
          ) : (
            <Button
              asChild
              className="bg-gradient-to-r cursor-pointer from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white shadow-md hover:shadow-lg transition-all duration-300 rounded-xl px-5"
            >
              <Link href="/login">Đăng nhập</Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-orange-600 hover:bg-orange-100 transition-colors"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="left"
              className="w-[80vw] xs:w-[300px] p-0 bg-gradient-to-b from-orange-50 via-white to-amber-50 border-r border-orange-100"
            >
              <SheetHeader className="p-4 border-b border-orange-100">
                <SheetTitle className="text-orange-600 font-semibold">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="p-4 space-y-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <SheetClose asChild key={item.href}>
                      <Link
                        href={item.href}
                        className={clsx(
                          "block px-4 py-3 rounded-lg font-medium transition-all duration-200",
                          isActive
                            ? "bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow"
                            : "text-gray-700 hover:text-orange-600 hover:bg-orange-50"
                        )}
                      >
                        {item.label}
                      </Link>
                    </SheetClose>
                  );
                })}

                {/* Auth (Mobile) */}
                <div className="pt-3 border-t border-orange-100">
                  {mounted && auth?.isAuthenticated ? (
                    <div className="px-2 py-2">
                      <UserProfile />
                    </div>
                  ) : (
                    <SheetClose asChild>
                      <Link href="/login">
                        <Button className="w-full bg-gradient-to-r from-orange-500 to-amber-400 text-white hover:scale-[1.02] transition-all duration-200">
                          Đăng nhập
                        </Button>
                      </Link>
                    </SheetClose>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
