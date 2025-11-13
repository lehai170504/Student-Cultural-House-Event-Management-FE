"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useEvents } from "@/features/events/hooks/useEvents";
import { ArrowRight, Calendar, Clock, MapPin, Sparkles } from "lucide-react";

export default function EventsPage() {
  const router = useRouter();
  const { list: events = [], loadAll } = useEvents();
  const [highlightedEvents, setHighlightedEvents] = useState<typeof events>([]);

  useEffect(() => {
    loadAll({ page: 1, size: 10 }).catch((err) =>
      console.log("Could not load events:", err)
    );
  }, [loadAll]);

  useEffect(() => {
    const sorted = [...events].sort(
      (a, b) =>
        new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    );
    setHighlightedEvents(sorted.slice(0, 3));
  }, [events]);

  const getStatus = (event: (typeof events)[0]) => {
    switch (event.status) {
      case "DRAFT":
        return { text: "NHÁP", style: "bg-blue-100 text-blue-700" };
      case "ACTIVE":
        return { text: "ĐANG DIỄN RA", style: "bg-green-100 text-green-700" };
      case "FINALIZED":
        return { text: "ĐÃ KẾT THÚC", style: "bg-orange-100 text-orange-700" };
      case "CANCELLED":
        return { text: "ĐÃ HỦY", style: "bg-red-100 text-red-700" };
      default:
        return { text: "KHÔNG XÁC ĐỊNH", style: "bg-gray-200 text-gray-700" };
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });

  const formatTime = (dateString: string) =>
    new Date(dateString).toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-orange-100">
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full mb-4 shadow-sm">
              <Sparkles className="w-5 h-5 text-orange-500" />
              <span className="text-orange-600 font-semibold">
                Sự kiện nổi bật
              </span>
            </div>

            <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-500 to-pink-500 bg-clip-text text-transparent">
              Khám phá sự kiện mới nhất
            </h2>

            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Hòa mình vào những hoạt động sôi nổi, kết nối cộng đồng và tận
              hưởng niềm vui cùng bạn bè sinh viên.
            </p>
          </div>

          {/* Events Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {highlightedEvents.map((event, index) => {
              const status = getStatus(event);
              return (
                <div
                  key={event.id}
                  className="group bg-white rounded-3xl overflow-hidden shadow-md hover:shadow-2xl border border-orange-100 hover:border-orange-300 transition-all duration-500 cursor-pointer animate-fadeUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                  onClick={() => router.push(`/events/${event.id}`)}
                >
                  {/* Header section with badges */}
                  <div className="relative">
                    {/* Category Badge */}
                    {event.category && (
                      <Badge className="absolute top-4 left-4 bg-orange-500 text-white backdrop-blur-sm border-0 shadow-md">
                        {typeof event.category === 'object' && event.category.name
                          ? event.category.name
                          : String(event.category)}
                      </Badge>
                    )}

                    {/* Status Badge */}
                    <Badge
                      className={`absolute top-4 right-4 ${status.style} backdrop-blur-sm border`}
                    >
                      {status.text}
                    </Badge>
                  </div>

                  {/* Content section */}
                  <div className="p-6">
                    <h3 className="text-xl mt-8 font-bold mb-3 text-gray-900 group-hover:text-orange-600 transition-colors line-clamp-2">
                      {event.title}
                    </h3>

                    <div className="space-y-2 mb-6 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-orange-500" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-orange-400" />
                        <span>{formatDate(event.startTime)}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-400" />
                        <span>
                          {formatTime(event.startTime)} -{" "}
                          {formatTime(event.endTime)}
                        </span>
                      </div>
                    </div>

                    <Button className="w-full cursor-pointer bg-orange-500 hover:bg-orange-600 text-white rounded-xl flex items-center justify-center gap-2 transition-transform duration-300 group-hover:scale-[1.02] shadow-md">
                      Xem chi tiết
                      <ArrowRight className="w-4 h-4 cursor-pointer group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* View All Button */}
          <div className="text-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-10 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              onClick={() => router.push("/events")}
            >
              Xem tất cả sự kiện
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}
