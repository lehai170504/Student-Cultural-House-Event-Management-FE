"use client";

import { useState, Suspense, lazy, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Eye,
  CheckSquare,
  PlusCircle,
  RotateCw,
  ThumbsUp,
  Lock,
  Trash2,
} from "lucide-react";
import { useEvents } from "../hooks/useEvents";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { useUserProfileAuth } from "@/hooks/useUserProfileAuth";
import { EventCheckinDetail, EventForCheckin } from "../types/events";

const ViewDetailEvent = lazy(() => import("./ViewDetailEvent"));
const CreateEventModal = lazy(() => import("./CreateEventModal"));
const CheckinPhoneNumberDialog = lazy(
  () => import("./CheckinPhoneNumberDialog")
);

export default function EventTable() {
  const { user } = useUserProfile(); // giữ user.id để gửi xuống DB
  const { user: authUser, isAdmin, isManager } = useUserProfileAuth(); // phân quyền UI

  const userId = user?.id || "";

  const {
    list = [],
    loadingList,
    loadAll,
    pagination,
    submittingCheckin,
    deleting,
    approveEventAndReload,
    finalizeEventAndReload,
    deleteEventAndReload,
    submitCheckinAndNotify,
  } = useEvents();

  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [currentCheckinEvent, setCurrentCheckinEvent] =
    useState<EventForCheckin | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [processingEventId, setProcessingEventId] = useState<string | null>(
    null
  );

  const totalPages = pagination?.totalPages || 0;
  const totalElements = pagination?.totalElements || 0;
  const currentPage = pagination?.currentPage || 0;
  const isLastPage = pagination?.isLastPage || false;

  const filteredEvents = Array.isArray(list)
    ? list.filter((e) => e.title?.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearch(keyword);
    loadAll({ page: 1, search: keyword || undefined });
  };

  const handlePageChange = (page: number) => {
    if (loadingList) return;
    const apiPage = page + 1;
    if (page >= 0 && page < totalPages) {
      loadAll({ page: apiPage, search: search || undefined });
    }
  };

  const openCheckinModal = useCallback(
    (event: { id: string; title: string }) => {
      setCurrentCheckinEvent({
        id: event.id,
        title: event.title,
        studentId: userId,
        studentName: user?.fullName || "Người tham dự",
      });
      setIsCheckinModalOpen(true);
    },
    [userId, user?.fullName]
  );

  const handleCheckinSubmit = useCallback(
    async (payload: { eventId: string; phoneNumber: string }) => {
      if (!currentCheckinEvent) return;
      const fullPayload: EventCheckinDetail & { phoneNumber: string } = {
        checkinId: "",
        eventId: payload.eventId,
        eventTitle: currentCheckinEvent.title,
        studentId: Number(currentCheckinEvent.studentId) || 0,
        studentName: currentCheckinEvent.studentName,
        registrationTime: new Date().toISOString(),
        verified: false,
        depositPaid: 0,
        phoneNumber: payload.phoneNumber,
      };
      setProcessingEventId(payload.eventId);
      await submitCheckinAndNotify(fullPayload);
      setIsCheckinModalOpen(false);
      setCurrentCheckinEvent(null);
      setProcessingEventId(null);
    },
    [submitCheckinAndNotify, currentCheckinEvent]
  );

  const getStatusBadge = (status: string) => {
    const classes =
      {
        ACTIVE: "bg-green-100 text-green-800",
        DRAFT: "bg-blue-100 text-blue-800",
        FINISHED: "bg-gray-100 text-gray-800",
        CANCELLED: "bg-red-100 text-red-800",
        FINALIZED: "bg-purple-100 text-purple-800",
      }[status] || "bg-gray-200 text-gray-700";

    return (
      <span
        className={`px-3 py-1 text-xs font-semibold rounded-full ${classes}`}
      >
        {status}
      </span>
    );
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage, endPage;
    if (totalPages <= maxPagesToShow) {
      startPage = 0;
      endPage = totalPages;
    } else {
      const half = Math.floor(maxPagesToShow / 2);
      if (currentPage <= half) {
        startPage = 0;
        endPage = maxPagesToShow;
      } else if (currentPage + half >= totalPages) {
        startPage = totalPages - maxPagesToShow;
        endPage = totalPages;
      } else {
        startPage = currentPage - half;
        endPage = currentPage + half + 1;
      }
    }
    for (let i = startPage; i < endPage; i++) pages.push(i);
    return pages;
  };

  const isProcessing = (eventId: string) => processingEventId === eventId;
  const isCheckingIn = (eventId: string) =>
    submittingCheckin &&
    currentCheckinEvent?.id === eventId &&
    isCheckinModalOpen;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          {/* Header */}
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý sự kiện
              </h1>
              <p className="text-lg text-gray-600">
                Tổng số: <strong>{totalElements}</strong> sự kiện
              </p>
            </div>
            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              <Input
                placeholder="Tìm kiếm sự kiện..."
                value={search}
                onChange={handleSearch}
                className="w-[200px] rounded-lg shadow-sm"
              />
              {authUser?.groups.includes("PARTNERS") && (
                <Button
                  onClick={() => setIsCreateModalOpen(true)}
                  className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md"
                >
                  <PlusCircle className="h-4 w-4" /> Tạo sự kiện
                </Button>
              )}
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-gray-200 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  {[
                    "Tên sự kiện",
                    "Đối tác",
                    "Địa điểm",
                    "Thời gian",
                    "Trạng thái",
                    "Hành động",
                  ].map((h) => (
                    <TableHead
                      key={h}
                      className="px-6 py-3 text-gray-700 font-semibold"
                    >
                      {h}
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
                      <RotateCw className="inline animate-spin mr-2 h-4 w-4" />{" "}
                      Đang tải danh sách sự kiện...
                    </TableCell>
                  </TableRow>
                ) : filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      Không có sự kiện nào được tìm thấy.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id} className="hover:bg-gray-50">
                      <TableCell className="px-6 py-4 font-medium text-gray-800">
                        {event.title}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-600">
                        {event.partnerName || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-600">
                        {event.location}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm text-gray-600">
                        <div className="flex flex-col">
                          <span>
                            {new Date(event.startTime).toLocaleDateString()}
                          </span>
                          <span className="text-xs text-gray-400">
                            {new Date(event.startTime).toLocaleTimeString()} -{" "}
                            {new Date(event.endTime).toLocaleTimeString()}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>{getStatusBadge(event.status)}</TableCell>
                      <TableCell className="px-6 py-4 flex gap-2">
                        {/* Xem chi tiết */}
                        <Button
                          size="sm"
                          className="p-2 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                          onClick={() => setSelectedEvent(event.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Duyệt */}
                        {isAdmin && event.status === "DRAFT" && (
                          <Button
                            size="sm"
                            className="p-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-100"
                            onClick={() =>
                              approveEventAndReload(event.id, event.title, {
                                page: currentPage,
                                search,
                              })
                            }
                          >
                            {isProcessing(event.id) ? (
                              <RotateCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <ThumbsUp className="h-4 w-4" />
                            )}
                          </Button>
                        )}

                        {/* Check-in */}
                        {event.status === "ACTIVE" && (
                          <Button
                            size="sm"
                            className="p-2 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-100"
                            onClick={() => openCheckinModal(event)}
                          >
                            {isCheckingIn(event.id) ? (
                              <RotateCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <CheckSquare className="h-4 w-4" />
                            )}
                          </Button>
                        )}

                        {/* Chốt */}
                        {isAdmin && event.status === "ACTIVE" && (
                          <Button
                            size="sm"
                            className="p-2 rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-100"
                            onClick={() =>
                              finalizeEventAndReload(event.id, event.title, {
                                page: currentPage,
                                search,
                              })
                            }
                          >
                            {isProcessing(event.id) ? (
                              <RotateCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Lock className="h-4 w-4" />
                            )}
                          </Button>
                        )}

                        {/* Xóa */}
                        {authUser?.groups.includes("PARTNERS") &&
                          event.status === "DRAFT" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="p-2 rounded-full bg-red-100 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                              onClick={() =>
                                deleteEventAndReload(event.id, event.title, {
                                  page: currentPage,
                                  search,
                                })
                              }
                            >
                              {isProcessing(event.id) ? (
                                <RotateCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="flex justify-between items-center mt-6 flex-wrap">
              <div className="text-sm text-gray-600 mb-2 md:mb-0">
                Hiển thị {filteredEvents.length}/{totalElements} sự kiện.
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(currentPage - 1)}
                      className={
                        currentPage === 0 || loadingList
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                  {getPageNumbers().map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={page === currentPage}
                        onClick={() => handlePageChange(page)}
                      >
                        {page + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(currentPage + 1)}
                      className={
                        isLastPage || loadingList
                          ? "pointer-events-none opacity-50"
                          : ""
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </section>

      {/* Modal chi tiết, tạo, checkin */}
      <Suspense fallback={<div>Đang tải...</div>}>
        {selectedEvent && (
          <ViewDetailEvent
            eventId={selectedEvent}
            open={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
        {isCreateModalOpen && (
          <CreateEventModal
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={() => loadAll({ page: currentPage, search })}
            partnerId={userId.toString()}
          />
        )}
        {isCheckinModalOpen && currentCheckinEvent && (
          <CheckinPhoneNumberDialog
            open={isCheckinModalOpen}
            event={currentCheckinEvent}
            onClose={() => {
              setIsCheckinModalOpen(false);
              setCurrentCheckinEvent(null);
            }}
            onSubmit={handleCheckinSubmit}
            submitting={submittingCheckin}
          />
        )}
      </Suspense>
    </main>
  );
}
