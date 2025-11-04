"use client";

import PublicNavbar from "@/components/PublicNavbar";
import HeroSection from "@/components/HeroSection";
import RewardsSection from "@/components/RewardsSection";
import EventCategoriesSection from "@/components/EventCategoriesSection";
import RecommendedEventsModal from "@/components/RecommendedEventsModal";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <RecommendedEventsModal />
      <HeroSection />

      {/* --- Rewards Section --- */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <RewardsSection />
        </div>
      </section>

      {/* --- Event Categories --- */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <EventCategoriesSection />
        </div>
      </section>
    </main>
  );
}
