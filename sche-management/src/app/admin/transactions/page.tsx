// src/app/wallet/page.tsx
"use client";

import WalletTransactionTable from "@/features/wallet/components/WalletTransactionTable";

export default function WalletPage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 md:p-8">
      <WalletTransactionTable />
    </main>
  );
}
