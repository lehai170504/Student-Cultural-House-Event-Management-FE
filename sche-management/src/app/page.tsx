"use client";

import PublicNavbar from "@/components/PublicNavbar";
import HeroSection from "@/components/HeroSection";
import RewardsSection from "@/components/RewardsSection";
import EventCategoriesSection from "@/components/EventCategoriesSection";
import Image from "next/image";
import { useAuth } from "react-oidc-context";
import { useEffect, useState } from "react";

export default function Home() {
  const auth = useAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <HeroSection />

      {/* --- Rewards Section --- */}
      <RewardsSection />

      {/* --- Event Categories --- */}
      <EventCategoriesSection />

      {/* --- Membership Section --- */}
      <section id="membership" className="py-16 bg-gray-100">
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
              <a href="/card/register" className="inline-block px-6 py-3 bg-orange-500 text-white font-semibold rounded-lg shadow hover:bg-orange-600 transition">
                Đăng ký thẻ
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
