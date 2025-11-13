"use client";

import { useState, useEffect } from "react";
import { useEvents } from "@/features/events/hooks/useEvents";
import PublicNavbar from "@/components/PublicNavbar";
import type { Event } from "@/features/events/types/events";
import EventsSearchBar from "./components/EventsSearchBar";
import CategoryFilters from "./components/CategoryFilters";
import EventsGrid from "./components/EventsGrid";
import EventsPagination from "./components/EventsPagination";

export default function EventsPage() {
  const {
    list: events = [],
    loadingList,
    pagination,
    loadAll,
    eventCategories: allCategories = [],
  } = useEvents();

  const currentPage = pagination?.currentPage ?? 0;
  const totalPages = pagination?.totalPages ?? 0;
  const isLastPage = pagination?.isLastPage ?? true;

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<
    null | "ACTIVE" | "FINISHED"
  >(null);
  const [overrideEvents, setOverrideEvents] = useState<Event[] | null>(null);
  // Store all events without category filter for category count calculation
  const [allEventsForCount, setAllEventsForCount] = useState<Event[]>([]);
  // Track when async filter operations are running
  const [isFiltering, setIsFiltering] = useState(false);

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

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    setSearchTerm(keyword);

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
        page: 0,
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
          page: 0,
          search: keyword,
          status: selectedStatus || undefined,
          categoryId: selectedCategory,
        });
      } else {
        setOverrideEvents(null);
      }
    }
    } finally {
      setIsFiltering(false);
    }
  };

  const handleCategoryFilter = async (categoryId: string | null) => {
    setSelectedCategory(categoryId);

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
          page: 0,
          search: searchTerm || undefined,
          categoryId: categoryId,
          status: selectedStatus || undefined,
        });
      } else {
        // Show all events (use allEventsForCount if available)
        if (allEventsForCount.length > 0) {
          // Filter allEventsForCount by status for display
          const filtered = allEventsForCount.filter(
            (ev) => ev.status === selectedStatus
          );
          setOverrideEvents(filtered);
        } else {
          setOverrideEvents(null);
          loadAll({
            page: 0,
            search: searchTerm || undefined,
            status: selectedStatus || undefined,
          });
        }
      }
    }
    } finally {
      setIsFiltering(false);
    }
  };

  const handleStatusFilter = async (status: null | "ACTIVE" | "FINISHED") => {
    setSelectedStatus(status);

    setOverrideEvents(null);
    setIsFiltering(true);

    try {
      if (status === null) {
      // Load all events without category filter for category count
      const [aAll, fAll] = await Promise.all([
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
            search: searchTerm || undefined,
            categoryId: selectedCategory,
            status: "ACTIVE" as const,
          }),
          loadAll({
            page: 0,
            search: searchTerm || undefined,
            categoryId: selectedCategory,
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
        setOverrideEvents(mergedAll as Event[]);
      }
    } else {
      // Load all events without category filter for category count
      const allEventsResult = await loadAll({
        page: 0,
        search: searchTerm || undefined,
        status,
      });
      const arrAll: Event[] = Array.isArray(allEventsResult)
        ? (allEventsResult as Event[])
        : ((allEventsResult as any)?.data ?? (allEventsResult as any)?.content ?? []);
      setAllEventsForCount(arrAll);

      // Load events with category filter for display
      if (selectedCategory) {
        setOverrideEvents(null);
        loadAll({
          page: 0,
          search: searchTerm || undefined,
          categoryId: selectedCategory,
          status,
        });
      } else {
        setOverrideEvents(null);
      }
    }
    } finally {
      setIsFiltering(false);
    }
  };

  const handlePageChange = (page: number) => {
    if (selectedStatus === null) {
      console.warn("Pagination disabled when viewing 'Tất cả trạng thái'");
      return;
    }

    if (loadingList || page < 0 || page >= totalPages) return;

    loadAll({
      page,
      search: searchTerm || undefined,
      categoryId: selectedCategory || undefined,
      status: selectedStatus || undefined,
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


  useEffect(() => {
    (async () => {
      const [a, f] = await Promise.all([
        loadAll({ page: 0, status: "ACTIVE" as const }),
        loadAll({ page: 0, status: "FINISHED" as const }),
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
            events={filteredEvents}
            loading={showSkeleton}
            skeletonCount={skeletonItems.length}
            queryKey={`${searchTerm}-${selectedCategory ?? "all"}-${selectedStatus ?? "all"}`}
          />
        </div>
      </section>

      {/* Pagination */}
      {totalPages > 1 && selectedStatus !== null && (
        <EventsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          isLastPage={isLastPage}
          loadingList={loadingList}
          onPageChange={handlePageChange}
          getPageNumbers={getPageNumbers}
        />
      )}
    </main>
  );
}
