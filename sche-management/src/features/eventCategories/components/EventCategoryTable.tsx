// EventCategoryTable.tsx
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
import { Eye, Trash2 } from "lucide-react";
import { useEventCategories } from "../hooks/useEventCategories";

const ViewDetailEventCategory = lazy(() => import("./ViewDetailEventCategory"));

export default function EventCategoryTable() {
  const {
    list = [],
    loadingList,
    deleting,
    deleteCategoryById,
  } = useEventCategories();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredCategories = Array.isArray(list)
    ? list.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý danh mục sự kiện
              </h1>
              <p className="text-lg text-gray-600">
                Admin quản lý các danh mục sự kiện
              </p>
            </div>
            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-[200px]"
              />
            </div>
          </div>

          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="text-white">
                  <TableHead className="px-6 py-3">Tên danh mục</TableHead>
                  <TableHead className="px-6 py-3">Mô tả</TableHead>
                  <TableHead className="px-6 py-3">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingList ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      Đang tải...
                    </TableCell>
                  </TableRow>
                ) : filteredCategories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      Không có danh mục nào
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="px-6 py-4">
                        {category.name}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        {category.description}
                      </TableCell>
                      <TableCell className="px-6 py-4 flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex items-center gap-1 px-2 py-1 rounded-md
                             border-2 border-orange-500 text-orange-500 font-medium
                             transition-all duration-200
                             hover:bg-orange-500 hover:text-white hover:scale-105
                             active:scale-95 shadow-sm"
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          className="flex items-center gap-1 px-2 py-1 rounded-md
                             bg-red-500 text-white font-medium
                             transition-all duration-200
                             hover:bg-red-600 hover:scale-105 active:scale-95 shadow-sm"
                          disabled={deleting}
                          onClick={() => deleteCategoryById(category.id)}
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
      {selectedCategory && (
        <Suspense
          fallback={<p className="text-center py-4">Đang tải chi tiết...</p>}
        >
          <ViewDetailEventCategory
            categoryId={selectedCategory}
            open={!!selectedCategory}
            onClose={() => setSelectedCategory(null)}
          />
        </Suspense>
      )}
    </main>
  );
}
