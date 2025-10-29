import Navbar from "../../components/admin/layouts/Navbar";
import Sidebar from "../organizer/components/layouts/Sidebar";
import Footer from "../../components/admin/layouts/Footer";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col">
      {/* Navbar cố định trên */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar chiếm width cố định */}
        <div className="w-64 border-r bg-white">
          <Sidebar />
        </div>

        {/* Main chiếm phần còn lại */}
        <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
          {children}
        </main>
      </div>

      {/* Footer cố định dưới */}
      <Footer />
    </div>
  );
}
