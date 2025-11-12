"use client";

import Navbar from "@/components/admin/layouts/Navbar";
import Sidebar from "@/components/admin/layouts/Sidebar";
import Footer from "@/components/admin/layouts/Footer";
import { useAuth } from "react-oidc-context";
import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const auth = useAuth();
  const [allowed, setAllowed] = useState<boolean | null>(null);

  const isAdminFromStorage = useMemo(() => {
    try {
      const authority = process.env.NEXT_PUBLIC_COGNITO_AUTHORITY as string;
      const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string;
      const key = `oidc.user:${authority}:${clientId}`;
      const json = localStorage.getItem(key) || sessionStorage.getItem(key);
      if (!json) return false;
      const user = JSON.parse(json);
      const groups = user?.profile?.["cognito:groups"];
      return Array.isArray(groups) && groups.includes("ADMIN");
    } catch {
      return false;
    }
  }, []);

  useEffect(() => {
    if (auth.isLoading) return;
    const groups = (auth.user?.profile as any)?.["cognito:groups"] || [];
    const isAdmin = Array.isArray(groups) && groups.includes("Admin");
    setAllowed(isAdmin || isAdminFromStorage);
    if (!isAdmin && !isAdminFromStorage) {
      window.location.href = "/";
    }
  }, [auth.isLoading, auth.user, isAdminFromStorage]);

  if (allowed === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin text-orange-500 mx-auto mb-4" />
          <p className="text-gray-600">Đang kiểm tra quyền Admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar cố định bên trái */}
      <aside className="w-64 h-screen border-r bg-white/90 backdrop-blur-sm shadow-lg flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Cột phải: navbar + content + footer */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar sticky */}
        <header className="sticky top-0 z-50">
          <Navbar />
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {children}
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0">
          <Footer />
        </footer>
      </div>
    </div>
  );
}
