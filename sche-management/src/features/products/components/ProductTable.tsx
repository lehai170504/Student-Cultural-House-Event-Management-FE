// ProductTable.tsx

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
import {
  Eye,
  Trash2,
  Plus,
  TrendingUp,
  AlertTriangle,
  List,
} from "lucide-react";
import { useProducts } from "../hooks/useProducts";
import type { Product } from "../types/product";
import { SimpleProductTable } from "./SimpleProductTable"; // Component bảng đơn giản

// Giả định bạn có component Tabs từ thư viện UI (ví dụ: shadcn/ui)
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const ViewDetailProduct = lazy(() => import("./ViewDetailProduct"));
const CreateProductModal = lazy(() => import("./CreateProductModal"));

// Định nghĩa các loại tab
type ProductTabView = "main" | "top" | "lowStock";

export default function ProductTable() {
  const {
    list = [],
    loadingList,
    saving,
    removeProduct,
    topRedeemed = [],
    loadingTopRedeemed,
    lowStock = [],
    loadingLowStock,
    loadTopRedeemed,
    loadLowStock,
    loadAll,
  } = useProducts();

  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [openCreate, setOpenCreate] = useState(false);
  // Trạng thái cho Tabs
  const [activeTab, setActiveTab] = useState<ProductTabView>("main");

  // 🔍 Lọc danh sách theo tiêu đề sản phẩm (chỉ áp dụng cho tab chính)
  const filteredProducts = Array.isArray(list)
    ? list.filter((p: Product) =>
        p.title?.toLowerCase().includes(search.toLowerCase())
      )
    : [];

  // 🚀 Load dữ liệu khi chuyển tab
  useEffect(() => {
    switch (activeTab) {
      case "main":
        loadAll(); // Load danh sách chính khi vào tab Main
        break;
      case "top":
        loadTopRedeemed();
        break;
      case "lowStock":
        loadLowStock();
        break;
    }
  }, [activeTab, loadAll, loadTopRedeemed, loadLowStock]);

  // Hàm hiển thị nội dung bảng chính (để giữ logic Actions)
  const renderMainTable = () => (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="px-6 py-3">Tiêu đề</TableHead>
            <TableHead className="px-6 py-3">Loại sản phẩm</TableHead>
            <TableHead className="px-6 py-3 text-right">Giá (Coins)</TableHead>
            <TableHead className="px-6 py-3 text-right">Tồn kho</TableHead>
            <TableHead className="px-6 py-3">Trạng thái</TableHead>
            <TableHead className="px-6 py-3 text-center">Hành động</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loadingList ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                Đang tải...
              </TableCell>
            </TableRow>
          ) : filteredProducts.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                Không có sản phẩm nào
              </TableCell>
            </TableRow>
          ) : (
            filteredProducts.map((product: Product) => (
              <TableRow key={product.id}>
                <TableCell className="px-6 py-4 font-medium">
                  {product.title}
                </TableCell>
                <TableCell className="px-6 py-4">{product.type}</TableCell>
                <TableCell className="px-6 py-4 text-right">
                  {product.unitCost?.toLocaleString() ?? 0}
                </TableCell>
                <TableCell className="px-6 py-4 text-right">
                  {product.totalStock ?? 0}
                </TableCell>
                <TableCell className="px-6 py-4">
                  <span
                    className={`px-2 py-1 text-xs font-semibold rounded ${
                      product.isActive
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {product.isActive ? "Đang bán" : "Ngừng bán"}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-4 flex justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1 px-2 py-1 rounded-md border-2 border-orange-500 text-orange-500 font-medium transition-all duration-200 hover:bg-orange-500 hover:text-white hover:scale-105 active:scale-95 shadow-sm"
                    onClick={() => setSelectedProduct(product.id)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="flex items-center gap-1 px-2 py-1 rounded-md bg-red-500 text-white font-medium transition-all duration-200 hover:bg-red-600 hover:scale-105 active:scale-95 shadow-sm"
                    disabled={saving}
                    onClick={() => removeProduct(product.id)}
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
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="relative bg-white rounded-2xl shadow p-8 mt-5">
        <div className="container mx-auto px-6">
          {/* 🔹 Header & Tạo mới */}
          <div className="grid md:grid-cols-2 gap-6 items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Quản lý sản phẩm
              </h1>
              <p className="text-lg text-gray-600">
                Quản trị viên quản lý các sản phẩm trong hệ thống
              </p>
            </div>
            <div className="flex md:justify-end justify-center gap-4 flex-wrap items-center">
              {/* Thêm Input tìm kiếm chỉ hiển thị ở tab chính */}
              {activeTab === "main" && (
                <Input
                  placeholder="Tìm kiếm sản phẩm..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-[200px]"
                />
              )}
              <Button
                className="flex items-center gap-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 active:scale-95 shadow-sm"
                onClick={() => setOpenCreate(true)}
              >
                <Plus className="h-4 w-4" />
                Thêm sản phẩm
              </Button>
            </div>
          </div>

          {/* 🚀 KHUNG TABS (Giả định cấu trúc UI) */}
          <div className="w-full">
            <div className="flex border-b border-gray-200 mb-4">
              <button
                onClick={() => setActiveTab("main")}
                className={`py-2 px-4 flex items-center gap-2 font-medium transition-colors ${
                  activeTab === "main"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="h-5 w-5" /> Quản lý chính
              </button>
              <button
                onClick={() => setActiveTab("top")}
                className={`py-2 px-4 flex items-center gap-2 font-medium transition-colors ${
                  activeTab === "top"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <TrendingUp className="h-5 w-5" /> Top Redeem
              </button>
              <button
                onClick={() => setActiveTab("lowStock")}
                className={`py-2 px-4 flex items-center gap-2 font-medium transition-colors ${
                  activeTab === "lowStock"
                    ? "border-b-2 border-blue-600 text-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <AlertTriangle className="h-5 w-5" /> Tồn kho thấp
              </button>
            </div>

            {/* Nội dung Tab */}
            <div className="py-4">
              {activeTab === "main" && renderMainTable()}
              {activeTab === "top" && (
                <SimpleProductTable
                  data={topRedeemed}
                  isLoading={loadingTopRedeemed}
                />
              )}
              {activeTab === "lowStock" && (
                <SimpleProductTable
                  data={lowStock}
                  isLoading={loadingLowStock}
                />
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 🔹 Modal chi tiết sản phẩm */}
      {selectedProduct && (
        <Suspense
          fallback={<p className="text-center py-4">Đang tải chi tiết...</p>}
        >
          <ViewDetailProduct
            productId={selectedProduct}
            open={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
          />
        </Suspense>
      )}

      {/* 🔹 Modal tạo mới sản phẩm */}
      {openCreate && (
        <Suspense
          fallback={<p className="text-center py-4">Đang mở form tạo mới...</p>}
        >
          <CreateProductModal
            open={openCreate}
            onClose={() => setOpenCreate(false)}
          />
        </Suspense>
      )}
    </main>
  );
}
