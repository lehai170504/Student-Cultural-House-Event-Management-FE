import { motion } from "framer-motion";
import EventCard from "./EventCard";
import EventCardSkeleton from "./EventCardSkeleton";
import type { Event } from "@/features/events/types/events";

interface EventsGridProps {
  events: Event[];
  showSkeleton: boolean;
  skeletonCount: number;
  searchTerm: string;
  selectedCategory: string | null;
  selectedStatus: null | "ACTIVE" | "FINISHED";
}

export default function EventsGrid({
  events,
  showSkeleton,
  skeletonCount,
  searchTerm,
  selectedCategory,
  selectedStatus,
}: EventsGridProps) {
  return (
    <motion.div
      className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      key={searchTerm + selectedCategory + (selectedStatus || "all")}
    >
      {showSkeleton ? (
        // Show skeleton when loading
        Array.from({ length: skeletonCount }).map((_, idx) => (
          <EventCardSkeleton key={`skeleton-${idx}`} index={idx} />
        ))
      ) : events.length > 0 ? (
        // Show events when not loading and there are events
        events.map((event, index) => (
          <EventCard key={event.id} event={event} index={index} />
        ))
      ) : (
        // Show "No events" only when not loading and there are no events
        <div className="col-span-full text-center py-12 text-gray-500">
          Không tìm thấy sự kiện
        </div>
      )}
    </motion.div>
  );
}

