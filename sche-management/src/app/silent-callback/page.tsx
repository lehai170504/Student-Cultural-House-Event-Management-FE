"use client";

import { useAuth } from "react-oidc-context";
import { useEffect } from "react";

export default function SilentCallback() {
  const auth = useAuth();

  useEffect(() => {
    // Silent callback is handled automatically by react-oidc-context
    // This page just needs to exist for the silent renewal process
  }, [auth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Đang làm mới phiên đăng nhập...</p>
      </div>
    </div>
  );
}
