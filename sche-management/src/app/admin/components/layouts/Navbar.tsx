"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button"; // file bạn vừa định nghĩa lại

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header className="w-full h-16 bg-white border-b flex items-center justify-between px-6 shadow-sm">
      {/* Logo / Tiêu đề */}
      <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>

      {/* Dropdown người dùng */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 px-3 py-2"
        >
          <img
            src="https://i.pravatar.cc/40"
            alt="avatar"
            className="w-8 h-8 rounded-full"
          />
          <span className="text-gray-700 font-medium">Admin</span>
          <svg
            className={`w-4 h-4 text-gray-600 transition-transform ${
              open ? "rotate-180" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </Button>

        {open && (
          <div className="absolute right-0 mt-2 w-44 bg-white border rounded-lg shadow-lg py-2 z-50">
            <Button
              asChild
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              <a href="/profile">Xem Profile</a>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start px-4 py-2 text-gray-700 hover:bg-gray-100"
              onClick={() => alert("Đăng xuất")}
            >
              Đăng xuất
            </Button>
          </div>
        )}
      </div>
    </header>
  );
}
