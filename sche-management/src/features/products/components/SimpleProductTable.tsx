// SimpleProductTable.tsx (Được dùng để hiển thị Top/Low Stock)

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from "../types/product";

interface SimpleProductTableProps {
  data: Product[];
  isLoading: boolean;
  colSpan?: number;
}

export function SimpleProductTable({
  data,
  isLoading,
  colSpan = 5,
}: SimpleProductTableProps) {
  return (
    <div className="rounded-xl border">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead className="px-6 py-3">Tiêu đề</TableHead>
            <TableHead className="px-6 py-3">Loại</TableHead>
            <TableHead className="px-6 py-3 text-right">Giá (Coins)</TableHead>
            <TableHead className="px-6 py-3 text-right">Tồn kho</TableHead>
            <TableHead className="px-6 py-3">Trạng thái</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="text-center py-6 text-gray-500">
                Đang tải...
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={colSpan} className="text-center py-6 text-gray-500">
                Không có sản phẩm nào
              </TableCell>
            </TableRow>
          ) : (
            data.map((product) => (
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
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}