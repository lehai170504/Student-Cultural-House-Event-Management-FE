// src/features/partner/components/EventCategoryTable.tsx
"use client";

import { useState, Suspense, lazy, useEffect } from "react";
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
import { Eye, Trash2, PlusCircle, RotateCw } from "lucide-react"; // Import RotateCw
import { useEventCategories } from "../hooks/useEventCategories";
// 🌟 Import useUserProfileAuth để kiểm tra quyền
import { useUserProfileAuth } from "@/hooks/useUserProfileAuth";

// Lazy Load cho các modals
const ViewDetailEventCategory = lazy(() => import("./ViewDetailEventCategory"));
const CreateEventCategoryModal = lazy(() => import("./CreateEventCategory"));

export default function EventCategoryTable() {
  // 🌟 Lấy thông tin user và nhóm quyền
  const { user: authUser } = useUserProfileAuth();
  const isAdmin = authUser?.groups.includes("Admin");

  const {
    list = [],
    loadingList,
    deleting,
    deleteCategoryById,
    loadAll,
  } = useEventCategories();

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  // 🌟 State quản lý id đang xóa
  const [processingId, setProcessingId] = useState<string | null>(null);

  // Tự động load danh sách khi component mount
  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const filteredCategories = Array.isArray(list)
    ? list.filter((c) => c.name?.toLowerCase().includes(search.toLowerCase()))
    : [];

  // Hàm xử lý sau khi tạo/xóa thành công
  const handleSuccess = () => {
    setIsCreateModalOpen(false);
    loadAll(); // Tải lại danh sách để thấy sự thay đổi mới nhất
  };

  // 🌟 Hàm xóa danh mục
  const handleDelete = async (categoryId: string) => {
    setProcessingId(categoryId);
    try {
      // Gọi API xóa
      await deleteCategoryById(categoryId).unwrap();
      // Tải lại danh sách nếu xóa thành công
      loadAll();
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      // Xử lý lỗi (ví dụ: hiển thị thông báo lỗi)
    } finally {
      setProcessingId(null);
    }
  };

  // 🌟 Kiểm tra xem hành động đang được xử lý
  const isProcessing = (categoryId: string) =>
    processingId === categoryId || deleting;

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
              {/* 🌟 Chỉ hiển thị nút Thêm nếu là PARTNER */}
              {isAdmin && (
                <Button
                  className="bg-green-600 hover:bg-green-700 transition-colors"
                  onClick={() => setIsCreateModalOpen(true)}
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  Thêm danh mục
                </Button>
              )}
            </div>
          </div>

          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 text-gray-700 hover:bg-gray-100">
                  <TableHead className="px-6 py-3">Tên danh mục</TableHead>
                  <TableHead className="px-6 py-3">Mô tả</TableHead>
                  <TableHead className="px-6 py-3">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loadingList ? (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-6">
                      <RotateCw className="inline animate-spin mr-2 h-4 w-4" />{" "}
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

                        {/* 🌟 Chỉ hiển thị nút Xóa nếu là PARTNER */}
                        {isAdmin && (
                          <Button
                            variant="destructive"
                            size="sm"
                            className="flex items-center gap-1 px-2 py-1 rounded-md
                                     bg-red-500 text-white font-medium
                                     transition-all duration-200
                                     hover:bg-red-600 hover:scale-105 active:scale-95 shadow-sm"
                            disabled={isProcessing(category.id)}
                            onClick={() => handleDelete(category.id)}
                          >
                            {isProcessing(category.id) ? (
                              <RotateCw className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </section>

      {/* Modal chi tiết (giữ nguyên) */}
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

      {/* Modal Tạo mới */}
      {isCreateModalOpen && (
        <Suspense
          fallback={<p className="text-center py-4">Đang tải form...</p>}
        >
          <CreateEventCategoryModal
            open={isCreateModalOpen}
            onClose={() => setIsCreateModalOpen(false)}
            onSuccess={handleSuccess}
          />
        </Suspense>
      )}
    </main>
  );
}
