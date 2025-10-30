"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function PartnerSidebar() {
  const pathname = usePathname();
  const items = [
    { href: "/partner/events", label: "Sự kiện" },
    { href: "/partner/wallet", label: "Ví" },
    { href: "/partner/notifications", label: "Tạo thông báo" },
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b">
        <p className="text-sm text-gray-600">Xin chào, Partner</p>
      </div>
      <nav className="flex-1 p-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`block px-4 py-2 rounded-lg mb-1 text-sm ${
              pathname?.startsWith(item.href)
                ? "bg-orange-50 text-orange-700"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}


