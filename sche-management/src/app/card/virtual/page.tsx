"use client";

import PublicNavbar from "@/components/PublicNavbar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMemo } from "react";
import Image from "next/image";

export default function VirtualCardPage() {
  const mock = useMemo(() => {
    return {
      memberName: "Nguyễn Văn A",
      university: "Đại học Khoa học Tự nhiên",
      faculty: "Công nghệ thông tin",
      cardNumber: "SCH 1234 5678 901",
      points: 1240,
      validThru: "12/27",
    };
  }, []);
  const numberFormatter = useMemo(() => new Intl.NumberFormat("vi-VN"), []);

  return (
    <main className="min-h-screen bg-gray-50">
      <PublicNavbar />
      <section className="container mx-auto px-4 md:px-6 py-10 md:py-16">
        <div className="max-w-3xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Thẻ thành viên ảo</h1>
            <p className="text-gray-600">Xem thông tin thẻ và điểm tích lũy của bạn.</p>
          </div>

          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 rounded-2xl blur opacity-30"></div>
            <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
              {/* diagonal light sheen */}
              <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rotate-12 bg-gradient-to-br from-white/10 via-white/5 to-transparent blur-2xl" />
              {/* subtle dot-grid pattern */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.08]"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
                  backgroundSize: "18px 18px",
                }}
              />
              {/* slow shimmer sweep */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -inset-y-10 -left-1/3 w-1/3 rotate-12 bg-gradient-to-r from-transparent via-white/12 to-transparent animate-[cardShimmer_10s_linear_infinite]" />
              </div>
              {/* watermark logo from public */}
              <div className="pointer-events-none absolute right-3 top-3 select-none">
                <Image src="/LogoRMBG.png" alt="SVH Events" width={120} height={120} priority className="object-contain" />
              </div>
              <CardContent className="p-6 md:p-8">
                <div className="flex items-start justify-between">
                  <div className="text-sm uppercase tracking-widest text-gray-300">Student Cultural House</div>
                </div>

                {/* chip + contactless */}
                <div className="mt-6 flex items-center gap-3">
                  <svg width="54" height="36" viewBox="0 0 54 36" xmlns="http://www.w3.org/2000/svg" className="drop-shadow">
                    <rect x="1" y="1" width="52" height="34" rx="6" fill="url(#grad)" stroke="#d4d4d8" strokeWidth="1" />
                    <defs>
                      <linearGradient id="grad" x1="0" y1="0" x2="54" y2="36" gradientUnits="userSpaceOnUse">
                        <stop stopColor="#eab308" />
                        <stop offset="1" stopColor="#f59e0b" />
                      </linearGradient>
                    </defs>
                    <rect x="10" y="10" width="12" height="2" fill="#78350f" opacity=".4" />
                    <rect x="10" y="16" width="24" height="2" fill="#78350f" opacity=".4" />
                    <rect x="10" y="22" width="18" height="2" fill="#78350f" opacity=".4" />
                  </svg>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/80">
                    <path d="M7 8c2.667 2 2.667 6 0 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M11 6c4 3 4 9 0 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <path d="M15 4c5.333 4 5.333 12 0 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </div>

                <div className="mt-10">
                  <div className="text-lg md:text-2xl font-semibold tracking-widest">
                    {mock.cardNumber}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div className="space-y-1">
                    <div className="text-gray-400">Chủ thẻ</div>
                    <div className="font-medium">{mock.memberName}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-400">Hiệu lực</div>
                    <div className="font-medium">{mock.validThru}</div>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <div className="text-gray-400">Trường / Khoa</div>
                    <div className="font-medium">{mock.university} • {mock.faculty}</div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  <div className="text-sm text-gray-300">Điểm thưởng</div>
                  <div className="text-2xl font-bold text-orange-400">{numberFormatter.format(mock.points)}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </main>
  );
}

{/* local keyframes for shimmer */}
<style jsx>{`
@keyframes cardShimmer {
  0% { transform: translateX(0); opacity: .0; }
  5% { opacity: .35; }
  50% { transform: translateX(250%); opacity: .2; }
  95% { opacity: .0; }
  100% { transform: translateX(250%); opacity: .0; }
}
`}</style>


