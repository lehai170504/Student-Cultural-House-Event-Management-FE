"use client";

import { useEffect, useState } from "react";

export default function Footer() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <footer className="w-full h-16 bg-white border-t flex items-center justify-center px-6">
      <p className="text-sm text-gray-600">
        &copy; {year ?? ""} Student Cultural House Event Management. All rights
        reserved.
      </p>
    </footer>
  );
}
