"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useEvents } from "@/features/events/hooks/useEvents";
import type { Attendee } from "@/features/events/types/events";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function EventDetailPage() {
  const pathname = usePathname();
  const eventId = pathname.split("/").pop();

  const {
    detail,
    loadDetail,
    attendees,
    loadEventAttendeesWithToast,
    loadingDetail,
    loadingAttendees,
    pagination,
  } = useEvents();

  useEffect(() => {
    if (eventId) {
      loadDetail(eventId);
      loadEventAttendeesWithToast(eventId, { page: 1, size: 20 });
    }
  }, [eventId, loadDetail, loadEventAttendeesWithToast]);

  if (!eventId) return <p>Không tìm thấy ID sự kiện.</p>;
  if (loadingDetail) return <p>Đang tải chi tiết sự kiện...</p>;

  return (
    <div className="p-6 space-y-8">
      {/* Event Info */}
      <Card className="bg-gradient-to-r from-indigo-50 to-indigo-100 shadow-lg border-0">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-indigo-800">
            {detail?.title}
          </CardTitle>
          <CardDescription className="text-indigo-600">
            📍 Địa điểm: {detail?.location || "Chưa cập nhật"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700">
            {detail?.description || "Không có mô tả"}
          </p>
        </CardContent>
      </Card>

      <Separator />

      {/* Attendees */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Danh sách người tham dự ({attendees?.length || 0})
        </h2>

        {loadingAttendees ? (
          <p className="text-gray-500">Đang tải danh sách người tham dự...</p>
        ) : attendees && attendees.length > 0 ? (
          <ScrollArea className="rounded-lg border border-gray-200 shadow-sm">
            <Table className="min-w-full">
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead className="text-left">Avatar</TableHead>
                  <TableHead className="text-left">Họ tên</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Trường</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {attendees.map((attendee: Attendee, idx) => (
                  <TableRow
                    key={attendee.id}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50 transition-colors`}
                  >
                    <TableCell>
                      {attendee.avatarUrl ? (
                        <Tooltip>
                          <TooltipTrigger>
                            <img
                              src={attendee.avatarUrl}
                              alt={attendee.fullName}
                              className="h-12 w-12 rounded-full object-cover border-2 border-indigo-200"
                            />
                          </TooltipTrigger>
                          <TooltipContent>{attendee.fullName}</TooltipContent>
                        </Tooltip>
                      ) : (
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 border-2 border-gray-300">
                          N/A
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="font-medium text-gray-800">
                      {attendee.fullName}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {attendee.email}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {attendee.phoneNumber}
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {attendee.universityName}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        ) : (
          <p className="text-gray-500">Chưa có người tham dự nào.</p>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-end gap-2 mt-2">
            {Array.from({ length: pagination.totalPages }).map((_, idx) => (
              <Button
                key={idx}
                variant={idx === pagination.currentPage ? "default" : "outline"}
                size="sm"
                onClick={() =>
                  eventId &&
                  loadEventAttendeesWithToast(eventId, {
                    page: idx + 1,
                    size: pagination.pageSize,
                  })
                }
              >
                {idx + 1}
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
