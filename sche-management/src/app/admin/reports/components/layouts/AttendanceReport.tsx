"use client";

import { useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableCell,
  TableBody,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function AttendanceReport() {
  const data = [
    { id: 1, user: "Nguyen Van A", event: "Workshop React", status: "Present" },
    { id: 2, user: "Tran Thi B", event: "NextJS Seminar", status: "Absent" },
    { id: 3, user: "Le Van C", event: "UI/UX Meetup", status: "Present" },
  ];

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filteredData = data.filter((row) => {
    const matchesSearch =
      row.user.toLowerCase().includes(search.toLowerCase()) ||
      row.event.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "All" || row.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <Card className="shadow-md border rounded-xl">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-orange-600">
          Attendance Report
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Bộ lọc */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 mb-4">
          <Input
            placeholder="Search by user or event..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="md:w-1/3"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Present">Present</SelectItem>
              <SelectItem value="Absent">Absent</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bảng */}
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-100">
              <TableHead className="font-semibold">User</TableHead>
              <TableHead className="font-semibold">Event</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length > 0 ? (
              filteredData.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-orange-50 transition-colors"
                >
                  <TableCell className="font-medium">{row.user}</TableCell>
                  <TableCell>{row.event}</TableCell>
                  <TableCell>
                    {row.status === "Present" ? (
                      <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        Present
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500 hover:bg-red-600 text-white">
                        Absent
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  No data found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
