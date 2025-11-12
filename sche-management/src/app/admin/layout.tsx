import Navbar from "@/components/admin/layouts/Navbar";
import Sidebar from "@/components/admin/layouts/Sidebar";
import Footer from "@/components/admin/layouts/Footer";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar cố định bên trái */}
      <aside className="w-64 h-screen border-r bg-white/90 backdrop-blur-sm shadow-lg flex-shrink-0">
        <Sidebar />
      </aside>

      {/* Cột phải: navbar + content + footer */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
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
