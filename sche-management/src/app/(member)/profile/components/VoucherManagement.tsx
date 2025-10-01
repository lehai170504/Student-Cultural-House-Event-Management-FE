'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Gift, 
  Star, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  Filter,
  Copy,
  ExternalLink
} from 'lucide-react';

interface Voucher {
  id: string;
  title: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscountAmount?: number;
  pointsRequired: number;
  validFrom: string;
  validTo: string;
  status: 'active' | 'used' | 'expired';
  code: string;
  category: string;
}

interface Reward {
  id: string;
  title: string;
  description: string;
  pointsRequired: number;
  imageUrl: string;
  category: string;
  available: boolean;
  redeemedAt?: string;
}

const mockVouchers: Voucher[] = [
  {
    id: '1',
    title: 'Giảm giá 20% sự kiện',
    description: 'Giảm giá 20% cho tất cả sự kiện',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 100000,
    maxDiscountAmount: 50000,
    pointsRequired: 200,
    validFrom: '2024-01-01',
    validTo: '2024-12-31',
    status: 'active',
    code: 'EVENT20',
    category: 'Sự kiện'
  },
  {
    id: '2',
    title: 'Giảm 50k phí đăng ký',
    description: 'Giảm 50,000 VNĐ phí đăng ký sự kiện',
    discountType: 'fixed',
    discountValue: 50000,
    minOrderAmount: 200000,
    pointsRequired: 100,
    validFrom: '2024-01-01',
    validTo: '2024-06-30',
    status: 'used',
    code: 'REG50K',
    category: 'Đăng ký'
  },
  {
    id: '3',
    title: 'Miễn phí tham gia',
    description: 'Miễn phí tham gia 1 sự kiện bất kỳ',
    discountType: 'fixed',
    discountValue: 0,
    pointsRequired: 500,
    validFrom: '2024-01-01',
    validTo: '2024-03-31',
    status: 'expired',
    code: 'FREE2024',
    category: 'Đặc biệt'
  }
];

const mockRewards: Reward[] = [
  {
    id: '1',
    title: 'Áo thun logo SCH',
    description: 'Áo thun cotton cao cấp với logo Student Cultural House',
    pointsRequired: 300,
    imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=300&fit=crop',
    category: 'Quà tặng',
    available: true
  },
  {
    id: '2',
    title: 'Cốc giữ nhiệt',
    description: 'Cốc giữ nhiệt in logo SCH, dung tích 350ml',
    pointsRequired: 200,
    imageUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop',
    category: 'Quà tặng',
    available: true
  },
  {
    id: '3',
    title: 'Voucher ăn uống 100k',
    description: 'Voucher ăn uống trị giá 100,000 VNĐ tại canteen',
    pointsRequired: 150,
    imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=300&h=300&fit=crop',
    category: 'Voucher',
    available: false,
    redeemedAt: '2024-01-15'
  }
];

export default function VoucherManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredVouchers = mockVouchers.filter(voucher => {
    const matchesSearch = voucher.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         voucher.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || voucher.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || voucher.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const filteredRewards = mockRewards.filter(reward => {
    const matchesSearch = reward.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reward.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || reward.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-100 text-green-800">Hoạt động</Badge>;
      case 'used':
        return <Badge className="bg-blue-100 text-blue-800">Đã sử dụng</Badge>;
      case 'expired':
        return <Badge className="bg-red-100 text-red-800">Hết hạn</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'used':
        return <CheckCircle className="h-4 w-4 text-blue-500" />;
      case 'expired':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Show success message
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const isExpired = (validTo: string) => {
    return new Date(validTo) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Quản lý Voucher & Phần thưởng
          </CardTitle>
          <CardDescription>
            Xem và quản lý voucher, phần thưởng của bạn
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm voucher, phần thưởng..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Tất cả danh mục</option>
                <option value="Sự kiện">Sự kiện</option>
                <option value="Đăng ký">Đăng ký</option>
                <option value="Đặc biệt">Đặc biệt</option>
                <option value="Quà tặng">Quà tặng</option>
                <option value="Voucher">Voucher</option>
              </select>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="active">Hoạt động</option>
                <option value="used">Đã sử dụng</option>
                <option value="expired">Hết hạn</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs defaultValue="vouchers" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="vouchers">Voucher ({mockVouchers.length})</TabsTrigger>
          <TabsTrigger value="rewards">Phần thưởng ({mockRewards.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="vouchers" className="space-y-4">
          {filteredVouchers.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy voucher nào
                </h3>
                <p className="text-gray-500">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVouchers.map((voucher) => (
                <Card key={voucher.id} className={`relative ${
                  voucher.status === 'expired' || isExpired(voucher.validTo) 
                    ? 'opacity-60' 
                    : 'hover:shadow-md'
                } transition-shadow`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{voucher.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {voucher.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(voucher.status)}
                        {getStatusBadge(voucher.status)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Giá trị:</span>
                        <span className="font-medium">
                          {voucher.discountType === 'percentage' 
                            ? `${voucher.discountValue}%` 
                            : `${voucher.discountValue.toLocaleString()} VNĐ`
                          }
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Điểm cần:</span>
                        <span className="font-medium text-blue-600">
                          {voucher.pointsRequired} điểm
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Hạn sử dụng:</span>
                        <span className="font-medium">
                          {formatDate(voucher.validTo)}
                        </span>
                      </div>
                    </div>

                    {voucher.status === 'active' && !isExpired(voucher.validTo) && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm font-mono">{voucher.code}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(voucher.code)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <Button className="w-full" size="sm">
                          Sử dụng ngay
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rewards" className="space-y-4">
          {filteredRewards.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Không tìm thấy phần thưởng nào
                </h3>
                <p className="text-gray-500">
                  Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRewards.map((reward) => (
                <Card key={reward.id} className={`relative ${
                  !reward.available 
                    ? 'opacity-60' 
                    : 'hover:shadow-md'
                } transition-shadow`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{reward.title}</CardTitle>
                        <CardDescription className="mt-1">
                          {reward.description}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        {reward.available ? (
                          <Badge className="bg-green-100 text-green-800">Có sẵn</Badge>
                        ) : (
                          <Badge className="bg-gray-100 text-gray-800">Đã đổi</Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                      <img
                        src={reward.imageUrl}
                        alt={reward.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Điểm cần:</span>
                        <span className="font-medium text-blue-600">
                          {reward.pointsRequired} điểm
                        </span>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Danh mục:</span>
                        <span className="font-medium">{reward.category}</span>
                      </div>
                      
                      {reward.redeemedAt && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Đã đổi:</span>
                          <span className="font-medium text-green-600">
                            {formatDate(reward.redeemedAt)}
                          </span>
                        </div>
                      )}
                    </div>

                    {reward.available ? (
                      <Button className="w-full" size="sm">
                        <Gift className="h-4 w-4 mr-2" />
                        Đổi ngay
                      </Button>
                    ) : (
                      <Button variant="outline" className="w-full" size="sm" disabled>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Đã đổi
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
