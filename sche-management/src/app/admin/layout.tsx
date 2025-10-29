import Navbar from "@/components/admin/layouts/Navbar";
import Sidebar from "@/components/admin/layouts/Sidebar";
import Footer from "@/components/admin/layouts/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Navbar dính trên cùng nhưng không che Sidebar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar chiếm width cố định */}
        <aside className="w-64 border-r bg-white flex-shrink-0">
          <Sidebar />
        </aside>

        {/* Main chiếm phần còn lại */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>

      <Footer />
    </div>
  );
}
