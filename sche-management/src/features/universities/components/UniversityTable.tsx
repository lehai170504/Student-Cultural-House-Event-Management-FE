"use client";

import { useState } from "react";
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
import { Eye } from "lucide-react";
import { useUniversities } from "../hooks/useUniversities";

export default function UniversityTable() {
  const { list = [], loading } = useUniversities();
  console.log("📡 universities", list);
  const [search, setSearch] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState<number | null>(
    null
  );

  const filteredUniversities = Array.isArray(list)
    ? list.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          {/* Header + Search */}
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý trường đại học
              </h1>
              <p className="text-lg text-gray-600">
                Danh sách các trường đại học
              </p>
            </div>

            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              <Input
                placeholder="Tìm kiếm trường..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[200px]"
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="text-white">
                  <TableHead className="px-6 py-3">Tên trường</TableHead>
                  <TableHead className="px-6 py-3">Mã trường</TableHead>
                  <TableHead className="px-6 py-3">Domain</TableHead>
                  <TableHead className="px-6 py-3">Ngày tạo</TableHead>
                  <TableHead className="px-6 py-3">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : filteredUniversities.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      Không có trường nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUniversities.map((university) => (
                    <TableRow key={university.id}>
                      <TableCell className="px-6 py-4">
                        {university.name}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {university.code}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {university.domain}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {new Date(university.createdAt).toLocaleString()}
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
                          onClick={() => setSelectedUniversity(university.id)}
                        >
                          <Eye className="h-4 w-4" />
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
    </main>
  );
}
