"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface OrganizerEventFormProps {
  open: boolean;
  onClose: () => void;
  onCreate: (event: { name: string; organizer: string; date: string }) => void;
}

export default function OrganizerEventForm({
  open,
  onClose,
  onCreate,
}: OrganizerEventFormProps) {
  const [name, setName] = useState("");
  const [organizer, setOrganizer] = useState("");
  const [date, setDate] = useState("");

  const handleSubmit = () => {
    if (!name || !organizer || !date) return;
    onCreate({ name, organizer, date });
    setName("");
    setOrganizer("");
    setDate("");
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tạo sự kiện mới</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <Input
            placeholder="Tên sự kiện"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="Ban tổ chức"
            value={organizer}
            onChange={(e) => setOrganizer(e.target.value)}
          />
          <Input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Button onClick={handleSubmit} className="w-full bg-purple-500">
            Tạo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
