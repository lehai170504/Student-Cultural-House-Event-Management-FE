export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 via-white to-orange-50 p-6">
      {children}
    </div>
  );
}
