"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { 
  Music, 
  Globe, 
  GraduationCap, 
  Heart, 
  Gamepad2, 
  Camera,
  Calendar,
  MapPin,
  Users,
  Clock
} from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  participants: number;
  image: string;
  status: "upcoming" | "ongoing" | "completed";
}

interface EventCategory {
  id: number;
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  description: string;
  events: Event[];
}

const eventCategories: EventCategory[] = [
  {
    id: 1,
    name: "Âm nhạc & Nghệ thuật",
    icon: Music,
    color: "text-purple-600",
    bgColor: "bg-purple-100",
    description: "Các sự kiện âm nhạc, biểu diễn nghệ thuật và văn hóa",
    events: [
      {
        id: 1,
        title: "Đêm nhạc Sinh Viên 2025",
        description: "Chương trình biểu diễn âm nhạc với sự tham gia của các nghệ sĩ sinh viên tài năng",
        date: "20/10/2025",
        time: "19:00 - 22:00",
        location: "Hội trường lớn",
        participants: 500,
        image: "https://source.unsplash.com/400x300/?concert,music",
        status: "upcoming"
      },
      {
        id: 2,
        title: "Triển lãm nghệ thuật sinh viên",
        description: "Triển lãm các tác phẩm nghệ thuật của sinh viên khoa Mỹ thuật",
        date: "15/11/2025",
        time: "09:00 - 17:00",
        location: "Phòng triển lãm",
        participants: 200,
        image: "https://source.unsplash.com/400x300/?art,exhibition",
        status: "upcoming"
      }
    ]
  },
  {
    id: 2,
    name: "Văn hóa & Quốc tế",
    icon: Globe,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    description: "Sự kiện giao lưu văn hóa và quốc tế",
    events: [
      {
        id: 3,
        title: "Lễ hội Văn Hóa Quốc Tế",
        description: "Trải nghiệm đa dạng văn hóa từ khắp nơi trên thế giới",
        date: "05/11/2025",
        time: "10:00 - 18:00",
        location: "Sân ngoài trời",
        participants: 1000,
        image: "https://source.unsplash.com/400x300/?festival,culture",
        status: "upcoming"
      },
      {
        id: 4,
        title: "Ngày hội ẩm thực thế giới",
        description: "Thưởng thức các món ăn đặc trưng từ nhiều quốc gia",
        date: "12/12/2025",
        time: "11:00 - 19:00",
        location: "Khu ẩm thực",
        participants: 800,
        image: "https://source.unsplash.com/400x300/?food,international",
        status: "upcoming"
      }
    ]
  },
  {
    id: 3,
    name: "Học tập & Phát triển",
    icon: GraduationCap,
    color: "text-green-600",
    bgColor: "bg-green-100",
    description: "Workshop, seminar và các hoạt động học tập",
    events: [
      {
        id: 5,
        title: "Workshop Khởi Nghiệp",
        description: "Học hỏi kinh nghiệm từ các doanh nhân thành công",
        date: "15/12/2025",
        time: "14:00 - 17:00",
        location: "Phòng 204",
        participants: 150,
        image: "https://source.unsplash.com/400x300/?workshop,business",
        status: "upcoming"
      },
      {
        id: 6,
        title: "Seminar Kỹ năng mềm",
        description: "Phát triển kỹ năng giao tiếp và làm việc nhóm",
        date: "22/12/2025",
        time: "09:00 - 12:00",
        location: "Phòng hội thảo",
        participants: 100,
        image: "https://source.unsplash.com/400x300/?seminar,skills",
        status: "upcoming"
      }
    ]
  },
  {
    id: 4,
    name: "Thể thao & Sức khỏe",
    icon: Heart,
    color: "text-red-600",
    bgColor: "bg-red-100",
    description: "Các hoạt động thể thao và sức khỏe",
    events: [
      {
        id: 7,
        title: "Giải bóng đá sinh viên",
        description: "Giải đấu bóng đá giữa các khoa trong trường",
        date: "25/11/2025",
        time: "08:00 - 18:00",
        location: "Sân vận động",
        participants: 300,
        image: "https://source.unsplash.com/400x300/?football,sports",
        status: "upcoming"
      }
    ]
  },
  {
    id: 5,
    name: "Giải trí & Game",
    icon: Gamepad2,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
    description: "Các hoạt động giải trí và game",
    events: [
      {
        id: 8,
        title: "Tournament Game Online",
        description: "Giải đấu game online với nhiều thể loại",
        date: "30/11/2025",
        time: "19:00 - 23:00",
        location: "Phòng máy tính",
        participants: 200,
        image: "https://source.unsplash.com/400x300/?gaming,esports",
        status: "upcoming"
      }
    ]
  },
  {
    id: 6,
    name: "Nhiếp ảnh & Sáng tạo",
    icon: Camera,
    color: "text-indigo-600",
    bgColor: "bg-indigo-100",
    description: "Các hoạt động sáng tạo và nhiếp ảnh",
    events: [
      {
        id: 9,
        title: "Cuộc thi nhiếp ảnh sinh viên",
        description: "Thể hiện tài năng nhiếp ảnh với chủ đề tự do",
        date: "10/12/2025",
        time: "08:00 - 20:00",
        location: "Toàn trường",
        participants: 150,
        image: "https://source.unsplash.com/400x300/?photography,contest",
        status: "upcoming"
      }
    ]
  }
];

export default function EventCategoriesSection() {
  const [selectedCategory, setSelectedCategory] = useState<EventCategory | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCategoryClick = (category: EventCategory) => {
    setSelectedCategory(category);
    setIsDialogOpen(true);
  };

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

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Sự kiện nổi bật
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Khám phá các loại sự kiện đa dạng và tham gia những hoạt động thú vị
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <div
                key={category.id}
                onClick={() => handleCategoryClick(category)}
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
                        {category.events.length} sự kiện
                      </p>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {category.description}
                  </p>

                  {/* Events Preview */}
                  <div className="space-y-2">
                    {category.events.slice(0, 2).map((event) => (
                      <div key={event.id} className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-600 truncate">{event.title}</span>
                        <Badge className={`text-xs ${getStatusColor(event.status)}`}>
                          {getStatusText(event.status)}
                        </Badge>
                      </div>
                    ))}
                    {category.events.length > 2 && (
                      <p className="text-sm text-orange-500 font-medium">
                        +{category.events.length - 2} sự kiện khác
                      </p>
                    )}
                  </div>

                  {/* Click hint */}
                  <div className="mt-4 text-center">
                    <span className="text-sm text-orange-500 font-medium group-hover:text-orange-600">
                      Click để xem chi tiết →
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dialog for Category Details */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                {selectedCategory && (
                  <>
                    <div className={`p-2 rounded-lg ${selectedCategory.bgColor}`}>
                      <selectedCategory.icon className={`h-6 w-6 ${selectedCategory.color}`} />
                    </div>
                    {selectedCategory.name}
                  </>
                )}
              </DialogTitle>
            </DialogHeader>

            {selectedCategory && (
              <div className="space-y-6">
                <p className="text-gray-600">{selectedCategory.description}</p>
                
                <div className="grid gap-4">
                  {selectedCategory.events.map((event) => (
                    <div key={event.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                          <Image
                            src={event.image}
                            alt={event.title}
                            width={96}
                            height={96}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-lg font-semibold text-gray-800">{event.title}</h4>
                            <Badge className={`${getStatusColor(event.status)}`}>
                              {getStatusText(event.status)}
                            </Badge>
                          </div>
                          
                          <p className="text-gray-600 mb-3">{event.description}</p>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{event.date} - {event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Users className="h-4 w-4 text-gray-400" />
                              <span>{event.participants} người tham gia</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>Đăng ký mở</span>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <Button 
                              size="sm" 
                              className="bg-orange-500 hover:bg-orange-600 text-white"
                            >
                              Tham gia ngay
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}
