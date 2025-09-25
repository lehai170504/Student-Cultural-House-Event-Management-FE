"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { AttendanceReport } from "./components/layouts/AttendanceReport";
import { FeedbackReport } from "./components/layouts/FeedbackReport";
import { TransactionReport } from "./components/layouts/TransactionReport";

export default function ReportsPage() {
  const [tab, setTab] = useState("attendance");

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-orange-600">Reports</h1>
      <p className="text-muted-foreground">Detailed statistics and logs.</p>

      <Card>
        <CardHeader>
          <CardTitle>Report Categories</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="attendance">Attendance</TabsTrigger>
              <TabsTrigger value="feedback">Feedback Rating</TabsTrigger>
              <TabsTrigger value="transactions">Transaction Log</TabsTrigger>
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
