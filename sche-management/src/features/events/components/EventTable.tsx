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
import { Eye, CheckSquare, Zap, RotateCw, PlusCircle } from "lucide-react";

import { useEvents } from "../hooks/useEvents";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { toast } from "sonner";
import { EventCheckinDetail, EventForCheckin } from "../types/events";

// 🌟 Lazy load components
const ViewDetailEvent = lazy(() => import("./ViewDetailEvent"));
const CreateEventModal = lazy(() => import("./CreateEventModal"));
const CheckinPhoneNumberDialog = lazy(
  () => import("./CheckinPhoneNumberDialog")
);

export default function EventTable() {
  const {
    list = [],
    loadingList,
    loadAll,
    pagination,
    finalizeEventById,
    finalizing,
    submitCheckinDetailData,
    submittingCheckin,
    approveEventById,
    approving,
  } = useEvents();

  const { user } = useUserProfile();
  const studentId = user?.id;

  // 🌟 State
  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [currentCheckinEvent, setCurrentCheckinEvent] =
    useState<EventForCheckin | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<
    "approve" | "finalize" | null
  >(null);
  const [pendingEventId, setPendingEventId] = useState<string | null>(null);
  const [pendingEventTitle, setPendingEventTitle] = useState("");

  const totalPages = pagination?.totalPages || 0;
  const totalElements = pagination?.totalElements || 0;
  const currentPage = pagination?.currentPage || 0;
  const isLastPage = pagination?.isLastPage || false;

  // 🌟 Filtered events
  const filteredEvents = Array.isArray(list)
    ? list.filter((e) => e.title?.toLowerCase().includes(search.toLowerCase()))
    : [];

  // 🌟 Handlers
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

  const openConfirm = (
    action: "approve" | "finalize",
    eventId: string,
    eventTitle: string
  ) => {
    setPendingAction(action);
    setPendingEventId(eventId);
    setPendingEventTitle(eventTitle);
    setConfirmOpen(true);
  };

  const handleConfirmAction = async () => {
    if (!pendingAction || !pendingEventId) return;

    try {
      if (pendingAction === "approve") {
        const result = await approveEventById(pendingEventId);
        if (result)
          toast.success(`Sự kiện "${pendingEventTitle}" đã được duyệt.`);
        else toast.error(`Duyệt sự kiện thất bại.`);
      } else if (pendingAction === "finalize") {
        const result = await finalizeEventById(pendingEventId);
        if (result)
          toast.success(
            `Phần thưởng cho sự kiện "${pendingEventTitle}" đã được phân phối.`
          );
        else toast.error(`Finalize thất bại.`);
      }
    } catch {
      toast.error("Đã có lỗi xảy ra.");
    } finally {
      setConfirmOpen(false);
      setPendingAction(null);
      setPendingEventId(null);
      setPendingEventTitle("");
      loadAll({ page: currentPage, search });
    }
  };

  const openCheckinModal = useCallback(
    (event: { id: string; title: string }) => {
      if (!studentId) {
        toast.error("Vui lòng đăng nhập để thực hiện thao tác check-in.");
        return;
      }
      setCurrentCheckinEvent({
        id: event.id,
        title: event.title,
        studentId,
        studentName: user?.fullName || "Sinh viên",
      });
      setIsCheckinModalOpen(true);
    },
    [studentId, user?.fullName]
  );
  const handleCheckinSubmit = useCallback(
    async (payload: { eventId: string; phoneNumber: string }) => {
      if (!currentCheckinEvent) return;

      const { eventId, phoneNumber } = payload;

      try {
        const fullPayload: EventCheckinDetail & { phoneNumber: string } = {
          checkinId: "",
          eventId,
          eventTitle: currentCheckinEvent.title,
          studentId: Number(currentCheckinEvent.studentId),
          studentName: currentCheckinEvent.studentName,
          registrationTime: new Date().toISOString(),
          verified: false,
          depositPaid: 0,
          phoneNumber,
        };

        const result = await submitCheckinDetailData(fullPayload);

        if (result) {
          toast.success(
            `Bạn đã check-in cho sự kiện ${currentCheckinEvent.title} với SĐT: ${phoneNumber}`
          );
          setIsCheckinModalOpen(false);
          setCurrentCheckinEvent(null);
        } else {
          toast.error("Check-in thất bại.");
        }
      } catch {
        toast.error("Đã có lỗi xảy ra khi check-in.");
      }
    },
    [submitCheckinDetailData, currentCheckinEvent]
  );

  // 🌟 Badge
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

  // 🌟 Pagination numbers
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

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý sự kiện
              </h1>
              <p className="text-lg text-gray-600">
                Admin quản lý các sự kiện (Tổng:{" "}
                <strong>{totalElements}</strong>)
              </p>
            </div>
            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              <Input
                placeholder="Tìm kiếm sự kiện..."
                value={search}
                onChange={handleSearch}
                className="w-[200px] rounded-lg shadow-sm"
              />
              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md"
              >
                <PlusCircle className="h-4 w-4" />
                Tạo sự kiện
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-gray-200 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead className="min-w-[250px] px-6 py-3 text-gray-700 font-semibold">
                    Tên sự kiện
                  </TableHead>
                  <TableHead className="min-w-[150px] px-6 py-3 text-gray-700 font-semibold">
                    Đối tác
                  </TableHead>
                  <TableHead className="min-w-[150px] px-6 py-3 text-gray-700 font-semibold">
                    Địa điểm
                  </TableHead>
                  <TableHead className="min-w-[200px] px-6 py-3 text-gray-700 font-semibold">
                    Thời gian
                  </TableHead>
                  <TableHead className="min-w-[100px] px-6 py-3 text-gray-700 font-semibold">
                    Trạng thái
                  </TableHead>
                  <TableHead className="min-w-[150px] px-6 py-3 text-gray-700 font-semibold">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingList ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="text-center py-6 text-gray-500"
                    >
                      <RotateCw className="inline animate-spin mr-2 h-4 w-4" />
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
                        {/* Approve */}
                        {event.status === "DRAFT" && (
                          <Button
                            size="sm"
                            disabled={approving}
                            className="flex items-center gap-1 p-2 rounded-full bg-green-500 hover:bg-green-600 shadow-md"
                            onClick={() =>
                              openConfirm("approve", event.id, event.title)
                            }
                          >
                            <CheckSquare className="h-4 w-4" />
                          </Button>
                        )}
                        {/* Finalize */}
                        {(event.status === "ACTIVE" ||
                          event.status === "FINISHED") && (
                          <Button
                            size="sm"
                            disabled={finalizing}
                            className="flex items-center gap-1 p-2 rounded-full bg-purple-500 hover:bg-purple-600 shadow-md"
                            onClick={() =>
                              openConfirm("finalize", event.id, event.title)
                            }
                          >
                            <Zap className="h-4 w-4" />
                          </Button>
                        )}
                        {/* Checkin */}
                        {studentId && event.status === "ACTIVE" && (
                          <Button
                            size="sm"
                            disabled={submittingCheckin}
                            className="flex items-center gap-1 p-2 rounded-full border-green-500 text-green-500 hover:bg-green-100 shadow-md"
                            onClick={() => openCheckinModal(event)}
                          >
                            <CheckSquare className="h-4 w-4" />
                          </Button>
                        )}
                        {/* View */}
                        <Button
                          size="sm"
                          className="flex items-center gap-1 p-2 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white shadow-md"
                          onClick={() => setSelectedEvent(event.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
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

      {/* Confirm Dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingAction === "approve"
                ? "Xác nhận duyệt sự kiện"
                : "Xác nhận kết thúc sự kiện"}
            </DialogTitle>
            <DialogDescription>
              {pendingAction === "approve"
                ? `Bạn có chắc muốn duyệt sự kiện "${pendingEventTitle}" không?`
                : `Bạn có chắc muốn kết thúc và phân phối phần thưởng cho sự kiện "${pendingEventTitle}" không?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleConfirmAction}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Lazy Modals */}
      <Suspense fallback={<div>Đang tải chi tiết sự kiện...</div>}>
        {selectedEvent && (
          <ViewDetailEvent
            eventId={selectedEvent}
            open={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        )}
      </Suspense>

      <Suspense fallback={<div>Đang tải form tạo sự kiện...</div>}>
        {isCreateModalOpen && (
          <CreateEventModal
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={() => {
              setIsCreateModalOpen(false);
              loadAll({ page: currentPage, search });
            }}
          />
        )}
      </Suspense>

      <Suspense fallback={<div>Đang tải form check-in...</div>}>
        {currentCheckinEvent && (
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
