"use client";

import React, { useState, useEffect } from "react";
import { useEvents } from "@/features/events/hooks/useEvents";
import PublicNavbar from "@/components/PublicNavbar";
import type { Event, EventStatusFilter } from "@/features/events/types/events";
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
  const [selectedStatus, setSelectedStatus] = useState<EventStatusFilter | null>(
    null
  );

  // API returns 1-based pages, but we need to handle 0-based internally for "all status" mode
  const [overrideEvents, setOverrideEvents] = useState<Event[] | null>(null);
  // Store all events without category filter for category count calculation
  const [allEventsForCount, setAllEventsForCount] = useState<Event[]>([]);
  // Track when async filter operations are running
  const [isFiltering, setIsFiltering] = useState(false);
  // Client-side pagination for "all status" mode
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

    const matchStatus = selectedStatus ? event.status === selectedStatus : true;

    if (selectedStatus === null && overrideEvents) {
      return matchSearch && matchCategory;
    }

    return matchSearch && matchCategory && matchStatus;
  });

  // Calculate pagination
  const isAllStatusMode = selectedStatus === null;
  const currentPage = isAllStatusMode ? clientPage : (pagination?.currentPage ?? 1);
  const totalPages = isAllStatusMode
    ? Math.ceil(filteredEvents.length / PAGE_SIZE) || 1
    : (pagination?.totalPages ?? 1);
  
  // Slice events for client-side pagination when in "all status" mode
  const displayEvents = isAllStatusMode
    ? filteredEvents.slice((clientPage - 1) * PAGE_SIZE, clientPage * PAGE_SIZE)
    : filteredEvents;

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);
    setClientPage(1); // Reset to first page when search changes

    setOverrideEvents(null);
    setIsFiltering(true);

    try {
      if (selectedStatus === null) {
      // Load all events without category filter for category count
      const [aAll, fAll] = await Promise.all([
        loadAll({
          page: 0,
          search: keyword,
          status: "ACTIVE" as const,
        }),
        loadAll({
          page: 0,
          search: keyword,
          status: "FINISHED" as const,
        }),
      ]);
      const arrAAll: Event[] = Array.isArray(aAll)
        ? (aAll as Event[])
        : ((aAll as any)?.data ?? (aAll as any)?.content ?? []);
      const arrFAll: Event[] = Array.isArray(fAll)
        ? (fAll as Event[])
        : ((fAll as any)?.data ?? (fAll as any)?.content ?? []);
      const mergedAll = [...arrAAll, ...arrFAll].filter(
        (ev, idx, self) => self.findIndex((x: any) => x.id === ev.id) === idx
      );
      setAllEventsForCount(mergedAll as Event[]);

      // Load events with category filter for display
      if (selectedCategory) {
        const [a, f] = await Promise.all([
          loadAll({
            page: 0,
            search: keyword,
            status: "ACTIVE" as const,
            categoryId: selectedCategory,
          }),
          loadAll({
            page: 0,
            search: keyword,
            status: "FINISHED" as const,
            categoryId: selectedCategory,
          }),
        ]);
        const arrA: Event[] = Array.isArray(a)
          ? (a as Event[])
          : ((a as any)?.data ?? (a as any)?.content ?? []);
        const arrF: Event[] = Array.isArray(f)
          ? (f as Event[])
          : ((f as any)?.data ?? (f as any)?.content ?? []);
        const merged = [...arrA, ...arrF].filter(
          (ev, idx, self) => self.findIndex((x: any) => x.id === ev.id) === idx
        );
        setOverrideEvents(merged as Event[]);
      } else {
        setOverrideEvents(mergedAll as Event[]);
      }
    } else {
      // Load all events without category filter for category count
      const allEventsResult = await loadAll({
        page: 1, // API uses 1-based
        size: 9,
        search: keyword,
        status: selectedStatus || undefined,
      });
      const arrAll: Event[] = Array.isArray(allEventsResult)
        ? (allEventsResult as Event[])
        : ((allEventsResult as any)?.data ?? (allEventsResult as any)?.content ?? []);
      setAllEventsForCount(arrAll);

      // Load events with category filter for display
      if (selectedCategory) {
        loadAll({
          page: 1, // API uses 1-based
          size: 9,
          search: keyword,
          status: selectedStatus || undefined,
          categoryId: selectedCategory,
        });
      } else {
        setOverrideEvents(null); // Use Redux state for pagination
      }
    }
    } finally {
      setIsFiltering(false);
    }
  };

  const handleCategoryFilter = async (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setClientPage(1); // Reset to first page when category changes

    // Don't update allEventsForCount here - it should remain unchanged
    // Only update display events (overrideEvents or loadAll with category filter)
    setIsFiltering(true);

    try {
      if (selectedStatus === null) {
      if (categoryId) {
        // Load events with category filter for display
        const [a, f] = await Promise.all([
          loadAll({
            page: 0,
            search: searchTerm || undefined,
            categoryId: categoryId,
            status: "ACTIVE" as const,
          }),
          loadAll({
            page: 0,
            search: searchTerm || undefined,
            categoryId: categoryId,
            status: "FINISHED" as const,
          }),
        ]);
        const arrA: Event[] = Array.isArray(a)
          ? (a as Event[])
          : ((a as any)?.data ?? (a as any)?.content ?? []);
        const arrF: Event[] = Array.isArray(f)
          ? (f as Event[])
          : ((f as any)?.data ?? (f as any)?.content ?? []);
        const merged = [...arrA, ...arrF].filter(
          (ev, idx, self) => self.findIndex((x: any) => x.id === ev.id) === idx
        );
        setOverrideEvents(merged as Event[]);
      } else {
        // Show all events (use allEventsForCount if available, otherwise load)
        if (allEventsForCount.length > 0) {
          setOverrideEvents(allEventsForCount);
        } else {
          // Load all events
          const [a, f] = await Promise.all([
            loadAll({
              page: 0,
              search: searchTerm || undefined,
              status: "ACTIVE" as const,
            }),
            loadAll({
              page: 0,
              search: searchTerm || undefined,
              status: "FINISHED" as const,
            }),
          ]);
          const arrA: Event[] = Array.isArray(a)
            ? (a as Event[])
            : ((a as any)?.data ?? (a as any)?.content ?? []);
          const arrF: Event[] = Array.isArray(f)
            ? (f as Event[])
            : ((f as any)?.data ?? (f as any)?.content ?? []);
          const merged = [...arrA, ...arrF].filter(
            (ev, idx, self) => self.findIndex((x: any) => x.id === ev.id) === idx
          );
          setOverrideEvents(merged as Event[]);
          setAllEventsForCount(merged as Event[]);
        }
      }
    } else {
      if (categoryId) {
        // Load events with category filter for display
        setOverrideEvents(null);
        loadAll({
          page: 1, // API uses 1-based
          size: 9,
          search: searchTerm || undefined,
          categoryId: categoryId,
          status: selectedStatus || undefined,
        });
      } else {
        // Show all events (use Redux state for pagination)
        setOverrideEvents(null);
        loadAll({
          page: 1, // API uses 1-based
          size: 9,
          search: searchTerm || undefined,
          status: selectedStatus || undefined,
        });
      }
    }
    } finally {
      setIsFiltering(false);
    }
  };

  const STATUS_FILTERS: EventStatusFilter[] = [
    "ACTIVE",
    "FINALIZED",
    "CANCELLED",
  ];

  const extractEvents = (result: any): Event[] => {
    if (Array.isArray(result)) return result as Event[];
    const data =
      result?.data ??
      result?.content ??
      result?.items ??
      result?.result ??
      [];
    return Array.isArray(data) ? (data as Event[]) : [];
  };

  const dedupeEvents = (events: Event[]): Event[] => {
    return events.filter(
      (ev, idx, arr) => arr.findIndex((e) => e.id === ev.id) === idx
    );
  };

  const handleStatusFilter = async (status: EventStatusFilter | null) => {
    setSelectedStatus(status);
    setClientPage(1); // Reset to first page when status changes

    setOverrideEvents(null);
    setIsFiltering(true);

    try {
      if (status === null) {
      // Load all events without category filter for category count
      const responses = await Promise.all(
        STATUS_FILTERS.map((st) =>
          loadAll({
            page: 0,
            search: searchTerm || undefined,
            status: st,
          })
        )
      );
      const mergedAll = dedupeEvents(
        responses.flatMap((res) => extractEvents(res))
      );
      setAllEventsForCount(mergedAll as Event[]);

      // Load events with category filter for display
      if (selectedCategory) {
        const responsesWithCategory = await Promise.all(
          STATUS_FILTERS.map((st) =>
            loadAll({
              page: 0,
              search: searchTerm || undefined,
              categoryId: selectedCategory,
              status: st,
            })
          )
        );
        const mergedCategory = dedupeEvents(
          responsesWithCategory.flatMap((res) => extractEvents(res))
        );
        setOverrideEvents(mergedCategory as Event[]);
      } else {
        setOverrideEvents(mergedAll as Event[]);
      }
    } else {
      // Load events for specific status with pagination (9 items per page)
      const baseResult = await loadAll({
        page: 1, // API uses 1-based
        size: 9,
        search: searchTerm || undefined,
        status,
      });
      const baseEvents = extractEvents(baseResult);
      setAllEventsForCount(baseEvents);

      if (selectedCategory) {
        const categoryResult = await loadAll({
          page: 1, // API uses 1-based
          size: 9,
          search: searchTerm || undefined,
          categoryId: selectedCategory,
          status,
        });
        const categoryEvents = extractEvents(categoryResult);
        setOverrideEvents(categoryEvents);
      } else {
        setOverrideEvents(null); // Use Redux state for pagination
      }
    }
    } finally {
      setIsFiltering(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (loadingList || page < 1 || page > totalPages) return;

    if (selectedStatus === null) {
      // Client-side pagination for "all status" mode
      setClientPage(page);
      // Scroll to top of events section
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Server-side pagination for specific status
      loadAll({
        page: page, // API expects 1-based
        size: PAGE_SIZE,
        search: searchTerm || undefined,
        categoryId: selectedCategory || undefined,
        status: selectedStatus || undefined,
      });
    }
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
      const responses = await Promise.all(
        STATUS_FILTERS.map((st) => loadAll({ page: 0, status: st }))
      );
      const merged = dedupeEvents(
        responses.flatMap((res) => extractEvents(res))
      );
      // Set allEventsForCount for category count calculation (without category filter)
      setAllEventsForCount(merged as Event[]);
      setOverrideEvents(merged as Event[]);
      setSelectedStatus(null);
    })();
  }, [loadAll]);

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <EventsSearchBar
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        selectedStatus={selectedStatus}
        onStatusFilter={handleStatusFilter}
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
            queryKey={`${searchTerm}-${selectedCategory ?? "all"}-${selectedStatus ?? "all"}-${currentPage}`}
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
