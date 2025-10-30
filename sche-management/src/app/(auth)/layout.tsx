import PublicNavbar from "@/components/PublicNavbar";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-orange-100 via-white to-orange-50">
      {/* Navbar công khai */}
      <div className="sticky top-0 z-40">
        <PublicNavbar />
      </div>

      {/* Vùng content chiếm toàn bộ phần còn lại và căn giữa */}
      <div className="flex-1 flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
