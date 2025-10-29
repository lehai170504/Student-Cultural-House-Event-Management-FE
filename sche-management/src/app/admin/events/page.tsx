"use client";

import { Suspense, lazy } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const EventCategoryTable = lazy(
  () => import("@/features/eventCategories/components/EventCategoryTable")
);
const EventTable = lazy(() => import("@/features/events/components/EventTable"));
// const SpecialEventsTable = lazy(() => import("@/features/specialEvents/components/SpecialEventsTable"));

export default function AdminTablesPageTabs() {
  return (
    <div className="p-6">
      <Tabs defaultValue="categories" className="space-y-4">
        {/* Tab list */}
        <TabsList>
          <TabsTrigger value="categories">Danh mục sự kiện</TabsTrigger>
          <TabsTrigger value="events">Quản lí sự kiện</TabsTrigger>
          {/* <TabsTrigger value="specialEvents">Sự kiện đặc biệt</TabsTrigger> */}
        </TabsList>

        {/* Tab content: Categories */}
        <TabsContent value="categories">
          <Suspense fallback={<p>Đang tải danh mục sự kiện...</p>}>
            <EventCategoryTable />
          </Suspense>
        </TabsContent>

        {/* Tab content: Events */}
        <TabsContent value="events">
          <Suspense fallback={<p>Đang tải quản lí sự kiện...</p>}>
            <EventTable />
          </Suspense>
        </TabsContent>

        {/* Tab content: Special Events */}
        {/* <TabsContent value="specialEvents">
          <Suspense fallback={<p>Đang tải sự kiện đặc biệt...</p>}>
            <SpecialEventsTable />
          </Suspense>
        </TabsContent> */}
      </Tabs>
    </div>
  );
}
