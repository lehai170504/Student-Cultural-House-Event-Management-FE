interface WalletBalanceProps {
  balance: number | null;
  currency: string;
  loading: boolean;
  numberFormatter: Intl.NumberFormat;
}

export default function WalletBalance({
  balance,
  currency,
  loading,
  numberFormatter,
}: WalletBalanceProps) {
  return (
    <div className="mb-8">
      <div className="text-sm font-medium text-slate-700 mb-2">Số dư hiện tại</div>
      <div className="text-4xl md:text-5xl font-bold text-slate-900">
        {loading ? "..." : numberFormatter.format(balance ?? 0)}
      </div>
      <div className="text-sm text-slate-600 mt-1">{currency || "VND"}</div>
    </div>
  );
}

