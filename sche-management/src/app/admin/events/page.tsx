"use client";

import { Suspense, lazy } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EventCategoryTable = lazy(
  () => import("@/features/eventCategories/components/EventCategoryTable")
);
const EventTable = lazy(
  () => import("@/features/events/components/EventTable")
);

export default function AdminTablesPageTabs() {
  return (
    <div className="p-6">
      <Tabs defaultValue="categories" className="space-y-4">
        {/* Tab list */}
        <TabsList>
          <TabsTrigger value="categories">Danh mục sự kiện</TabsTrigger>
          <TabsTrigger value="events">Quản lí sự kiện</TabsTrigger>
        </TabsList>

        <TabsContent value="categories">
          <Suspense fallback={<p>Đang tải danh mục sự kiện...</p>}>
            <EventCategoryTable />
          </Suspense>
        </TabsContent>

        <TabsContent value="events">
          <Suspense fallback={<p>Đang tải quản lí sự kiện...</p>}>
            <EventTable />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
