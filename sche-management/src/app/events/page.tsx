"use client";

import React, { useState, useEffect } from "react";
import { useEvents } from "@/features/events/hooks/useEvents";
import PublicNavbar from "@/components/PublicNavbar";
import type { Event } from "@/features/events/types/events";
import EventsSearchBar from "./components/EventsSearchBar";
import CategoryFilters from "./components/CategoryFilters";
import EventsGrid from "./components/EventsGrid";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

export default function EventsPage() {
  const {
    list: events = [],
    loadingList,
    pagination,
    loadAll,
    eventCategories: allCategories = [],
  } = useEvents();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Store all events without category filter for category count calculation
  const [overrideEvents, setOverrideEvents] = useState<Event[] | null>(null);
  const [allEventsForCount, setAllEventsForCount] = useState<Event[]>([]);
  // Track when async filter operations are running
  const [isFiltering, setIsFiltering] = useState(false);
  // Client-side pagination
  const [clientPage, setClientPage] = useState<number>(1);
  const PAGE_SIZE = 9;

  const baseEvents = overrideEvents ?? events;
  const skeletonItems = Array.from({ length: 6 });
  // Show skeleton when loading (either from Redux or local async operations)
  const showSkeleton = loadingList || isFiltering;

  // Calculate category count from allEventsForCount (without category filter)
  // Use allEventsForCount if available, otherwise use baseEvents only if no category is selected
  const eventsForCategoryCount = 
    allEventsForCount.length > 0 
      ? allEventsForCount 
      : selectedCategory === null 
        ? baseEvents 
        : allEventsForCount; // If category is selected but allEventsForCount is empty, wait for it to be loaded
  const categoryIdToCount = eventsForCategoryCount.reduce<Record<string, number>>(
    (acc, ev) => {
      const id = ev.category?.id;
      if (typeof id === "string" && id) acc[id] = (acc[id] || 0) + 1;
      return acc;
    },
    {}
  );
  const eventCategories = allCategories.filter(
    (cat) => (categoryIdToCount[cat.id] || 0) > 0
  );

  const filteredEvents = baseEvents.filter((event) => {
    const matchSearch =
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategory = selectedCategory
      ? event.category?.id === selectedCategory
      : true;

    return matchSearch && matchCategory;
  });

  // Calculate pagination - always use client-side pagination
  const currentPage = clientPage;
  const totalPages = Math.ceil(filteredEvents.length / PAGE_SIZE) || 1;
  
  // Slice events for client-side pagination
  const displayEvents = filteredEvents.slice(
    (clientPage - 1) * PAGE_SIZE,
    clientPage * PAGE_SIZE
  );

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    setClientPage(1); // Reset to first page when search changes

    setIsFiltering(true);

    try {
      // Load only ACTIVE events without category filter for category count
      const aAll = await loadAll({
        page: 0,
        search: keyword,
        status: "ACTIVE" as const,
      });
      const arrAAll: Event[] = Array.isArray(aAll)
        ? (aAll as Event[])
        : ((aAll as any)?.data ?? (aAll as any)?.content ?? []);
      setAllEventsForCount(arrAAll);

      // Load events with category filter for display
      if (selectedCategory) {
        const a = await loadAll({
          page: 0,
          search: keyword,
          status: "ACTIVE" as const,
          categoryId: selectedCategory,
        });
        const arrA: Event[] = Array.isArray(a)
          ? (a as Event[])
          : ((a as any)?.data ?? (a as any)?.content ?? []);
        setOverrideEvents(arrA);
      } else {
        setOverrideEvents(arrAAll);
      }
    } finally {
      setIsFiltering(false);
    }
  };

  const handleCategoryFilter = async (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setClientPage(1); // Reset to first page when category changes

    setIsFiltering(true);

    try {
      if (categoryId) {
        // Load only ACTIVE events with category filter for display
        const a = await loadAll({
          page: 0,
          search: searchTerm || undefined,
          categoryId: categoryId,
          status: "ACTIVE" as const,
        });
        const arrA: Event[] = Array.isArray(a)
          ? (a as Event[])
          : ((a as any)?.data ?? (a as any)?.content ?? []);
        setOverrideEvents(arrA);
      } else {
        // Show all events (use allEventsForCount if available, otherwise load)
        if (allEventsForCount.length > 0) {
          setOverrideEvents(allEventsForCount);
        } else {
          // Load only ACTIVE events
          const a = await loadAll({
            page: 0,
            search: searchTerm || undefined,
            status: "ACTIVE" as const,
          });
          const arrA: Event[] = Array.isArray(a)
            ? (a as Event[])
            : ((a as any)?.data ?? (a as any)?.content ?? []);
          setOverrideEvents(arrA);
          setAllEventsForCount(arrA);
        }
      }
    } finally {
      setIsFiltering(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (loadingList || page < 1 || page > totalPages) return;
    // Client-side pagination
    setClientPage(page);
    // Scroll to top of events section
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    let startPage = 1, // 1-based
      endPage = totalPages;

    if (totalPages > maxPagesToShow) {
      const half = Math.floor(maxPagesToShow / 2);
      if (currentPage <= half) {
        startPage = 1;
        endPage = maxPagesToShow;
      } else if (currentPage + half >= totalPages) {
        startPage = totalPages - maxPagesToShow + 1;
        endPage = totalPages;
      } else {
        startPage = currentPage - half;
        endPage = currentPage + half;
      }
    }

    for (let i = startPage; i <= endPage; i++) pages.push(i);
    return pages;
  };


  useEffect(() => {
    (async () => {
      // Load only ACTIVE events
      const a = await loadAll({ page: 0, status: "ACTIVE" as const });
      const arrA: Event[] = Array.isArray(a)
        ? (a as Event[])
        : ((a as any)?.data ?? (a as any)?.content ?? []);
      // Set allEventsForCount for category count calculation (without category filter)
      setAllEventsForCount(arrA);
      setOverrideEvents(arrA);
    })();
  }, [loadAll]);

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <EventsSearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
      />

      {/* Event Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <CategoryFilters
            categories={eventCategories}
            selectedCategory={selectedCategory}
            categoryIdToCount={categoryIdToCount}
            totalCount={eventsForCategoryCount.length}
            onCategoryFilter={handleCategoryFilter}
          />

          <EventsGrid
            events={displayEvents}
            loading={showSkeleton}
            skeletonCount={skeletonItems.length}
            queryKey={`${searchTerm}-${selectedCategory ?? "all"}-${currentPage}`}
          />
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center py-8">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => handlePageChange(currentPage - 1)}
                  className={
                    loadingList || currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                />
              </PaginationItem>
              {(() => {
                const pageNumbers = getPageNumbers();
                const items: React.ReactNode[] = [];
                
                // Show first page and ellipsis if needed
                if (pageNumbers[0] > 1) {
                  items.push(
                    <PaginationItem key={1}>
                      <PaginationLink
                        onClick={() => handlePageChange(1)}
                        className="cursor-pointer"
                      >
                        1
                      </PaginationLink>
                    </PaginationItem>
                  );
                  if (pageNumbers[0] > 2) {
                    items.push(
                      <PaginationItem key="ellipsis-start">
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                }
                
                // Show page numbers
                pageNumbers.forEach((pageNum) => {
                  items.push(
                    <PaginationItem key={pageNum}>
                      <PaginationLink
                        onClick={() => handlePageChange(pageNum)}
                        isActive={pageNum === currentPage}
                        className="cursor-pointer"
                      >
                        {pageNum}
                      </PaginationLink>
                    </PaginationItem>
                  );
                });
                
                // Show ellipsis and last page if needed
                const lastPageNum = pageNumbers[pageNumbers.length - 1];
                if (lastPageNum < totalPages) {
                  if (lastPageNum < totalPages - 1) {
                    items.push(
                      <PaginationItem key="ellipsis-end">
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  items.push(
                    <PaginationItem key={totalPages}>
                      <PaginationLink
                        onClick={() => handlePageChange(totalPages)}
                        className="cursor-pointer"
                      >
                        {totalPages}
                      </PaginationLink>
                    </PaginationItem>
                  );
                }
                
                return items;
              })()}
              <PaginationItem>
                <PaginationNext
                  onClick={() => handlePageChange(currentPage + 1)}
                  className={
                    loadingList || currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
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
