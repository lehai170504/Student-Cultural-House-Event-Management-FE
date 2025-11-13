// src/features/partner/pages/PartnerTablesPageTabs.tsx
"use client";

import { Suspense, lazy } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EventCategoryTable = lazy(
  () => import("@/features/eventCategories/components/EventCategoryTable")
);
const PartnerEventTable = lazy(
  () => import("@/features/events/components/PartnerEventTable")
);

export default function PartnerTablesPageTabs() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Quản lý Đối tác</h1>

      {/* 🌟 Sử dụng Tabs để phân chia giữa Danh mục và Sự kiện */}
      <Tabs defaultValue="events" className="space-y-4">
        {/* Tab list */}
        <TabsList>
          <TabsTrigger value="events">Quản lý Sự kiện</TabsTrigger>
          <TabsTrigger value="categories">Danh mục Sự kiện</TabsTrigger>
        </TabsList>

        {/* Tab Content: Quản lý Sự kiện */}
        <TabsContent value="events">
          <Suspense fallback={<p className="p-4">Đang tải bảng sự kiện...</p>}>
            <PartnerEventTable />
          </Suspense>
        </TabsContent>

        {/* Tab Content: Danh mục Sự kiện */}
        <TabsContent value="categories">
          <Suspense
            fallback={<p className="p-4">Đang tải danh mục sự kiện...</p>}
          >
            <EventCategoryTable />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
