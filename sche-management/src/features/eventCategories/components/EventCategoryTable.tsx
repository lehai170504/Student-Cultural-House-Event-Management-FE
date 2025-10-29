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
import { Eye, X, Edit2, Plus } from "lucide-react";
import { useEventCategories } from "../hooks/useEventCategories";

// Lazy load các modal
const ViewDetailEventCategory = lazy(() => import("./ViewDetailEventCategory"));
const CreateEventCategoryModal = lazy(
  () => import("./CreateEventCategoryModal")
);

export default function EventCategoryTable() {
  const {
    list = [],
    loadingList,
    deleting,
    loadDetail,
    deleteCategoryById,
  } = useEventCategories();

  console.log("list từ hook useEventCategories:", list);
  console.log("Redux store list:", list);

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [creating, setCreating] = useState(false);

  const filteredCategories = Array.isArray(list)
    ? list.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          {/* Header + Search + Tạo mới */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý danh mục sự kiện
              </h1>
              <p className="text-lg text-gray-600">
                Admin quản lý các danh mục sự kiện
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Input
                placeholder="Tìm kiếm danh mục..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button
                variant="default"
                size="sm"
                onClick={() => setCreating(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Tạo mới
              </Button>
            </div>
          </div>

          {/* Table */}
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
                          variant="secondary"
                          size="sm"
                          onClick={() => setSelectedCategory(category.id)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => loadDetail(category.id)}
                        >
                          <Edit2 className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleting}
                          onClick={() => deleteCategoryById(category.id)}
                        >
                          <X className="h-4 w-4" />
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

      {/* Modal chi tiết / chỉnh sửa */}
      {selectedCategory && (
        <Suspense fallback={null}>
          <ViewDetailEventCategory
            categoryId={selectedCategory}
            onClose={() => setSelectedCategory(null)}
          />
        </Suspense>
      )}

      {/* Modal tạo mới */}
      {creating && (
        <Suspense fallback={null}>
          <CreateEventCategoryModal
            open={creating}
            onClose={() => setCreating(false)}
          />
        </Suspense>
      )}
    </main>
  );
}
