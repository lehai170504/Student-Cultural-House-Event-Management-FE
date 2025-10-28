"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter, 
  Music, 
  Globe, 
  GraduationCap, 
  Heart, 
  Gamepad2, 
  Camera,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import PublicNavbar from "@/components/PublicNavbar";

interface EventCategory {
  id: number;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  description: string;
  eventCount: number;
}

const eventCategories: EventCategory[] = [
  {
    id: 1,
    name: "Âm nhạc & Nghệ thuật",
    icon: Music,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "Các sự kiện âm nhạc, biểu diễn nghệ thuật và văn hóa",
    eventCount: 8
  },
  {
    id: 2,
    name: "Văn hóa & Quốc tế",
    icon: Globe,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Sự kiện giao lưu văn hóa và quốc tế",
    eventCount: 12
  },
  {
    id: 3,
    name: "Học tập & Phát triển",
    icon: GraduationCap,
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "Workshop, seminar và các hoạt động học tập",
    eventCount: 15
  },
  {
    id: 4,
    name: "Thể thao & Sức khỏe",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Các hoạt động thể thao và sức khỏe",
    eventCount: 6
  },
  {
    id: 5,
    name: "Giải trí & Game",
    icon: Gamepad2,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    description: "Các hoạt động giải trí và game",
    eventCount: 9
  },
  {
    id: 6,
    name: "Nhiếp ảnh & Sáng tạo",
    icon: Camera,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    description: "Các hoạt động sáng tạo và nhiếp ảnh",
    eventCount: 5
  }
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);

  const filteredCategories = eventCategories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* Search & Filter */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>

            {/* Filter */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setSelectedCategory(null)}
              >
                <Filter className="h-4 w-4" />
                Tất cả ({eventCategories.reduce((sum, cat) => sum + cat.eventCount, 0)})
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCategories.map((category) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={category.id}
                  href={`/events/category/${category.id}`}
                  className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-orange-200"
                >
                  <div className="p-6">
                    {/* Icon & Title */}
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`p-3 rounded-xl ${category.bgColor}`}>
                        <IconComponent className={`h-6 w-6 ${category.color}`} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800 group-hover:text-orange-600 transition-colors">
                          {category.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {category.eventCount} sự kiện
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    {/* Stats */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4" />
                        <span>Đang diễn ra</span>
                      </div>
                    </div>

                    {/* Click hint */}
                    <div className="mt-4 text-center">
                      <span className="text-sm text-orange-500 font-medium group-hover:text-orange-600">
                        Xem sự kiện →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* No results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Không tìm thấy sự kiện
              </h3>
              <p className="text-gray-500">
                Thử tìm kiếm với từ khóa khác hoặc xem tất cả sự kiện
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
