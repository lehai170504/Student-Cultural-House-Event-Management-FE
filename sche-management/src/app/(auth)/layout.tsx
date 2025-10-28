import PublicNavbar from "@/components/PublicNavbar";
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-r from-orange-100 via-white to-orange-50">
      {/* Navbar công khai */}
      <div className="sticky top-0 z-40">
        <PublicNavbar />
      </div>

      <div className="flex items-center justify-center p-6">
        {children}
      </div>
    </div>
  );
}
