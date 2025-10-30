"use client";

import { Suspense, lazy } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StudentTable = lazy(
  () => import("@/features/students/components/StudentTable")
);
const UniversityTable = lazy(
  () => import("@/features/universities/components/UniversityTable")
);

const PartnerTable = lazy(
  () => import("@/features/partner/components/PartnerTable")
);

export default function AdminTablesPageTabs() {
  return (
    <div className="p-6">
      <Tabs defaultValue="users" className="space-y-4">
        {/* Tab list */}
        <TabsList>
          <TabsTrigger value="users">Quản lý người dùng</TabsTrigger>
          <TabsTrigger value="partners">Quản lý đối tác</TabsTrigger>
          <TabsTrigger value="universities">Quản lý trường đại học</TabsTrigger>
        </TabsList>

        {/* Tab content: Users */}
        <TabsContent value="users">
          <Suspense fallback={<p>Đang tải quản lý người dùng...</p>}>
            <StudentTable />
          </Suspense>
        </TabsContent>

        <TabsContent value="partners">
          <Suspense fallback={<p>Đang tải quản lý đối tác...</p>}>
            <PartnerTable />
          </Suspense>
        </TabsContent>

        {/* Tab content: Universities */}
        <TabsContent value="universities">
          <Suspense fallback={<p>Đang tải quản lý trường đại học...</p>}>
            <UniversityTable />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
