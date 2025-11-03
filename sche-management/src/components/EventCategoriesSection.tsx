"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/features/events/hooks/useEvents";
import { useRouter } from "next/navigation";

export default function EventsPage() {
  const router = useRouter();
  const { list: events = [], loadAll } = useEvents();
  const [highlightedEvents, setHighlightedEvents] = useState<typeof events>([]);

  useEffect(() => {
    // Backend đã mở quyền public cho events, không cần check auth
    // Format mới: page bắt đầu từ 1, không phải 0
    loadAll({ page: 1, size: 10 }).catch((err) => {
      // Handle error gracefully
      console.log("Could not load events:", err);
    });
  }, [loadAll]);

  useEffect(() => {
    const sorted = [...events].sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    setHighlightedEvents(sorted.slice(0, 3));
  }, [events]);

  const getStatus = (event: (typeof events)[0]) => {
    const now = new Date();
    const start = new Date(event.startTime);
    const end = new Date(event.endTime);
    if (now < start)
      return { text: "Sắp diễn ra", style: "bg-yellow-100 text-yellow-800" };
    if (now >= start && now <= end)
      return { text: "Đang diễn ra", style: "bg-green-100 text-green-800" };
    return { text: "Đã kết thúc", style: "bg-gray-100 text-gray-600" };
  };

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
            Sự kiện nổi bật
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {highlightedEvents.map((event) => {
              const status = getStatus(event);
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform transform hover:-translate-y-1 cursor-pointer overflow-hidden p-5 flex flex-col justify-between"
                  onClick={() => router.push(`/events/${event.id}`)}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg md:text-xl font-semibold text-gray-800 line-clamp-2">
                        {event.title}
                      </h3>
                      <Badge
                        className={`px-2 py-1 rounded-md font-semibold ${status.style}`}
                      >
                        {status.text}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-1 line-clamp-1">
                      {event.location}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(event.startTime).toLocaleDateString()} -{" "}
                      {new Date(event.endTime).toLocaleDateString()}
                    </p>
                  </div>
                  <Button asChild className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-md">
                    <Link href={`/events/${event.id}`}>Xem chi tiết</Link>
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
