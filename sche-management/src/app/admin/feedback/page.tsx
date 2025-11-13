// app/feedback/page.tsx
"use client";

import FeedbackTable from "@/features/feedback/components/FeedbackTable";

export default function FeedbackPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <FeedbackTable />
    </main>
  );
}
