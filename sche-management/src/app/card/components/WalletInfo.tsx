interface WalletInfoProps {
  memberName: string;
  ownerType: string | undefined;
}

export default function WalletInfo({ memberName, ownerType }: WalletInfoProps) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-slate-300 shadow-sm">
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-slate-600 mb-1">Chủ ví</div>
          <div className="font-semibold text-slate-900">{memberName || "—"}</div>
        </div>
        <div>
          <div className="text-slate-600 mb-1">Loại tài khoản</div>
          <div className="font-semibold text-slate-900">{ownerType || "—"}</div>
        </div>
      </div>
    </div>
  );
}

