"use client";

import dynamic from "next/dynamic";

const PartnerEventTable = dynamic(
  () => import("@/features/events/components/PartnerEventTable"),
  { ssr: false }
);

export default function PartnerEventPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <PartnerEventTable />
    </div>
  );
}
