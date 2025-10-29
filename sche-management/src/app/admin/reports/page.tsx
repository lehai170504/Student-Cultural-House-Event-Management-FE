"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AttendanceReport } from "@/components/admin/reports/AttendanceReport";
import { FeedbackReport } from "@/components/admin/reports/FeedbackReport";
import { TransactionReport } from "@/components/admin/reports/TransactionReport";

export default function ReportsPage() {
  const [tab, setTab] = useState("attendance");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-orange-600">Báo cáo</h1>
      <p className="text-muted-foreground">Thống kê chi tiết và theo dõi</p>

      <Card>
        <CardHeader>
          <CardTitle>Danh mục báo cáo</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="attendance">Tham dự</TabsTrigger>
              <TabsTrigger value="feedback">Đánh giá</TabsTrigger>
              <TabsTrigger value="transactions">Giao dịch</TabsTrigger>
            </TabsList>

            <TabsContent value="attendance">
              <AttendanceReport />
            </TabsContent>
            <TabsContent value="feedback">
              <FeedbackReport />
            </TabsContent>
            <TabsContent value="transactions">
              <TransactionReport />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
