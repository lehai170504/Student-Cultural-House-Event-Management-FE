"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useFeedbacks } from "../hooks/useFeedbacks";
import { useEvents } from "@/features/events/hooks/useEvents";
import { Feedback } from "../types/feedback";
// @ts-ignore
import { toast, Toaster } from "sonner";

export default function FeedbackTable() {
  const {
    list = [],
    loadingList,
    setEventFilter,
    filterEventId,
  } = useFeedbacks();
  const { list: events = [], loadAll: loadAllEvents } = useEvents();

  const [search, setSearch] = useState("");

  // Load events on mount
  useEffect(() => {
    loadAllEvents().catch(console.error);
  }, [loadAllEvents]);

  const filteredFeedback: Feedback[] = Array.isArray(list)
    ? list.filter((f) =>
        f.studentName.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <section className="bg-white rounded-2xl shadow p-6 md:p-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Danh sách Feedback
            </h1>
            <p className="text-gray-500 mt-1">
              Theo dõi đánh giá và bình luận của học sinh
            </p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <Input
              placeholder="Tìm kiếm theo tên học sinh..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-64"
            />
            <Select
              onValueChange={(value) =>
                setEventFilter(value === "all" ? undefined : value)
              }
              value={filterEventId || "all"}
            >
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Lọc theo sự kiện..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả sự kiện</SelectItem>
                {events.map((event) => (
                  <SelectItem key={event.id} value={event.id}>
                    {event.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                {[
                  "STT",
                  "Học sinh",
                  "Sự kiện",
                  "Rating",
                  "Bình luận",
                  "Ngày tạo",
                ].map((title) => (
                  <TableHead
                    key={title}
                    className="px-4 py-3 text-left text-gray-700"
                  >
                    {title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>

            <TableBody>
              {loadingList ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : filteredFeedback.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-gray-500"
                  >
                    Không có feedback nào
                  </TableCell>
                </TableRow>
              ) : (
                filteredFeedback.map((feedback, index) => (
                  <TableRow
                    key={feedback.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="px-4 py-3">{index + 1}</TableCell>
                    <TableCell className="px-4 py-3">
                      {feedback.studentName}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {feedback.eventTitle}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {feedback.rating}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {feedback.comments}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {new Date(feedback.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      <Toaster position="top-right" richColors />
    </main>
  );
}
