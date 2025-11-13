import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import WalletHeader from "./WalletHeader";
import WalletBalance from "./WalletBalance";
import WalletInfo from "./WalletInfo";
import type { WalletCardProps } from "@/features/wallet/types/wallet";

export default function WalletCard({
  wallet,
  memberName,
  loading,
  numberFormatter,
}: WalletCardProps) {
  return (
    <div className="relative">
      <Card className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-300 shadow-lg">
        {/* Subtle pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(0,0,0,0.5) 1px, transparent 0)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Watermark logo */}
        <div className="pointer-events-none absolute right-4 top-4 select-none opacity-5">
          <Image
            src="/LogoRMBG.png"
            alt="SVH Events"
            width={120}
            height={120}
            priority
            className="object-contain"
          />
        </div>

        <CardContent className="p-6 md:p-8 relative z-10">
          <WalletHeader />
          <WalletBalance
            balance={wallet?.balance ?? null}
            currency={wallet?.currency || "VND"}
            loading={loading}
            numberFormatter={numberFormatter}
          />
          <WalletInfo
            memberName={memberName}
            ownerType={wallet?.ownerType}
          />
        </CardContent>
      </Card>
    </div>
  );
}

