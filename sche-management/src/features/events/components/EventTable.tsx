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
// Imports cho Dialog đã được loại bỏ ở đây vì chúng đã được chuyển sang component CheckinPhoneNumberDialog.
import { Eye, Trash2, CheckSquare, Zap, RotateCw } from "lucide-react";
import { useEvents } from "../hooks/useEvents";
import { useUserProfile } from "@/features/auth/hooks/useUserProfile";
import { toast } from "sonner";

import type { EventCheckinDetail } from "../types/events";
import {
  finalizeEvent,
  checkinByPhoneNumber as submitCheckinDetail,
} from "../thunks/eventThunks";

// 🌟 IMPORT COMPONENT MỚI ĐÃ TÁCH
import CheckinPhoneNumberDialog from "./CheckinPhoneNumberDialog";

const ViewDetailEvent = lazy(() => import("./ViewDetailEvent"));

// Hàm giả định cho trạng thái (giữ nguyên)
const getStatusBadge = (status: string) => {
  let classes = "";
  switch (status) {
    case "ACTIVE":
      classes = "bg-green-100 text-green-800";
      break;
    case "DRAFT":
      classes = "bg-blue-100 text-blue-800";
      break;
    case "FINISHED":
      classes = "bg-gray-100 text-gray-800";
      break;
    case "CANCELLED":
      classes = "bg-red-100 text-red-800";
      break;
    case "FINALIZED":
      classes = "bg-purple-100 text-purple-800";
      break;
    default:
      classes = "bg-gray-200 text-gray-700";
  }
  return (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full ${classes}`}>
      {status}
    </span>
  );
};

// ========================================================
// 🌟 EVENT TABLE COMPONENT
// ========================================================

export default function EventTable() {
  const {
    list = [],
    loadingList,
    deleting,
    deleteEventById,
    loadAll,
    currentPage,
    totalPages,
    totalElements,
    isLastPage,
    finalizeEventById,
    finalizing,
    submitCheckinDetailData,
    submittingCheckin,
  } = useEvents();

  const { user } = useUserProfile();
  const studentId = user?.id; // Lấy studentId từ user.id

  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);

  // 🌟 STATE MỚI CHO MODAL CHECK-IN
  const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
  const [currentCheckinEvent, setCurrentCheckinEvent] = useState<{
    id: number;
    title: string;
    studentId: number;
    studentName: string;
  } | null>(null);

  const filteredEvents = Array.isArray(list)
    ? list.filter((e) => e.title?.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearch(keyword);
    loadAll({ page: 0, search: keyword || undefined });
  };

  const handlePageChange = (page: number) => {
    if (loadingList) return;

    const apiPage = page + 1;

    if (page >= 0 && page < totalPages) {
      loadAll({ page: apiPage, search: search || undefined });
    }
  };

  const handleFinalize = useCallback(
    async (eventId: number, eventTitle: string) => {
      // NOTE: Đã giữ lại window.confirm như trong code gốc, mặc dù khuyến nghị dùng custom modal
      if (
        !window.confirm(
          `Xác nhận kết thúc và phân phối phần thưởng cho sự kiện "${eventTitle}"?`
        )
      ) {
        return;
      }
      const result = await finalizeEventById(eventId);
      if (finalizeEvent.fulfilled.match(result)) {
        toast.success("Finalize thành công! Phần thưởng đã được phân phối.");
        loadAll({ page: currentPage + 0, search: search || undefined }); // Reload trang hiện tại
      } else {
        toast.error(`Finalize thất bại: ${result.payload}`);
      }
    },
    [finalizeEventById, loadAll, currentPage, search]
  );

  // 🌟 HÀM MỞ MODAL CHECK-IN
  const openCheckinModal = useCallback(
    (event: { id: number; title: string }) => {
      if (!studentId) {
        toast.error("Vui lòng đăng nhập để thực hiện thao tác check-in.");
        return;
      }
      setCurrentCheckinEvent({
        id: event.id,
        title: event.title,
        studentId: studentId,
        studentName: user?.fullName || "Sinh viên",
      });
      setIsCheckinModalOpen(true);
    },
    [studentId, user?.fullName]
  );

  // 🌟 HÀM XỬ LÝ SUBMIT TỪ MODAL
  const handleCheckinSubmit = useCallback(
    async (eventId: number, phoneNumber: string) => {
      if (!currentCheckinEvent) return;

      const checkinData: EventCheckinDetail = {
        checkinId: 0,
        eventId: eventId,
        eventTitle: currentCheckinEvent.title,
        studentId: currentCheckinEvent.studentId,
        studentName: currentCheckinEvent.studentName,
        registrationTime: new Date().toISOString(),
        verified: true,
        depositPaid: 0,
        phoneNumber: phoneNumber,
      } as EventCheckinDetail & { phoneNumber: string };

      const result = await submitCheckinDetailData(checkinData);

      if (submitCheckinDetail.fulfilled.match(result)) {
        toast.success("Check-in thành công!", {
          description: `Bạn đã check-in cho sự kiện ${currentCheckinEvent.title} với SĐT: ${phoneNumber}`,
        });
        setIsCheckinModalOpen(false); // Đóng modal khi thành công
        setCurrentCheckinEvent(null);
      } else {
        const errorMessage =
          typeof result.payload === "string"
            ? result.payload
            : "Đã xảy ra lỗi không xác định.";
        toast.error(`Check-in thất bại: ${errorMessage}`);
      }
    },
    [submitCheckinDetailData, currentCheckinEvent]
  );

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

    for (let i = startPage; i < endPage; i++) {
      pages.push(i);
    }
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
                Admin quản lý các sự kiện (Tổng: **{totalElements}**)
              </p>
            </div>

            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              <Input
                placeholder="Tìm kiếm sự kiện..."
                value={search}
                onChange={handleSearch}
                className="w-[200px] rounded-lg shadow-sm"
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="text-white bg-gray-50 hover:bg-gray-50">
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
                    <TableRow
                      key={event.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
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
                      <TableCell className="px-6 py-4">
                        {getStatusBadge(event.status)}
                      </TableCell>

                      <TableCell className="px-6 py-4 flex gap-2">
                        {(event.status === "ACTIVE" ||
                          event.status === "FINISHED") && (
                          <Button
                            variant="default"
                            size="sm"
                            title="Kết thúc và phân phối phần thưởng"
                            disabled={finalizing}
                            className="flex items-center gap-1 p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition-all duration-200 shadow-md"
                            onClick={() =>
                              handleFinalize(event.id, event.title)
                            }
                          >
                            <Zap className="h-4 w-4" />
                          </Button>
                        )}

                        {studentId && event.status === "ACTIVE" && (
                          <Button
                            variant="outline"
                            size="sm"
                            title="Check-in sự kiện (Bằng SĐT)"
                            disabled={submittingCheckin}
                            className="flex items-center gap-1 p-2 rounded-full border-green-500 text-green-500 hover:bg-green-100 transition-all duration-200 shadow-md"
                            onClick={() => openCheckinModal(event)} // 🌟 MỞ MODAL
                          >
                            <CheckSquare className="h-4 w-4" />
                          </Button>
                        )}

                        <Button
                          variant="outline"
                          size="sm"
                          title="Xem chi tiết sự kiện"
                          className="flex items-center gap-1 p-2 rounded-full
                                          border-2 border-orange-500 text-orange-500 font-medium
                                          transition-all duration-200
                                          hover:bg-orange-500 hover:text-white hover:scale-105
                                          active:scale-95 shadow-md"
                          onClick={() => setSelectedEvent(event.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          title="Xóa sự kiện"
                          className="flex items-center gap-1 p-2 rounded-full 
                                          bg-red-500 text-white font-medium
                                          transition-all duration-200
                                          hover:bg-red-600 hover:scale-105 active:scale-95 shadow-md"
                          disabled={deleting}
                          onClick={() => {
                            // Khuyến nghị dùng custom modal thay vì window.confirm
                            if (
                              window.confirm(
                                `Bạn có chắc chắn muốn xóa sự kiện "${event.title}" (ID: ${event.id})?`
                              )
                            ) {
                              deleteEventById(event.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {totalPages > 0 && (
            <div className="flex justify-between items-center mt-6 flex-wrap">
              <div className="text-sm text-gray-600 mb-2 md:mb-0">
                Hiển thị {filteredEvents.length} trên tổng số **{totalElements}
                ** sự kiện.
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
                        className={
                          loadingList ? "pointer-events-none opacity-50" : ""
                        }
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

      {/* Modal chi tiết (View Detail) */}
      {selectedEvent !== null && (
        <Suspense fallback={<div>Đang tải chi tiết sự kiện...</div>}>
          <ViewDetailEvent
            eventId={selectedEvent}
            open={selectedEvent !== null}
            onClose={() => setSelectedEvent(null)}
          />
        </Suspense>
      )}

      {/* 🌟 MODAL NHẬP PHONE (Check-in) - Sử dụng component đã tách */}
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
    </main>
  );
}
