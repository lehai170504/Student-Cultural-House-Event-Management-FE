"use client";

import { useEffect, useState } from "react";
import axiosInstance from "@/config/axiosInstance";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Event } from "@/features/events/types/events";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface MyEventsResponse {
  data: Event[];
}

export default function StudentMyEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [size] = useState<number>(6);

  const load = async (p: number) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get<MyEventsResponse>("/students/me/events", {
        params: { page: p, size },
      });
      const payload: any = res?.data;
      const list: Event[] = (payload?.data && Array.isArray(payload.data)) ? payload.data : (Array.isArray(payload) ? payload : []);
      setEvents(list);
      setPage(p);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Không tải được lịch sử sự kiện");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(1);
  }, []);

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case "ACTIVE":
        return <Badge className="bg-green-100 text-green-700">Đang diễn ra</Badge>;
      case "FINISHED":
        return <Badge className="bg-gray-100 text-gray-700">Đã kết thúc</Badge>;
      case "CANCELLED":
        return <Badge className="bg-red-100 text-red-700">Đã hủy</Badge>;
      case "DRAFT":
        return <Badge className="bg-blue-100 text-blue-700">Nháp</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-700">Khác</Badge>;
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500 text-lg animate-pulse">Đang tải lịch sử sự kiện...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-10">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Sự kiện của tôi</h1>
          <p className="text-gray-500">Lịch sử các sự kiện bạn đã tham gia</p>
        </div>

        {events.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-gray-500">
              Bạn chưa tham gia sự kiện nào.
            </CardContent>
          </Card>
        ) : (
          <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((ev) => {
              const start = ev.startTime ? new Date(ev.startTime).toLocaleString() : "";
              const end = ev.endTime ? new Date(ev.endTime).toLocaleString() : "";
              return (
                <Card key={ev.id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <CardTitle className="text-xl">{ev.title}</CardTitle>
                        <CardDescription>{ev.partnerName}</CardDescription>
                      </div>
                      {getStatusBadge(ev.status)}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span className="text-sm">{start} - {end}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="h-4 w-4" />
                      <span className="text-sm">{ev.location}</span>
                    </div>
                    {ev.category?.name ? (
                      <div>
                        <Badge variant="secondary">{ev.category.name}</Badge>
                      </div>
                    ) : null}

                    <div className="pt-2">
                      <Link href={`/events/${ev.id}`}>
                        <Button variant="outline" className="w-full">
                          Xem chi tiết
                          <ArrowRight className="h-4 w-4 ml-2" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-500">Trang {page}</div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => load(Math.max(1, page - 1))}
                    className={loading || page <= 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={() => load(page + 1)}
                    className={loading || events.length < size ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
          </>
        )}
      </div>
    </main>
  );
}


