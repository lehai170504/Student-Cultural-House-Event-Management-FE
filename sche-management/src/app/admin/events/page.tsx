// src/app/admin/event-categories/page.tsx
"use client";

import EventCategoryTable from "@/features/eventCategories/components/EventCategoryTable";

export default function EventCategoriesPage() {
  return (
    <div className="p-6">
      <EventCategoryTable />
    </div>
  );
}
