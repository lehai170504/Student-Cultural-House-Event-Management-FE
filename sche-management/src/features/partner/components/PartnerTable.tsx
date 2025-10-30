// src/features/partner/components/PartnerTable.tsx

import React, { useEffect } from 'react';
import { usePartners } from '../hooks/usePartners'; // Điều chỉnh đường dẫn nếu cần
// 💡 Có thể cần import hook điều hướng (ví dụ: useRouter từ Next.js/React Router)
// import { useRouter } from 'next/router'; 

// Giả định kiểu dữ liệu Partner (nếu chưa có, bạn nên định nghĩa trong types/partner.ts)
interface Partner {
  id: string;
  name: string;
  email: string;
  // Thêm các trường khác cần hiển thị
}

const PartnerTable: React.FC = () => {
  // const router = useRouter(); // Khai báo hook điều hướng

  // 1. Sử dụng hook để lấy trạng thái và hàm dispatch (thunk)
  const { 
    data: partners, // Lấy danh sách đối tác
    loading,        // Trạng thái đang tải
    error,          // Trạng thái lỗi
    fetchPartners   // Hàm dispatch thunk (được khai báo trong usePartners.ts)
  } = usePartners(); 

  // 💡 HÀM XỬ LÝ NHẤP VÀO CHI TIẾT
  const handleDetailClick = (partnerId: string) => {
    // ⚠️ Tùy thuộc vào ứng dụng của bạn:
    // 1. Điều hướng đến trang chi tiết: router.push(`/admin/partners/${partnerId}`);
    // 2. Hoặc hiển thị Modal/Drawer tại chỗ và gọi thunk fetchPartnerById(partnerId);
    
    // Ví dụ điều hướng (giả định dùng Next.js/React Router):
    // router.push(`/admin/partners/${partnerId}`);
    console.log(`Chuyển đến trang chi tiết partner ID: ${partnerId}`);
  };

  // 2. Gọi API khi component được mount (tải lần đầu)
  useEffect(() => {
    // Gọi thunk để fetch dữ liệu từ backend
    fetchPartners();
  }, [fetchPartners]); // Đảm bảo fetchPartners không thay đổi giữa các lần render

  // 3. Xử lý trạng thái Loading
  if (loading === 'pending') {
    return (
      <div className="text-center p-4">
        <p>Đang tải danh sách đối tác...</p>
        {/* Có thể thêm spinner ở đây */}
      </div>
    );
  }

  // 4. Xử lý trạng thái Error
  if (error) {
    return (
      <div className="p-4 text-red-600 border border-red-300 bg-red-50">
        <h3 className="font-bold">Lỗi tải dữ liệu:</h3>
        <p>{error || 'Không thể kết nối đến server.'}</p>
        <button 
          onClick={() => fetchPartners()} 
          className="mt-2 p-1 bg-gray-200 rounded"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // 5. Xử lý trường hợp không có dữ liệu
  if (!partners || partners.length === 0) {
    return (
      <div className="text-center p-4">
        <p>Không tìm thấy đối tác nào.</p>
        <button 
          onClick={() => fetchPartners()} 
          className="mt-2 p-1 bg-gray-200 rounded"
        >
          Tải lại
        </button>
      </div>
    );
  }

  // 6. Hiển thị dữ liệu (PartnerTable)
  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Danh Sách Đối Tác</h2>
      <table className="min-w-full border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-200 p-2 text-left">ID</th>
            <th className="border border-gray-200 p-2 text-left">Tên Đối Tác</th>
            <th className="border border-gray-200 p-2 text-left">Email</th>
            <th className="border border-gray-200 p-2 text-left">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {/* Lặp qua danh sách đối tác để hiển thị */}
          {partners.map((partner: Partner) => (
            <tr key={partner.id} className="hover:bg-gray-50">
              <td className="border border-gray-200 p-2">{partner.id}</td>
              <td className="border border-gray-200 p-2">{partner.name}</td>
              <td className="border border-gray-200 p-2">{partner.email}</td>
              <td className="border border-gray-200 p-2">
                {/* Thêm event handler cho nút Chi tiết */}
                <button 
                    onClick={() => handleDetailClick(partner.id)} // ✅ GỌI HÀM MỚI
                    className="text-blue-500 hover:underline mr-2"
                >
                    Chi tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PartnerTable;