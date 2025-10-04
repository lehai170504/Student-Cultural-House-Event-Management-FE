"use client";

import PublicNavbar from "@/components/PublicNavbar";
import HeroSection from "@/components/HeroSection";
import RewardsSection from "@/components/RewardsSection";
import EventCategoriesSection from "@/components/EventCategoriesSection";
import Image from "next/image";
import { useAuth } from "react-oidc-context";
import { UserProfile } from "@/components/UserProfile";
import Link from "next/link";

export default function Home() {
  const auth = useAuth();

  return (
    <main className="min-h-screen bg-gray-50">
      {/* --- Header with Auth --- */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-orange-600">
              Nhà Văn Hóa Sinh Viên
            </h1>
            <div className="flex items-center space-x-4">
              {auth.isAuthenticated ? (
                <UserProfile />
              ) : (
                <Link
                  href="/login"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
                >
                  Đăng nhập
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* --- Hero Banner --- */}
      <section className="relative bg-orange-500 text-white py-20">
        <div className="container mx-auto text-center px-6">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Chào mừng đến với Nhà Văn Hóa Sinh Viên
          </h2>
          <p className="text-lg md:text-xl mb-6">
            Nơi tổ chức sự kiện, giao lưu văn hóa và hoạt động cho sinh viên
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-white text-orange-600 font-semibold rounded-xl shadow hover:bg-gray-100 transition">
              Khám phá sự kiện
            </button>
            <Link
              href="/auth-demo"
              className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-orange-600 transition"
            >
              Demo Authentication
            </Link>
          </div>
        </div>
      </section>

      {/* --- Rewards Section --- */}
      <RewardsSection />

      {/* --- Event Categories --- */}
      <EventCategoriesSection />

      {/* --- Membership Section --- */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Thẻ Thành Viên & Tích Điểm
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Đăng ký thẻ thành viên để tham gia sự kiện dễ dàng hơn, tích điểm
            đổi quà và nhận nhiều ưu đãi dành riêng cho sinh viên.
          </p>
          <div className="flex justify-center">
            <div className="bg-white shadow-md rounded-xl p-6 max-w-sm">
              <Image
                src="https://source.unsplash.com/400x200/?idcard,student"
                alt="Membership Card"
                width={400}
                height={200}
                className="rounded-lg mb-4"
              />
              <h3 className="text-xl font-bold text-orange-600 mb-2">
                Student Member Card
              </h3>
              <p className="text-sm text-gray-600 mb-4">
                Sở hữu ngay thẻ thành viên để tích điểm mỗi khi tham gia sự kiện
                và đổi quà hấp dẫn.
              </p>
              <button className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition">
                Đăng ký thẻ
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
