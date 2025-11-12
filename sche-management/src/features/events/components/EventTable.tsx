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

// Import AlertDialog Components (Giả định từ shadcn/ui)
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { useEvents } from "../hooks/useEvents";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { toast } from "sonner";
import { EventCheckinDetail, EventForCheckin } from "../types/events";

const ViewDetailEvent = lazy(() => import("./ViewDetailEvent"));
const CreateEventModal = lazy(() => import("./CreateEventModal"));
const CheckinPhoneNumberDialog = lazy(
  () => import("./CheckinPhoneNumberDialog")
);

export default function EventTable() {
  const { user } = useUserProfile();
  const userId = user?.id || "";

  // Lấy tất cả các state và hàm cần thiết từ hook
  const {
    list = [],
    loadingList,
    loadAll,
    pagination,
    submitCheckinDetailData,
    submittingCheckin,
    approveEventById,
    finalizeEventById,
    deleteEventById,
    approving,
    finalizing,
    deleting, // Trạng thái loading khi xóa
  } = useEvents();

  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);
  const [currentCheckinEvent, setCurrentCheckinEvent] =
    useState<EventForCheckin | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);

  // State theo dõi sự kiện đang được xử lý Approve/Finalize/Delete
  const [processingEventId, setProcessingEventId] = useState<string | null>(
    null
  );

  // State cho Delete
  const [eventToDelete, setEventToDelete] = useState<{
    id: string;
    title: string;
  } | null>(null);

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

      try {
        const result = await submitCheckinDetailData(fullPayload);
        if (result) {
          toast.success(
            `Bạn đã check-in cho sự kiện ${currentCheckinEvent.title} với SĐT: ${payload.phoneNumber}`
          );
          setIsCheckinModalOpen(false);
          setCurrentCheckinEvent(null);
        } else {
          toast.error("Check-in thất bại.");
        }
      } catch (e) {
        const errorMessage =
          (e as any)?.message || "Đã có lỗi xảy ra khi check-in.";
        toast.error(errorMessage);
      }
    },
    [submitCheckinDetailData, currentCheckinEvent]
  );

  const handleApprove = useCallback(
    async (eventId: string, eventTitle: string) => {
      setProcessingEventId(eventId);
      try {
        // BƯỚC 1: Duyệt sự kiện
        await approveEventById(eventId);

        // BƯỚC 2: Tải lại danh sách
        await loadAll({ page: currentPage, search: search || undefined });

        // BƯỚC 3: Thông báo thành công (chỉ khi cả hai bước trên OK)
        toast.success(`Đã duyệt sự kiện: ${eventTitle}`);
      } catch (error) {
        // BẮT LỖI
        const errorMessage =
          (error as any)?.message || `Duyệt sự kiện ${eventTitle} thất bại.`;
        toast.error(errorMessage);
        console.error("Lỗi khi duyệt/cập nhật sự kiện:", error);
      } finally {
        setProcessingEventId(null);
      }
    },
    [approveEventById, loadAll, currentPage, search]
  );

  const handleFinalize = useCallback(
    async (eventId: string, eventTitle: string) => {
      setProcessingEventId(eventId);
      try {
        // BƯỚC 1: Chốt sự kiện
        await finalizeEventById(eventId);

        // BƯỚC 2: Tải lại danh sách
        await loadAll({ page: currentPage, search: search || undefined });

        // BƯỚC 3: Thông báo thành công
        toast.success(`Đã chốt (Finalize) sự kiện: ${eventTitle}`);
      } catch (error) {
        const errorMessage =
          (error as any)?.message || `Chốt sự kiện ${eventTitle} thất bại.`;
        toast.error(errorMessage);
        console.error("Lỗi khi chốt sự kiện:", error);
      } finally {
        setProcessingEventId(null);
      }
    },
    [finalizeEventById, loadAll, currentPage, search]
  );

  // Xử lý Xóa sự kiện
  const confirmDeleteEvent = useCallback(async () => {
    if (!eventToDelete) return;

    // Dùng processingEventId để hiển thị loading cho nút xóa
    setProcessingEventId(eventToDelete.id);
    try {
      // BƯỚC 1: Xóa sự kiện
      await deleteEventById(eventToDelete.id);

      // BƯỚC 2: Tải lại danh sách
      await loadAll({ page: currentPage, search: search || undefined });

      // BƯỚC 3: Thông báo thành công
      toast.success(`Đã xóa sự kiện: ${eventToDelete.title}`);

      setEventToDelete(null); // Đóng modal và reset state
    } catch (error) {
      const errorMessage =
        (error as any)?.message ||
        `Xóa sự kiện ${eventToDelete.title} thất bại.`;
      toast.error(errorMessage);
      console.error("Lỗi khi xóa sự kiện:", error);
    } finally {
      setProcessingEventId(null);
    }
  }, [deleteEventById, eventToDelete, loadAll, currentPage, search]);

  const handleDelete = (id: string, title: string) => {
    setEventToDelete({ id, title });
  };

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

  // Logic kiểm tra loading cho Approve/Finalize/Delete
  const isProcessingApprovalOrFinalize = (eventId: string) =>
    (approving || finalizing) && processingEventId === eventId;

  // Logic kiểm tra loading cho Delete (kiểm tra `deleting` và `processingEventId` khớp)
  const isDeletingEvent = (eventId: string) =>
    deleting && processingEventId === eventId;

  // Logic kiểm tra loading cho Check-in
  const isCheckingIn = (eventId: string) =>
    submittingCheckin &&
    currentCheckinEvent?.id === eventId &&
    isCheckinModalOpen;

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          {/* Header và Controls */}
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

              <Button
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-md"
              >
                <PlusCircle className="h-4 w-4" />
                Tạo sự kiện
              </Button>
            </div>
          </div>

          {/* Event Table */}
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
                  filteredEvents.map((event) => {
                    const isProcessing = isProcessingApprovalOrFinalize(
                      event.id
                    );
                    const isDeleteLoading = isDeletingEvent(event.id);
                    const isCheckinLoading = isCheckingIn(event.id);

                    // Disable chung khi có bất kỳ hành động nào đang diễn ra trên sự kiện này
                    const globalDisabled = isProcessing || isDeleteLoading;

                    return (
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

                        {/* CỘT HÀNH ĐỘNG */}
                        <TableCell className="px-6 py-4 flex gap-2">
                          {/* 1. Nút Xem chi tiết */}
                          <Button
                            size="sm"
                            className="flex items-center gap-1 p-2 rounded-full border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white shadow-md"
                            onClick={() => setSelectedEvent(event.id)}
                            disabled={globalDisabled || isCheckinLoading}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          {/* 2. Nút Duyệt (Approve) - Chỉ hiển thị khi DRAFT */}
                          {event.status === "DRAFT" && (
                            <Button
                              size="sm"
                              className="flex items-center gap-1 p-2 rounded-full border-2 border-blue-500 text-blue-500 hover:bg-blue-100 shadow-md"
                              onClick={() =>
                                handleApprove(event.id, event.title)
                              }
                              disabled={globalDisabled || isCheckinLoading}
                            >
                              {isProcessing ? (
                                <RotateCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <ThumbsUp className="h-4 w-4" />
                              )}
                            </Button>
                          )}

                          {/* 3. Nút Check-in - Chỉ hiển thị khi ACTIVE */}
                          {event.status === "ACTIVE" && (
                            <Button
                              size="sm"
                              className="flex items-center gap-1 p-2 rounded-full border-2 border-green-500 text-green-500 hover:bg-green-100 shadow-md"
                              onClick={() => openCheckinModal(event)}
                              disabled={isCheckinLoading || globalDisabled}
                            >
                              {isCheckinLoading ? (
                                <RotateCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <CheckSquare className="h-4 w-4" />
                              )}
                            </Button>
                          )}

                          {/* 4. Nút Chốt (Finalize) - Chỉ hiển thị khi ACTIVE */}
                          {event.status === "ACTIVE" && (
                            <Button
                              size="sm"
                              className="flex items-center gap-1 p-2 rounded-full border-2 border-purple-500 text-purple-500 hover:bg-purple-100 shadow-md"
                              onClick={() =>
                                handleFinalize(event.id, event.title)
                              }
                              disabled={globalDisabled || isCheckinLoading}
                            >
                              {isProcessing ? (
                                <RotateCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Lock className="h-4 w-4" />
                              )}
                            </Button>
                          )}

                          {/* 5. Nút Xóa (Delete) - Chỉ hiển thị khi DRAFT */}
                          {event.status === "DRAFT" && (
                            <Button
                              size="sm"
                              variant="destructive"
                              className="flex items-center gap-1 p-2 rounded-full bg-red-100 border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white shadow-md"
                              onClick={() =>
                                handleDelete(event.id, event.title)
                              }
                              disabled={globalDisabled || isCheckinLoading}
                            >
                              {isDeleteLoading ? (
                                <RotateCw className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
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

      {/* AlertDialog cho chức năng Xóa */}
      <AlertDialog
        open={!!eventToDelete}
        onOpenChange={() => setEventToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Xác nhận xóa sự kiện{" "}
              <span className="text-red-600">"{eventToDelete?.title}"</span>?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sự kiện này không? Hành động này không
              thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteEvent}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? (
                <>
                  <RotateCw className="mr-2 h-4 w-4 animate-spin" /> Đang xóa...
                </>
              ) : (
                "Xác nhận Xóa"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modals cho Xem chi tiết, Tạo sự kiện, và Check-in */}
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
            partnerId={userId.toString()}
          />
        )}
      </Suspense>

      <Suspense fallback={<div>Đang tải form check-in...</div>}>
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
