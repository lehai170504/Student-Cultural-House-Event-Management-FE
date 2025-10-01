"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableHeader,
  TableCell,
  TableHead,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Eye, Trash2 } from "lucide-react";
import OrganizerEventForm from "./components/OrganizerEventForm";
import ViewOrEditEvent from "./components/ViewOrEditEvent";

interface EventItem {
  id: number;
  name: string;
  organizer: string;
  date: string; // dd/mm/yyyy
  status: "pending" | "approved" | "rejected";
}

export default function OrganizerEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([
    {
      id: 1,
      name: "Ngày hội việc làm 2025",
      organizer: "CLB CNTT",
      date: "2025-11-12",
      status: "pending",
    },
  ]);

  const [openForm, setOpenForm] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

  const statusColors = {
    pending: "bg-yellow-100 text-yellow-600",
    approved: "bg-green-100 text-green-600",
    rejected: "bg-red-100 text-red-600",
  };

  const handleCreate = (event: Omit<EventItem, "id" | "status">) => {
    const newEvent: EventItem = {
      id: events.length + 1,
      status: "pending",
      ...event,
    };
    setEvents((prev) => [...prev, newEvent]);
  };

  const handleUpdate = (updated: EventItem) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const handleDelete = (id: number) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setSelectedEvent(null);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle className="text-2xl font-bold text-gray-800">
            Quản lý sự kiện (Organizer)
          </CardTitle>
          <Button
            onClick={() => setOpenForm(true)}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <Plus className="h-4 w-4 mr-2" /> New Event
          </Button>
        </CardHeader>

        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tên sự kiện</TableHead>
                <TableHead>Ngày diễn ra</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Hành động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.date}</TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        statusColors[event.status]
                      }`}
                    >
                      {event.status === "pending"
                        ? "Chờ duyệt"
                        : event.status === "approved"
                        ? "Đã duyệt"
                        : "Bị từ chối"}
                    </span>
                  </TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setSelectedEvent(event)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(event.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Modal Tạo sự kiện */}
      <OrganizerEventForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        onCreate={handleCreate}
      />

      {/* Modal Xem/Sửa sự kiện */}
      <ViewOrEditEvent
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
        onUpdate={handleUpdate}
      />
    </main>
  );
}
