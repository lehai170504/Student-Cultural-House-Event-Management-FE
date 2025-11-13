// ProductTables.tsx (Đã thêm cột hình ảnh)
import { Building2 } from "lucide-react";

interface ProductTablesProps {
  // Giữ nguyên interface, giả định các item trong topRedeemed có trường 'imageUrl'
  topRedeemed: any[];
  lowStock: any[];
  mostActivePartner: string;
  loading: {
    loadingTopRedeemed: boolean;
    loadingLowStock: boolean;
  };
}

export default function ProductTables({
  topRedeemed,
  lowStock,
  mostActivePartner,
  loading,
}: ProductTablesProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Cột 1: Bảng Top Sản phẩm được đổi thưởng */}
      <div className="lg:col-span-2 bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
          🏆 Top 5 Sản phẩm được đổi thưởng nhiều nhất
          {loading.loadingTopRedeemed && (
            <span className="text-xs text-gray-400">(Đang tải...)</span>
          )}
        </h2>
        {!topRedeemed || topRedeemed.length === 0 ? (
          <p className="text-gray-500">Chưa có dữ liệu sản phẩm đổi thưởng.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="py-2 w-[5%]">#</th>
                  <th className="py-2 w-[5%]"></th> {/* Cột mới cho Image */}
                  <th className="py-2 w-[60%]">Tên sản phẩm</th>
                  <th className="py-2 w-[15%]">Điểm đổi</th>
                  <th className="py-2 w-[15%]">Lượt đổi</th>
                </tr>
              </thead>
              <tbody>
                {topRedeemed.slice(0, 5).map((prod, index) => (
                  <tr
                    key={prod.id}
                    className="border-b last:border-0 hover:bg-gray-50"
                  >
                    {/* # Rank */}
                    <td className="py-2 font-bold text-lg text-blue-500">
                      {index + 1}
                    </td>

                    {/* Cột Image MỚI */}
                    <td className="py-2">
                      {prod.imageUrl ? (
                        <img
                          src={prod.imageUrl}
                          alt={prod.title}
                          // Thiết lập kích thước nhỏ, bo tròn, và giữ tỷ lệ
                          className="w-8 h-8 rounded object-cover shadow-sm"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                          N/A
                        </div>
                      )}
                    </td>

                    {/* Tên sản phẩm */}
                    <td className="py-2 font-medium max-w-xs truncate">
                      {prod.title}
                      <span className="ml-2 text-xs text-gray-400">
                        ({prod.type})
                      </span>
                    </td>

                    {/* Điểm đổi */}
                    <td>{prod.unitCost.toLocaleString()}</td>

                    {/* Lượt đổi */}
                    <td className="font-bold text-green-600">
                      {prod.redeemCount?.toLocaleString() ?? "0"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Cột 2: Bảng Tồn kho Thấp & Đối tác mới (giữ nguyên) */}
      <div className="space-y-6">
        {/* Card Đối tác mới nhất */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-purple-500" /> Đối tác hoạt động
            mạnh nhất
          </h2>
          <div className="text-2xl font-bold text-green-600 truncate">
            {mostActivePartner}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Đã kích hoạt trong vòng 30 ngày qua.
          </p>
        </div>

        {/* Card Sản phẩm Tồn kho Thấp */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            ⚠️ Sản phẩm Tồn kho thấp ({lowStock.length})
            {loading.loadingLowStock && (
              <span className="text-xs text-gray-400"> (Đang tải...)</span>
            )}
          </h2>
          {!lowStock || lowStock.length === 0 ? (
            <p className="text-gray-500 text-sm">
              Tất cả sản phẩm đều có tồn kho an toàn.
            </p>
          ) : (
            <ul className="space-y-3 text-sm text-gray-600">
              {lowStock.slice(0, 5).map((prod: any) => (
                <li
                  key={prod.id}
                  className="flex justify-between items-center p-2 border border-red-200 bg-red-50 rounded"
                >
                  <span className="font-medium max-w-[60%] truncate">
                    📦 {prod.title}
                  </span>
                  <span className="text-red-600 font-bold text-lg">
                    {prod.totalStock.toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
