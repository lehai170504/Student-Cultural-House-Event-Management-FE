"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Gift, Star, Users, Clock } from "lucide-react";

interface Reward {
  id: number;
  name: string;
  description: string;
  points: number;
  image: string;
  category: string;
  stock: number;
  popular: boolean;
}

const popularRewards: Reward[] = [
  {
    id: 1,
    name: "Cốc giữ nhiệt cao cấp",
    description: "Cốc giữ nhiệt 500ml với thiết kế đẹp mắt, phù hợp cho sinh viên",
    points: 500,
    image: "https://source.unsplash.com/300x300/?thermos,cup",
    category: "Đồ dùng",
    stock: 15,
    popular: true
  },
  {
    id: 2,
    name: "Áo thun trường",
    name: "Áo thun trường",
    description: "Áo thun cotton 100% với logo trường, size S-XL",
    points: 800,
    image: "https://source.unsplash.com/300x300/?tshirt,university",
    category: "Thời trang",
    stock: 8,
    popular: true
  },
  {
    id: 3,
    name: "Balo du lịch",
    description: "Balo 30L chống nước, phù hợp cho các chuyến đi",
    points: 1200,
    image: "https://source.unsplash.com/300x300/?backpack,travel",
    category: "Phụ kiện",
    stock: 5,
    popular: false
  },
  {
    id: 4,
    name: "Sách kỹ năng mềm",
    description: "Bộ sách phát triển kỹ năng mềm cho sinh viên",
    points: 300,
    image: "https://source.unsplash.com/300x300/?books,education",
    category: "Sách",
    stock: 20,
    popular: true
  },
  {
    id: 5,
    name: "Tai nghe Bluetooth",
    description: "Tai nghe không dây chất lượng cao, pin 8 tiếng",
    points: 2000,
    image: "https://source.unsplash.com/300x300/?headphones,wireless",
    category: "Điện tử",
    stock: 3,
    popular: false
  },
  {
    id: 6,
    name: "Voucher ăn uống",
    description: "Voucher 100k tại các quán ăn gần trường",
    points: 600,
    image: "https://source.unsplash.com/300x300/?food,voucher",
    category: "Voucher",
    stock: 50,
    popular: true
  }
];

export default function RewardsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-orange-50 to-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Gift className="h-8 w-8 text-orange-500" />
            <h2 className="text-4xl font-bold text-gray-800">
              Khu vực đổi quà
            </h2>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Tích điểm từ các hoạt động và đổi lấy những phần quà hấp dẫn. 
            Càng tham gia nhiều, càng có nhiều cơ hội nhận quà!
          </p>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Star className="h-6 w-6 text-yellow-500" />
              <span className="text-2xl font-bold text-gray-800">150+</span>
            </div>
            <p className="text-gray-600">Phần quà đa dạng</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Users className="h-6 w-6 text-blue-500" />
              <span className="text-2xl font-bold text-gray-800">2,500+</span>
            </div>
            <p className="text-gray-600">Thành viên tích cực</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Clock className="h-6 w-6 text-green-500" />
              <span className="text-2xl font-bold text-gray-800">24/7</span>
            </div>
            <p className="text-gray-600">Đổi quà mọi lúc</p>
          </div>
        </div>

        {/* Rewards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {popularRewards.map((reward) => (
            <div
              key={reward.id}
              className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={reward.image}
                  alt={reward.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {reward.popular && (
                  <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                    Phổ biến
                  </Badge>
                )}
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                  <span className="text-sm font-semibold text-gray-800">
                    {reward.points} điểm
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-bold text-gray-800 line-clamp-1">
                    {reward.name}
                  </h3>
                  <Badge variant="outline" className="text-xs">
                    {reward.category}
                  </Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {reward.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock className="h-4 w-4" />
                    <span>Còn {reward.stock} sản phẩm</span>
                  </div>
                  
                  <Button
                    size="sm"
                    className="bg-orange-500 hover:bg-orange-600 text-white"
                    disabled={reward.stock === 0}
                  >
                    {reward.stock === 0 ? "Hết hàng" : "Đổi ngay"}
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Button
            asChild
            size="lg"
            className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/gifts">
              <Gift className="h-5 w-5 mr-2" />
              Xem tất cả quà
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
