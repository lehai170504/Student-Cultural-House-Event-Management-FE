"use client";

import { Suspense, lazy } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserTable = lazy(() => import("@/features/users/components/UserTable"));
const UniversityTable = lazy(
  () => import("@/features/universities/components/UniversityTable")
);

export default function AdminTablesPageTabs() {
  // Giả sử bạn có hook useUsers để lấy list người dùng
  // const { list: users, loading: usersLoading } = useUsers();

  return (
    <div className="p-6">
      <Tabs defaultValue="users" className="space-y-4">
        {/* Tab list */}
        <TabsList>
          <TabsTrigger value="users">Quản lý người dùng</TabsTrigger>
          <TabsTrigger value="universities">Quản lý trường đại học</TabsTrigger>
        </TabsList>

        {/* Tab content: Users */}
        <TabsContent value="users">
          <Suspense fallback={<p>Đang tải quản lý người dùng...</p>}>
            {/* Nếu có dữ liệu từ hook useUsers, truyền vào props users */}
            <UserTable users={[]} />
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
