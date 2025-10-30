// src/features/partner/components/PartnerDetails.tsx (TẠO FILE MỚI)

import React, { useEffect } from 'react';
import { usePartners } from '../hooks/usePartners'; 

interface PartnerDetailsProps {
    // ID được truyền từ router hoặc component cha
    partnerId: string; 
}

const PartnerDetails: React.FC<PartnerDetailsProps> = ({ partnerId }) => {
    // Sử dụng hook đã cập nhật
    const { 
        selectedPartner, 
        loadingDetail, 
        error, 
        fetchPartnerById, 
        clearSelectedPartner 
    } = usePartners(); 

    useEffect(() => {
        // Gọi API khi component mount hoặc partnerId thay đổi
        if (partnerId) {
            fetchPartnerById(partnerId);
        }
        
        // Cleanup: Xóa chi tiết khỏi state khi rời khỏi component
        return () => {
             clearSelectedPartner();
        };
    }, [partnerId, fetchPartnerById, clearSelectedPartner]);

    // Xử lý Loading
    if (loadingDetail) return <div className="p-4 text-center">Đang tải chi tiết đối tác...</div>;
    
    // Xử lý Lỗi
    if (error) return <div className="p-4 text-red-500">Lỗi tải chi tiết: {error}</div>;
    
    // Xử lý Không tìm thấy
    if (!selectedPartner) return <div className="p-4 text-center">Không tìm thấy chi tiết đối tác này.</div>;

    // Hiển thị thông tin chi tiết
    return (
        <div className="p-6 bg-white shadow rounded-lg">
            <h1 className="text-3xl font-bold mb-4 border-b pb-2">{selectedPartner.name}</h1>
            <div className="grid grid-cols-2 gap-4">
                <p><strong>ID:</strong> {selectedPartner.id}</p>
                <p><strong>Email:</strong> {selectedPartner.email}</p>
                {/* Thêm các trường dữ liệu khác của Partner ở đây */}
                {/* <p><strong>Địa chỉ:</strong> {selectedPartner.address}</p> */}
            </div>
            
            <h2 className="text-xl font-semibold mt-6 mb-3">Các thông tin liên quan</h2>
            {/* 💡 Đây là nơi bạn sẽ thêm các component con sử dụng các API khác (Wallet, Events) */}
            {/* <PartnerWallet partnerId={selectedPartner.id} /> */}
            {/* <PartnerEvents partnerId={selectedPartner.id} /> */}
        </div>
    );
};

export default PartnerDetails;