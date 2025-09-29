"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Calendar,
  MapPin,
  Users,
  Star,
  ArrowLeft,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  maxParticipants: number;
  points: number;
  image: string;
  status: "upcoming" | "ongoing" | "completed";
  category: string;
}

const categoryData = {
  1: {
    name: "Âm nhạc & Nghệ thuật",
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "Các sự kiện âm nhạc, biểu diễn nghệ thuật và văn hóa"
  },
  2: {
    name: "Văn hóa & Quốc tế",
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Sự kiện giao lưu văn hóa và quốc tế"
  },
  3: {
    name: "Học tập & Phát triển",
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "Workshop, seminar và các hoạt động học tập"
  },
  4: {
    name: "Thể thao & Sức khỏe",
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Các hoạt động thể thao và sức khỏe"
  },
  5: {
    name: "Giải trí & Game",
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    description: "Các hoạt động giải trí và game"
  },
  6: {
    name: "Nhiếp ảnh & Sáng tạo",
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    description: "Các hoạt động sáng tạo và nhiếp ảnh"
  }
};

// Mock data for events
const mockEvents: Event[] = [
  {
    id: 1,
    title: "Đêm nhạc Sinh Viên 2025",
    description: "Chương trình biểu diễn âm nhạc với sự tham gia của các nghệ sĩ sinh viên tài năng",
    date: "20/10/2025",
    time: "19:00 - 22:00",
    location: "Hội trường lớn",
    participants: 350,
    maxParticipants: 500,
    points: 50,
    image: "https://source.unsplash.com/400x300/?concert,music",
    status: "upcoming",
    category: "Âm nhạc & Nghệ thuật"
  },
  {
    id: 2,
    title: "Triển lãm nghệ thuật sinh viên",
    description: "Triển lãm các tác phẩm nghệ thuật của sinh viên khoa Mỹ thuật",
    date: "15/11/2025",
    time: "09:00 - 17:00",
    location: "Phòng triển lãm",
    participants: 120,
    maxParticipants: 200,
    points: 30,
    image: "https://source.unsplash.com/400x300/?art,exhibition",
    status: "upcoming",
    category: "Âm nhạc & Nghệ thuật"
  },
  {
    id: 3,
    title: "Lễ hội Văn Hóa Quốc Tế",
    description: "Trải nghiệm đa dạng văn hóa từ khắp nơi trên thế giới",
    date: "05/11/2025",
    time: "10:00 - 18:00",
    location: "Sân ngoài trời",
    participants: 800,
    maxParticipants: 1000,
    points: 40,
    image: "https://source.unsplash.com/400x300/?festival,culture",
    status: "upcoming",
    category: "Văn hóa & Quốc tế"
  },
  {
    id: 4,
    title: "Workshop Khởi Nghiệp",
    description: "Học hỏi kinh nghiệm từ các doanh nhân thành công",
    date: "15/12/2025",
    time: "14:00 - 17:00",
    location: "Phòng 204",
    participants: 80,
    maxParticipants: 150,
    points: 60,
    image: "https://source.unsplash.com/400x300/?workshop,business",
    status: "upcoming",
    category: "Học tập & Phát triển"
  },
  {
    id: 5,
    title: "Giải bóng đá sinh viên",
    description: "Giải đấu bóng đá giữa các khoa trong trường",
    date: "25/11/2025",
    time: "08:00 - 18:00",
    location: "Sân vận động",
    participants: 200,
    maxParticipants: 300,
    points: 35,
    image: "https://source.unsplash.com/400x300/?football,sports",
    status: "upcoming",
    category: "Thể thao & Sức khỏe"
  },
  {
    id: 6,
    title: "Tournament Game Online",
    description: "Giải đấu game online với nhiều thể loại",
    date: "30/11/2025",
    time: "19:00 - 23:00",
    location: "Phòng máy tính",
    participants: 150,
    maxParticipants: 200,
    points: 25,
    image: "https://source.unsplash.com/400x300/?gaming,esports",
    status: "upcoming",
    category: "Giải trí & Game"
  },
  {
    id: 7,
    title: "Cuộc thi nhiếp ảnh sinh viên",
    description: "Thể hiện tài năng nhiếp ảnh với chủ đề tự do",
    date: "10/12/2025",
    time: "08:00 - 20:00",
    location: "Toàn trường",
    participants: 90,
    maxParticipants: 150,
    points: 45,
    image: "https://source.unsplash.com/400x300/?photography,contest",
    status: "upcoming",
    category: "Nhiếp ảnh & Sáng tạo"
  },
  {
    id: 8,
    title: "Seminar Kỹ năng mềm",
    description: "Phát triển kỹ năng giao tiếp và làm việc nhóm",
    date: "22/12/2025",
    time: "09:00 - 12:00",
    location: "Phòng hội thảo",
    participants: 60,
    maxParticipants: 100,
    points: 40,
    image: "https://source.unsplash.com/400x300/?seminar,skills",
    status: "upcoming",
    category: "Học tập & Phát triển"
  },
  {
    id: 9,
    title: "Ngày hội ẩm thực thế giới",
    description: "Thưởng thức các món ăn đặc trưng từ nhiều quốc gia",
    date: "12/12/2025",
    time: "11:00 - 19:00",
    location: "Khu ẩm thực",
    participants: 400,
    maxParticipants: 800,
    points: 20,
    image: "https://source.unsplash.com/400x300/?food,international",
    status: "upcoming",
    category: "Văn hóa & Quốc tế"
  }
];

export default function CategoryEventsPage({ params }: { params: { id: string } }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(6);
  
  const categoryId = parseInt(params.id);
  const category = categoryData[categoryId as keyof typeof categoryData];
  
  // Filter events by category
  const categoryEvents = mockEvents.filter(event => {
    const categoryName = category?.name;
    return event.category === categoryName;
  });
  
  // Filter by search term
  const filteredEvents = categoryEvents.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Pagination
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const endIndex = startIndex + eventsPerPage;
  const currentEvents = filteredEvents.slice(startIndex, endIndex);
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-700";
      case "ongoing":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "upcoming":
        return "Sắp diễn ra";
      case "ongoing":
        return "Đang diễn ra";
      case "completed":
        return "Đã kết thúc";
      default:
        return "Không xác định";
    }
  };

  if (!category) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Không tìm thấy danh mục</h1>
          <Link href="/events">
            <Button>Quay lại trang sự kiện</Button>
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className={`py-16 ${category.bgColor}`}>
        <div className="container mx-auto px-6">
          <div className="flex items-center gap-4 mb-6">
            <Link href="/events">
              <Button variant="ghost" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Quay lại
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className={`text-4xl md:text-5xl font-bold mb-4 ${category.color}`}>
              {category.name}
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              {category.description}
            </p>
            <div className="mt-4">
              <Badge className={`${category.bgColor} ${category.color} px-4 py-2 text-lg`}>
                {filteredEvents.length} sự kiện
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-6">
          <div className="max-w-md mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Tìm kiếm sự kiện..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-3 rounded-lg border-gray-200 focus:border-orange-500 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-12">
        <div className="container mx-auto px-6">
          {currentEvents.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {currentEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300">
                    {/* Event Image */}
                    <div className="relative h-48">
                      <Image
                        src={event.image}
                        alt={event.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <Badge className={`${getStatusColor(event.status)}`}>
                          {getStatusText(event.status)}
                        </Badge>
                      </div>
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-orange-500 text-white">
                          +{event.points} điểm
                        </Badge>
                      </div>
                    </div>

                    {/* Event Content */}
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {event.description}
                      </p>

                      {/* Event Details */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="h-4 w-4" />
                          <span>{event.date} - {event.time}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Users className="h-4 w-4" />
                          <span>{event.participants}/{event.maxParticipants} người</span>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Đã đăng ký</span>
                          <span>{Math.round((event.participants / event.maxParticipants) * 100)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(event.participants / event.maxParticipants) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Action Button */}
                      <Button 
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                        disabled={event.participants >= event.maxParticipants}
                      >
                        {event.participants >= event.maxParticipants ? "Đã đầy" : "Đăng ký ngay"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Trước
                  </Button>
                  
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page ? "bg-orange-500 hover:bg-orange-600 text-white" : ""}
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1"
                  >
                    Sau
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">
                Không có sự kiện nào
              </h3>
              <p className="text-gray-500">
                {searchTerm ? "Thử tìm kiếm với từ khóa khác" : "Chưa có sự kiện nào trong danh mục này"}
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
