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
import { Eye, Plus, Trash2 } from "lucide-react";
import { useEvents } from "../hooks/useEvents";

// Lazy load modal
const ViewDetailEvent = lazy(() => import("./ViewDetailEvent"));
const CreateEventModal = lazy(() => import("./CreateEventModal"));

export default function EventTable() {
  const { list = [], loadingList, deleting, deleteEventById } = useEvents();

  const [search, setSearch] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const filteredEvents = Array.isArray(list)
    ? list.filter((e) => e.title?.toLowerCase().includes(search.toLowerCase()))
    : [];

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
              <p className="text-lg text-gray-600">Admin quản lý các sự kiện</p>
            </div>

            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              <Input
                placeholder="Tìm kiếm sự kiện..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[200px]"
              />
              <Button
                className="bg-orange-500 hover:bg-orange-600 flex items-center gap-1"
                onClick={() => setCreating(true)}
              >
                <Plus className="h-4 w-4" />
                Tạo mới
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="text-white">
                  <TableHead className="px-6 py-3">Tên sự kiện</TableHead>
                  <TableHead className="px-6 py-3">Địa điểm</TableHead>
                  <TableHead className="px-6 py-3">Thời gian</TableHead>
                  <TableHead className="px-6 py-3">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingList ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : filteredEvents.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      Không có sự kiện nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell className="px-6 py-4">{event.title}</TableCell>
                      <TableCell className="px-6 py-4">
                        {event.location}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {new Date(event.startTime).toLocaleString()} -{" "}
                        {new Date(event.endTime).toLocaleString()}
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
                          onClick={() => deleteEventById(event.id)}
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
        </div>
      </section>

      {/* Modal chi tiết */}
      {selectedEvent && (
        <Suspense fallback={<p>Đang tải...</p>}>
          <ViewDetailEvent
            eventId={selectedEvent}
            open={!!selectedEvent}
            onClose={() => setSelectedEvent(null)}
          />
        </Suspense>
      )}

      {/* Modal tạo mới */}
      {creating && (
        <Suspense fallback={<p>Đang tải...</p>}>
          <CreateEventModal
            open={creating}
            onClose={() => setCreating(false)}
          />
        </Suspense>
      )}
    </main>
  );
}
