// OverviewCards.tsx
import StatCard from "./StatCard";
import { Package, Award, Warehouse, Tags, Users } from "lucide-react";

interface OverviewCardsProps {
  data: {
    totalProducts: number;
    totalRedeems: number;
    totalCoinsSpent: number;
    avgRedeemValue: number;
    avgRedeemPerStudent: number;
  };
  loading: boolean;
}

const formatCoin = (value: number) => `${value.toLocaleString()} COIN`;
const formatNumber = (value: number) => `${value.toLocaleString()}`;

export default function OverviewCards({ data, loading }: OverviewCardsProps) {
  const {
    totalProducts,
    totalRedeems,
    totalCoinsSpent,
    avgRedeemValue,
    avgRedeemPerStudent,
  } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      <StatCard
        title="Tổng Sản phẩm"
        value={totalProducts}
        icon={<Package className="w-6 h-6 text-indigo-500" />}
        change={"+12 sp"}
        positive={true}
        isLoading={loading}
      />
      <StatCard
        title="Tổng lượt đổi thưởng"
        value={totalRedeems}
        icon={<Award className="w-6 h-6 text-green-500" />}
        change="+15%"
        positive={true}
        isLoading={loading}
      />
      <StatCard
        title="Xu đã chi (Tổng)"
        value={totalCoinsSpent}
        icon={<Tags className="w-6 h-6 text-blue-500" />}
        change={"+8%"}
        positive={true}
        valueFormat={formatCoin}
        isLoading={loading}
      />
      <StatCard
        title="Giá trị đổi thưởng TB"
        value={avgRedeemValue}
        icon={<Warehouse className="w-6 h-6 text-red-500" />}
        change="-3%"
        positive={false}
        valueFormat={formatCoin}
        isLoading={loading}
      />
      <StatCard
        title="TB Đổi/Sinh viên"
        value={avgRedeemPerStudent}
        icon={<Users className="w-6 h-6 text-yellow-500" />}
        change="+1.2%"
        positive={true}
        valueFormat={formatNumber}
        isLoading={loading}
      />
    </div>
  );
}
