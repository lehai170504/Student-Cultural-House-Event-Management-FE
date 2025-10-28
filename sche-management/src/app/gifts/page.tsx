"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Gift, Search, Filter, Star, ChevronLeft, ChevronRight } from "lucide-react";
import PublicNavbar from "@/components/PublicNavbar";

type RewardCategory = "voucher" | "souvenir" | "apparel" | "ticket";

interface Reward {
  id: number;
  name: string;
  description: string;
  points: number;
  image: string;
  category: RewardCategory;
  inStock: boolean;
  createdAt: string; // ISO date string for sorting newest
}

const ALL_REWARDS: Reward[] = [
  {
    id: 1,
    name: "Voucher ăn uống 100k",
    description: "Áp dụng tại các quán ăn đối tác gần trường.",
    points: 600,
    image: "https://source.unsplash.com/600x400/?voucher,food",
    category: "voucher",
    inStock: true,
    createdAt: "2025-09-01",
  },
  {
    id: 2,
    name: "Cốc lưu niệm NVH",
    description: "Cốc sứ in logo NVH, dung tích 350ml.",
    points: 500,
    image: "https://source.unsplash.com/600x400/?mug,cup",
    category: "souvenir",
    inStock: true,
    createdAt: "2025-08-18",
  },
  {
    id: 3,
    name: "Áo thun NVH",
    description: "Áo thun cotton 100% nhiều size S-XL.",
    points: 800,
    image: "https://source.unsplash.com/600x400/?tshirt",
    category: "apparel",
    inStock: true,
    createdAt: "2025-09-20",
  },
  {
    id: 4,
    name: "Balo NVH",
    description: "Balo chống nước 25L phù hợp đi học/du lịch.",
    points: 1500,
    image: "https://source.unsplash.com/600x400/?backpack",
    category: "apparel",
    inStock: false,
    createdAt: "2025-07-02",
  },
  {
    id: 5,
    name: "Vé sự kiện đặc biệt",
    description: "Tham gia đêm nhạc/vở diễn do NVH tổ chức.",
    points: 1200,
    image: "https://source.unsplash.com/600x400/?ticket,concert",
    category: "ticket",
    inStock: true,
    createdAt: "2025-09-25",
  },
  {
    id: 6,
    name: "Móc khóa lưu niệm",
    description: "Móc khóa kim loại khắc laser logo NVH.",
    points: 300,
    image: "https://source.unsplash.com/600x400/?keychain",
    category: "souvenir",
    inStock: true,
    createdAt: "2025-06-30",
  },
];

const CATEGORY_LABEL: Record<RewardCategory, string> = {
  voucher: "🎫 Voucher ăn uống",
  souvenir: "🎁 Quà lưu niệm",
  apparel: "👕 Áo, balo, áo thun NVH",
  ticket: "🎟️ Vé sự kiện đặc biệt",
};

export default function GiftsPage() {
  // Giả lập điểm hiện có của người dùng
  const [userPoints] = useState<number>(780);

  // UI & Query states
  const [query, setQuery] = useState<string>("");
  const [selectedCategories, setSelectedCategories] = useState<Record<RewardCategory, boolean>>({
    voucher: false,
    souvenir: false,
    apparel: false,
    ticket: false,
  });
  const [sortBy, setSortBy] = useState<"pointsAsc" | "newest">("pointsAsc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize] = useState<number>(9);
  const [openRewardId, setOpenRewardId] = useState<number | null>(null);

  const filteredSortedRewards = useMemo(() => {
    const activeCats = Object.entries(selectedCategories)
      .filter(([, v]) => v)
      .map(([k]) => k as RewardCategory);

    let list = ALL_REWARDS.filter((r) => {
      const matchesQuery = r.name.toLowerCase().includes(query.toLowerCase());
      const matchesCat = activeCats.length ? activeCats.includes(r.category) : true;
      return matchesQuery && matchesCat;
    });

    if (sortBy === "pointsAsc") {
      list = list.sort((a, b) => a.points - b.points);
    } else {
      list = list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    return list;
  }, [query, selectedCategories, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredSortedRewards.length / pageSize) || 1;
  const start = (currentPage - 1) * pageSize;
  const current = filteredSortedRewards.slice(start, start + pageSize);

  const toggleCategory = (key: RewardCategory, checked: boolean) => {
    setCurrentPage(1);
    setSelectedCategories((prev) => ({ ...prev, [key]: checked }));
  };

  const openDetails = (id: number) => setOpenRewardId(id);
  const closeDetails = () => setOpenRewardId(null);

  const activeReward = useMemo(() => ALL_REWARDS.find((r) => r.id === openRewardId) || null, [openRewardId]);
  const similarRewards = useMemo(() => {
    if (!activeReward) return [] as Reward[];
    return ALL_REWARDS.filter((r) => r.category === activeReward.category && r.id !== activeReward.id).slice(0, 3);
  }, [activeReward]);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <PublicNavbar />
      <section className="py-10 bg-gradient-to-r from-orange-50 to-white border-b">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Gift className="h-6 w-6 text-orange-500" />
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Khu vực đổi quà</h1>
          </div>
          <p className="text-center text-gray-600">Bạn đang có <span className="font-semibold text-gray-900">{userPoints}</span> điểm</p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Search */}
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); setCurrentPage(1); }}
                  placeholder="Tìm theo tên quà..."
                  className="pl-10 pr-4 py-3 rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Sort & Filter */}
            <div className="flex items-center justify-between md:justify-end gap-2 flex-wrap">
              <Select value={sortBy} onValueChange={(v) => { setSortBy(v as any); setCurrentPage(1); }}>
                <SelectTrigger className="w-full sm:w-[190px]">
                  <SelectValue placeholder="Sắp xếp" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pointsAsc">Ít điểm → Nhiều điểm</SelectItem>
                  <SelectItem value="newest">Mới nhất</SelectItem>
                </SelectContent>
              </Select>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 w-full sm:w-auto"><Filter className="h-4 w-4" />Bộ lọc</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  {(Object.keys(CATEGORY_LABEL) as RewardCategory[]).map((key) => (
                    <DropdownMenuCheckboxItem
                      key={key}
                      checked={selectedCategories[key]}
                      onCheckedChange={(c) => toggleCategory(key, Boolean(c))}
                    >
                      {CATEGORY_LABEL[key]}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </section>

      {/* Reward Grid */}
      <section className="py-10">
        <div className="container mx-auto px-4 sm:px-6">
          {current.length ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {current.map((r) => {
                const canRedeem = r.inStock && userPoints >= r.points;
                const needMore = Math.max(0, r.points - userPoints);
                return (
                  <div key={r.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="relative h-44 sm:h-48">
                      <Image src={r.image} alt={r.name} fill className="object-cover" />
                      {r.inStock ? (
                        <Badge className="absolute top-3 left-3 bg-green-500 text-white">Còn hàng</Badge>
                      ) : (
                        <Badge className="absolute top-3 left-3 bg-gray-400 text-white">Hết quà</Badge>
                      )}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                        <span className="text-xs sm:text-sm font-semibold text-gray-800">{r.points} điểm</span>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <h3 className="text-base sm:text-lg font-bold text-gray-800 line-clamp-2">{r.name}</h3>
                        <Star className="h-4 w-4 text-yellow-500 opacity-0 group-hover:opacity-100" />
                      </div>
                      <p className="text-xs sm:text-sm text-gray-600 line-clamp-2 mb-3">{r.description}</p>
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                        {canRedeem ? (
                          <Button className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto" onClick={() => openDetails(r.id)}>
                            Đổi ngay
                          </Button>
                        ) : (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button disabled className="bg-orange-500 text-white opacity-70 w-full sm:w-auto">Đổi ngay</Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{r.inStock ? `Bạn cần thêm ${needMore} điểm nữa` : "Quà đã hết"}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                        <Button variant="outline" className="w-full sm:w-auto" onClick={() => openDetails(r.id)}>Xem chi tiết</Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-16 text-gray-500">Không tìm thấy quà phù hợp</div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="flex items-center gap-1"
              >
                <ChevronLeft className="h-4 w-4" /> Trước
              </Button>
              <div className="flex items-center gap-1 flex-wrap justify-center">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    size="sm"
                    variant={currentPage === page ? "default" : "outline"}
                    className={currentPage === page ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="flex items-center gap-1"
              >
                Sau <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Reward Details Modal */}
      <Dialog open={Boolean(activeReward)} onOpenChange={(o) => !o && closeDetails()}>
        <DialogContent className="w-[95vw] sm:max-w-xl md:max-w-3xl p-0 overflow-hidden">
          {activeReward && (
            <div className="grid md:grid-cols-2">
              <div className="relative h-56 md:h-full min-h-[260px]">
                <Image src={activeReward.image} alt={activeReward.name} fill className="object-cover" />
              </div>
              <div className="p-4 sm:p-6">
                <DialogHeader>
                  <DialogTitle className="text-xl sm:text-2xl font-bold text-gray-800">
                    {activeReward.name}
                  </DialogTitle>
                </DialogHeader>
                <p className="text-gray-600 mt-2 mb-4">{activeReward.description}</p>
                <div className="flex items-center gap-2 mb-4">
                  <Badge className="bg-orange-500 text-white">{activeReward.points} điểm</Badge>
                  {activeReward.inStock ? (
                    <Badge className="bg-green-500 text-white">Còn hàng</Badge>
                  ) : (
                    <Badge className="bg-gray-400 text-white">Hết quà</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white">Xác nhận đổi quà</Button>
                  <Button variant="outline" asChild>
                    <Link href="#">Quy định đổi quà</Link>
                  </Button>
                </div>

                {similarRewards.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Gợi ý quà tương tự</h4>
                    <div className="grid grid-cols-2 gap-3">
                      {similarRewards.map((s) => (
                        <div key={s.id} className="bg-gray-50 rounded-lg overflow-hidden cursor-pointer" onClick={() => openDetails(s.id)}>
                          <div className="relative h-24">
                            <Image src={s.image} alt={s.name} fill className="object-cover" />
                          </div>
                          <div className="p-2">
                            <p className="text-sm font-medium line-clamp-1">{s.name}</p>
                            <span className="text-xs text-gray-600">{s.points} điểm</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}


