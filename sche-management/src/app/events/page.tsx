"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useEvents } from "@/features/events/hooks/useEvents";
import PublicNavbar from "@/components/PublicNavbar";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { motion } from "framer-motion";

export default function EventsPage() {
  const {
    list: events = [],
    loadingList,
    currentPage,
    totalPages,
    isLastPage,
    loadAll,
  } = useEvents();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  // Lấy danh sách category duy nhất
  const eventCategories = Array.from(
    new Map(events.map((e) => [e.category.id, e.category])).values()
  );

  // Filter events theo search + category
  const filteredEvents = events.filter((event) => {
    const matchSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory
      ? event.category.id === selectedCategory
      : true;
    return matchSearch && matchCategory;
  });

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    loadAll({
      page: 0,
      search: keyword,
      categoryId: selectedCategory || undefined,
    });
  };

  const handleCategoryFilter = (categoryId: number | null) => {
    setSelectedCategory(categoryId);
    loadAll({
      page: 0,
      search: searchTerm || undefined,
      categoryId: categoryId || undefined,
    });
  };

  const handlePageChange = (page: number) => {
    if (loadingList || page < 0 || page >= totalPages) return;
    loadAll({
      page,
      search: searchTerm || undefined,
      categoryId: selectedCategory || undefined,
    });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = 0,
      endPage = totalPages;

    if (totalPages > maxPagesToShow) {
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

  const getEventStatus = (event: (typeof events)[0]) => {
    return event.status || "DRAFT"; // default là DRAFT
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "bg-blue-100 text-blue-700"; // Nháp
      case "ACTIVE":
        return "bg-green-100 text-green-700"; // Đang diễn ra
      case "FINISHED":
        return "bg-gray-100 text-gray-700"; // Kết thúc
      case "CANCELLED":
        return "bg-red-100 text-red-700"; // Hủy
      default:
        return "bg-gray-200 text-gray-700"; // Không xác định
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "DRAFT":
        return "NHÁP";
      case "ACTIVE":
        return "ĐANG DIỄN RA";
      case "FINISHED":
        return "ĐÃ KẾT THÚC";
      case "CANCELLED":
        return "ĐÃ HỦY";
      default:
        return "KHÔNG XÁC ĐỊNH";
    }
  };

  useEffect(() => {
    loadAll({ page: 0 });
  }, [loadAll]);

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* Search & Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-6 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="text"
              placeholder="Tìm kiếm sự kiện..."
              value={searchTerm}
              onChange={handleSearch}
              className="pl-10 pr-4 py-3 rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <motion.div whileHover={{ scale: 1.05 }}>
              <Button
                variant={selectedCategory === null ? "default" : "outline"}
                onClick={() => handleCategoryFilter(null)}
              >
                Tất cả ({events.length})
              </Button>
            </motion.div>

            {eventCategories.map((cat) => (
              <motion.div key={cat.id} whileHover={{ scale: 1.05 }}>
                <Button
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  onClick={() => handleCategoryFilter(cat.id)}
                >
                  {cat.name} (
                  {events.filter((e) => e.category.id === cat.id).length})
                </Button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Event Grid */}
      <section className="py-12">
        <motion.div
          className="container mx-auto px-6 grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          key={searchTerm + selectedCategory}
        >
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const status = getEventStatus(event);
              return (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href={`/events/${event.id}`}>
                    <div className="bg-white rounded-xl shadow hover:shadow-lg transition-all duration-300 cursor-pointer p-6 border-2 border-transparent hover:border-orange-200 flex flex-col gap-2">
                      <h3 className="text-lg font-bold text-gray-800">
                        {event.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {event.partnerName}
                      </p>
                      <p className="text-gray-600">{event.location}</p>
                      <p className="text-sm text-gray-400">
                        {new Date(event.startTime).toLocaleDateString()} -{" "}
                        {new Date(event.endTime).toLocaleDateString()}
                      </p>

                      <Badge className={`${getStatusColor(status)} mt-2`}>
                        {getStatusText(status)}
                      </Badge>
                    </div>
                  </Link>
                </motion.div>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12 text-gray-500">
              Không tìm thấy sự kiện
            </div>
          )}
        </motion.div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-8">
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
                      loadingList
                        ? "pointer-events-none opacity-50"
                        : "transition transform hover:scale-105"
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
    </main>
  );
}
