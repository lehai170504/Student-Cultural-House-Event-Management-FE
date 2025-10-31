"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useEvents } from "@/features/events/hooks/useEvents";
import { Calendar, MapPin, Users, Clock } from "lucide-react";

export default function EventsPage() {
  const { list: events = [], loadAll } = useEvents();
  const [highlightedEvents, setHighlightedEvents] = useState<typeof events>([]);
  const [selectedEvent, setSelectedEvent] = useState<(typeof events)[0] | null>(
    null
  );

  useEffect(() => {
    loadAll({ page: 0 });
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
                  onClick={() => setSelectedEvent(event)}
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
                  <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-md">
                    Xem chi tiết
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Dialog chi tiết sự kiện */}
      {selectedEvent && (
        <Dialog
          open={!!selectedEvent}
          onOpenChange={() => setSelectedEvent(null)}
        >
          <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-3xl lg:max-w-4xl max-h-[85vh] overflow-y-auto p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 mb-4">
                {selectedEvent.title}
              </DialogTitle>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <p className="text-gray-700 leading-relaxed">
                {selectedEvent.description}
              </p>

              <div className="grid grid-cols-1 gap-2 text-gray-600 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span>
                    {new Date(selectedEvent.startTime).toLocaleDateString()} -{" "}
                    {new Date(selectedEvent.endTime).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-400" />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-gray-400" />
                  <span>{selectedEvent.maxAttendees || 0} người tham gia</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span>Đăng ký mở</span>
                </div>
              </div>

              <Button className="mt-4 bg-orange-500 hover:bg-orange-600 text-white rounded-lg shadow-md">
                Tham gia ngay
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </main>
  );
}
