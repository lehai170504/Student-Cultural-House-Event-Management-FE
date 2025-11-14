"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Calendar,
  MapPin,
  Sparkles,
} from "lucide-react";

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
      "Tham gia các hoạt động văn hóa, nghệ thuật và giao lưu cùng cộng đồng sinh viên năng động.",
    image:
      "https://www.nhavanhoasinhvien.vn/wp-content/uploads/bfi_thumb/slide-1-o7vxuvddx981jmy4pn1d4zv3aisbzkq2n9whu71u7m.jpg",
    buttonText: "Khám phá sự kiện",
    buttonLink: "/events",
  },
  {
    id: 2,
    title: "Đêm nhạc Sinh Viên 2025",
    subtitle: "Trải nghiệm âm nhạc đỉnh cao",
    description:
      "Cùng thưởng thức những giai điệu tuyệt vời từ các nghệ sĩ sinh viên tài năng.",
    image:
      "https://phenikaa-uni.edu.vn:3600/pu/vi/posts/elm5847-compressed.jpg",
    buttonText: "Tham gia ngay",
    buttonLink: "/events",
  },
  {
    id: 3,
    title: "Lễ hội Văn Hóa Quốc Tế",
    subtitle: "Khám phá đa dạng văn hóa thế giới",
    description:
      "Trải nghiệm ẩm thực, trang phục và truyền thống độc đáo từ khắp nơi trên thế giới.",
    image:
      "https://ims.baohoabinh.com.vn/NewsImg/4_2023/413_le-hoi-van-hoa-noi-tieng-tren-the-gioi-114982.jpg",
    buttonText: "Xem chi tiết",
    buttonLink: "/events",
  },
  {
    id: 4,
    title: "Workshop Khởi Nghiệp",
    subtitle: "Học hỏi từ các chuyên gia",
    description:
      "Phát triển kỹ năng kinh doanh và tư duy khởi nghiệp từ những người thành công.",
    image:
      "https://ancojsc.vn/wp-content/uploads/2022/05/z3424977788289_32b734c076c75adf84011c3032af76f5-1.jpg",
    buttonText: "Đăng ký ngay",
    buttonLink: "/events",
  },
];

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => handleNext(), 6000);
    return () => clearInterval(interval);
  }, [currentSlide]);

  const handleNext = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  const handlePrevious = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setCurrentSlide(
        (prev) => (prev - 1 + heroSlides.length) % heroSlides.length
      );
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  const goToSlide = (index: number) => {
    if (!isAnimating && index !== currentSlide) {
      setIsAnimating(true);
      setCurrentSlide(index);
      setTimeout(() => setIsAnimating(false), 700);
    }
  };

  return (
    <section className="relative h-[620px] md:h-[720px] overflow-hidden bg-gradient-to-br from-orange-100 via-orange-50 to-pink-50">
      {/* Background Images */}
      <div className="absolute inset-0">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-[1200ms] ease-in-out ${
              index === currentSlide
                ? "opacity-100 scale-100"
                : "opacity-0 scale-105"
            }`}
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />
          </div>
        ))}
      </div>

      {/* Floating decorative circles */}
      <div className="absolute top-16 right-10 w-36 h-36 bg-orange-300/20 rounded-full blur-3xl animate-float" />
      <div
        className="absolute bottom-20 left-10 w-48 h-48 bg-rose-400/20 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "1s" }}
      />

      {/* Content */}
      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            <div
              className={`transition-all duration-700 ${
                isAnimating
                  ? "opacity-0 translate-y-4"
                  : "opacity-100 translate-y-0"
              }`}
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-6 h-6 text-orange-400" />
                <span className="text-orange-200 font-semibold text-lg">
                  {heroSlides[currentSlide].subtitle}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 text-white leading-tight drop-shadow-lg">
                {heroSlides[currentSlide].title}
              </h1>

              <p className="text-lg md:text-xl mb-8 text-white/90 max-w-2xl leading-relaxed">
                {heroSlides[currentSlide].description}
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white px-8 py-6 text-lg rounded-2xl shadow-lg hover:shadow-orange-500/40 transition-all duration-300 hover:scale-105"
                  onClick={() =>
                    (window.location.href = heroSlides[currentSlide].buttonLink)
                  }
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  {heroSlides[currentSlide].buttonText}
                </Button>

                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 hover:border-white/40 px-8 py-6 text-lg rounded-2xl transition-all duration-300"
                  onClick={() => (window.location.href = "/events")}
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Xem tất cả
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        onClick={handlePrevious}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 hover:scale-110 group"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
      </Button>

      <Button
        onClick={handleNext}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-20 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white p-3 rounded-full transition-all duration-300 hover:scale-110 group"
        aria-label="Next slide"
      >
        <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
      </Button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {heroSlides.map((_, index) => (
          <Button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide
                ? "w-10 h-3 bg-gradient-to-r from-orange-500 to-pink-500 shadow-lg"
                : "w-3 h-3 bg-white/50 hover:bg-white/70"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
