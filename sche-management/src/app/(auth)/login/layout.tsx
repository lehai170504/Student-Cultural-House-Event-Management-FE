"use client";

import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-orange-100 via-white to-orange-200">
      {/* Toàn màn hình, căn giữa form */}
      <div className="w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}
