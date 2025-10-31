"use client";

import { useState, Suspense, lazy } from "react";
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
import { Eye, Plus, Trash2 } from "lucide-react";
import { useEvents } from "../hooks/useEvents";

const ViewDetailEvent = lazy(() => import("./ViewDetailEvent"));

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
  } = useEvents();

  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const filteredEvents = Array.isArray(list)
    ? list.filter((e) => e.title?.toLowerCase().includes(search.toLowerCase()))
    : [];

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearch(keyword);
  };

  const handlePageChange = (page: number) => {
    if (loadingList) return;

    if (page >= 0 && page < totalPages) {
      loadAll({ page: page, search: search || undefined });
    }
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

    for (let i = startPage; i < endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          {/* Header + Search + Tạo mới */}
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý sự kiện
              </h1>
              <p className="text-lg text-gray-600">
                Admin quản lý các sự kiện (Tổng: {totalElements})
              </p>
            </div>

            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              <Input
                placeholder="Tìm kiếm sự kiện..."
                value={search}
                onChange={handleSearch}
                className="w-[200px]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="text-white bg-gray-100 hover:bg-gray-100">
                  <TableHead className="px-6 py-3 text-gray-700">
                    Tên sự kiện
                  </TableHead>
                  <TableHead className="px-6 py-3 text-gray-700">
                    Đối tác
                  </TableHead>
                  <TableHead className="px-6 py-3 text-gray-700">
                    Địa điểm
                  </TableHead>
                  <TableHead className="px-6 py-3 text-gray-700">
                    Thời gian
                  </TableHead>
                  <TableHead className="px-6 py-3 text-gray-700">
                    Trạng thái
                  </TableHead>
                  <TableHead className="px-6 py-3 text-gray-700">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingList ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Đang tải danh sách sự kiện...
                    </TableCell>
                  </TableRow>
                ) : filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6">
                      Không có sự kiện nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="px-6 py-4 font-medium">
                        {event.title}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {event.partnerName || "-"}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {event.location}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-sm">
                        {new Date(event.startTime).toLocaleString()} -{" "}
                        {new Date(event.endTime).toLocaleString()}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            event.status === "ACTIVE"
                              ? "bg-green-100 text-green-800"
                              : event.status === "DRAFT"
                              ? "bg-gray-100 text-gray-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {event.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 flex gap-2">
                        {/* View Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 px-2 py-1 rounded-md
                                                    border-2 border-orange-500 text-orange-500 font-medium
                                                    transition-all duration-200
                                                    hover:bg-orange-500 hover:text-white hover:scale-105
                                                    active:scale-95 shadow-sm"
                          onClick={() => setSelectedEvent(event.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        {/* Delete Button */}
                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1 px-2 py-1 rounded-md 
                                                    bg-red-500 text-white font-medium
                                                    transition-all duration-200
                                                    hover:bg-red-600 hover:scale-105 active:scale-95 shadow-sm"
                          disabled={deleting}
                          onClick={() => {
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

          {/* PHÂN TRANG SHADCN/UI */}
          {totalPages > 0 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Hiển thị {filteredEvents.length} trên tổng số **{totalElements}
                ** sự kiện.
              </div>

              <Pagination>
                <PaginationContent>
                  {/* Nút Previous */}
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

                  {/* Các nút số trang */}
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

                  {/* Nút Next */}
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
          {/* KẾT THÚC PHÂN TRANG */}
        </div>
      </section>

      {/* Modal chi tiết */}
      {selectedEvent !== null && (
        <ViewDetailEvent
          eventId={selectedEvent}
          open={selectedEvent !== null}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </main>
  );
}
