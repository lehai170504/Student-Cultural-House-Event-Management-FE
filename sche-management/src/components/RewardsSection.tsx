import { Gift, Star, Users, Clock, Zap, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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
    description:
      "Cốc giữ nhiệt 500ml với thiết kế đẹp mắt, phù hợp cho sinh viên",
    points: 500,
    image:
      "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=400&h=400&fit=crop",
    category: "Đồ dùng",
    stock: 15,
    popular: true,
  },
  {
    id: 2,
    name: "Áo thun trường",
    description: "Áo thun cotton 100% với logo trường, size S-XL",
    points: 800,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    category: "Thời trang",
    stock: 8,
    popular: true,
  },
  {
    id: 3,
    name: "Balo du lịch",
    description: "Balo 30L chống nước, phù hợp cho các chuyến đi",
    points: 1200,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    category: "Phụ kiện",
    stock: 5,
    popular: false,
  },
  {
    id: 4,
    name: "Sách kỹ năng mềm",
    description: "Bộ sách phát triển kỹ năng mềm cho sinh viên",
    points: 300,
    image:
      "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=400&fit=crop",
    category: "Sách",
    stock: 20,
    popular: true,
  },
  {
    id: 5,
    name: "Tai nghe Bluetooth",
    description: "Tai nghe không dây chất lượng cao, pin 8 tiếng",
    points: 2000,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    category: "Điện tử",
    stock: 3,
    popular: false,
  },
  {
    id: 6,
    name: "Voucher ăn uống",
    description: "Voucher 100k tại các quán ăn gần trường",
    points: 600,
    image:
      "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=400&fit=crop",
    category: "Voucher",
    stock: 50,
    popular: true,
  },
];

export default function RewardsSection() {
  return (
    <section className="relative py-20 md:py-28 bg-gradient-to-br from-orange-50 via-amber-100/50 to-white overflow-hidden">
      {/* Decorative glowing circles */}
      <div className="absolute top-0 -right-20 w-[400px] h-[400px] bg-orange-300/30 rounded-full blur-3xl animate-pulse" />
      <div
        className="absolute bottom-0 -left-20 w-[400px] h-[400px] bg-amber-200/40 rounded-full blur-3xl animate-pulse"
        style={{ animationDelay: "1s" }}
      />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-600 px-5 py-2 rounded-full mb-5 shadow-sm animate-fadeIn">
            <Gift className="w-5 h-5" />
            <span className="font-semibold tracking-wide">
              Phần thưởng hấp dẫn
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-extrabold mb-4 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-400 bg-clip-text text-transparent">
            Đổi điểm lấy quà
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tích điểm từ các hoạt động và đổi lấy những phần quà hấp dẫn. Càng
            tham gia nhiều, càng có nhiều cơ hội nhận quà giá trị!
          </p>
        </div>

        {/* Stats section */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-20">
          {[
            {
              icon: <Star className="w-6 h-6 text-yellow-500" />,
              title: "150+",
              subtitle: "Phần quà đa dạng",
              gradient: "from-amber-100 to-orange-50",
            },
            {
              icon: <Users className="w-6 h-6 text-blue-500" />,
              title: "2,500+",
              subtitle: "Thành viên tích cực",
              gradient: "from-blue-100 to-teal-50",
            },
            {
              icon: <Clock className="w-6 h-6 text-green-500" />,
              title: "24/7",
              subtitle: "Đổi quà mọi lúc",
              gradient: "from-green-100 to-emerald-50",
            },
          ].map((item, index) => (
            <div
              key={index}
              className={`rounded-2xl p-6 bg-gradient-to-br ${item.gradient} shadow-md hover:shadow-xl border border-white/40 transition-all duration-300 hover:-translate-y-2`}
            >
              <div className="flex items-center justify-between mb-3">
                {item.icon}
                <TrendingUp className="w-5 h-5 text-muted-foreground/50" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">
                {item.title}
              </div>
              <p className="text-muted-foreground font-medium">
                {item.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Rewards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {popularRewards.map((reward, index) => (
            <div
              key={reward.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-orange-100 transition-all duration-500 hover:-translate-y-2 animate-fadeInUp"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={reward.image}
                  alt={reward.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                {reward.popular && (
                  <Badge className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-md border-none px-3 py-1.5 text-sm font-semibold flex items-center gap-1">
                    <Star className="w-4 h-4 fill-current" /> Phổ biến
                  </Badge>
                )}

                <Badge className="absolute top-4 right-4 bg-white/90 text-foreground shadow-md backdrop-blur-sm border-0">
                  {reward.category}
                </Badge>

                <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-full px-4 py-1.5 shadow-md flex items-center gap-1">
                  <Zap className="w-4 h-4 text-orange-500" />
                  <span className="font-semibold text-foreground text-sm">
                    {reward.points}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-lg font-bold text-foreground mb-2 line-clamp-2 group-hover:text-orange-600 transition-colors">
                  {reward.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {reward.description}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Còn {reward.stock}</span>
                  </div>

                  <Button
                    size="sm"
                    className={`rounded-xl transition-all duration-300 ${
                      reward.stock === 0
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500 text-white shadow-md hover:shadow-lg hover:scale-105"
                    }`}
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
            size="lg"
            className="bg-gradient-to-r from-orange-500 via-orange-400 to-amber-300 hover:from-orange-600 hover:to-amber-400 text-white px-10 py-6 text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            onClick={() => (window.location.href = "/gifts")}
          >
            <Gift className="w-5 h-5 mr-2" />
            Xem tất cả phần quà
          </Button>
        </div>
      </div>
    </section>
  );
}
