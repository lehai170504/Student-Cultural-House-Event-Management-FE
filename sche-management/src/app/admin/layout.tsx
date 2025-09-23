import Navbar from "../admin/components/layouts/Navbar";
import Sidebar from "../admin/components/layouts/Sidebar";
import Footer from "../admin/components/layouts/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar cố định trên */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar cố định bên trái */}
        <Sidebar />

        {/* Main có thể cuộn */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* Footer cố định dưới */}
      <Footer />
    </div>
  );
}
