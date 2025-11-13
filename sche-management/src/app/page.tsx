"use client";

import PublicNavbar from "@/components/PublicNavbar";
import HeroSection from "@/components/HeroSection";
import RewardsSection from "@/components/RewardsSection";
import EventCategoriesSection from "@/components/EventCategoriesSection";
import RecommendedEventsModal from "@/components/RecommendedEventsModal";
import { useEffect, useState } from "react";

export default function Home() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen mt-20 bg-gray-50">
      <PublicNavbar />
      <RecommendedEventsModal />
      <HeroSection />
      <RewardsSection />
      <EventCategoriesSection />
     
    </main>
  );
}
