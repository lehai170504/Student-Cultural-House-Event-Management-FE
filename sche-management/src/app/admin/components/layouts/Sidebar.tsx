export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-orange-500 mb-6">Admin Panel</h2>
        <nav className="space-y-4">
          <a
            href="/admin/dashboard"
            className="block text-gray-700 hover:text-orange-500 font-medium"
          >
            Dashboard
          </a>
          <a
            href="/admin/events"
            className="block text-gray-700 hover:text-orange-500 font-medium"
          >
            Events
          </a>
          <a
            href="/admin/users"
            className="block text-gray-700 hover:text-orange-500 font-medium"
          >
            Users
          </a>
          <a
            href="/admin/settings"
            className="block text-gray-700 hover:text-orange-500 font-medium"
          >
            Settings
          </a>
        </nav>
      </div>
    </div>
  );
}
