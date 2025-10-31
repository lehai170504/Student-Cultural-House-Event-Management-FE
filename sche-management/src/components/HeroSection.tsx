"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  buttonText: string;
  buttonLink: string;
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Chào mừng đến với Nhà Văn Hóa Sinh Viên",
    subtitle: "Nơi tổ chức sự kiện, giao lưu văn hóa",
    description:
      "Tham gia các hoạt động văn hóa, nghệ thuật và giao lưu với cộng đồng sinh viên",
    image:
      "https://baobinhduong.vn/image/fckeditor/upload/2023/20230515/images/mua%20tdm.jpg",
    buttonText: "Khám phá sự kiện",
    buttonLink: "/events",
  },
  {
    id: 2,
    title: "Đêm nhạc Sinh Viên 2025",
    subtitle: "Trải nghiệm âm nhạc đỉnh cao",
    description:
      "Cùng thưởng thức những giai điệu tuyệt vời từ các nghệ sĩ sinh viên tài năng",
    image:
      "https://cdn2.tuoitre.vn/thumb_w/480/471584752817336320/2024/1/28/nhac-cu-dan-toc-1706407688401234836648.jpg",
    buttonText: "Tham gia ngay",
    buttonLink: "/events",
  },
  {
    id: 3,
    title: "Lễ hội Văn Hóa Quốc Tế",
    subtitle: "Khám phá đa dạng văn hóa thế giới",
    description:
      "Trải nghiệm ẩm thực, trang phục và truyền thống từ khắp nơi trên thế giới",
    image: "https://kientrucvietnam.org.vn/wp-content/uploads/2021/06/0707.jpg",
    buttonText: "Xem chi tiết",
    buttonLink: "/events",
  },
  {
    id: 4,
    title: "Workshop Khởi Nghiệp",
    subtitle: "Học hỏi từ các chuyên gia",
    description:
      "Phát triển kỹ năng kinh doanh và tư duy khởi nghiệp từ những người thành công",
    image: "https://kientrucvietnam.org.vn/wp-content/uploads/2021/06/0707.jpg",
    buttonText: "Đăng ký",
    buttonLink: "/events",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const goToSlide = (index: number) => setCurrentSlide(index);
  const goToPrevious = () =>
    setCurrentSlide(
      (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
    );
  const goToNext = () =>
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);

  return (
    <section className="relative h-[70vh] md:h-screen overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6 text-center text-white">
          <div className="max-w-4xl mx-auto px-2">
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold mb-3 sm:mb-4">
              {heroSlides[currentSlide].title}
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl mb-3 sm:mb-4 text-orange-300">
              {heroSlides[currentSlide].subtitle}
            </h2>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 max-w-2xl mx-auto">
              {heroSlides[currentSlide].description}
            </p>
            <Button
              size="lg"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              onClick={() =>
                (window.location.href = heroSlides[currentSlide].buttonLink)
              }
            >
              {heroSlides[currentSlide].buttonText}
            </Button>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-20">
        <Button variant="outline" size="icon" onClick={goToPrevious}>
          &#8592;
        </Button>
      </div>
      <div className="absolute top-1/2 right-4 transform -translate-y-1/2 z-20">
        <Button variant="outline" size="icon" onClick={goToNext}>
          &#8594;
        </Button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {heroSlides.map((_, index) => (
          <Button
            key={index}
            variant={index === currentSlide ? "default" : "outline"}
            size="icon"
            className={`w-3 h-3 rounded-full p-0 ${
              index === currentSlide ? "bg-orange-500" : "bg-white/50"
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}
