export default function Footer() {
  return (
    <footer className="w-full h-16 bg-white border-t flex items-center justify-center px-6">
      <p className="text-sm text-gray-600">
        &copy; {new Date().getFullYear()} Student Cultural House Event
        Management. All rights reserved.
      </p>
    </footer>
  );
}
