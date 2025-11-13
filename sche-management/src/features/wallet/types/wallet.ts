export interface Wallet {
  id: number;
  userId: number;
  balance: number;
  currency: string;
  createdAt: string;
  updatedAt: string;
}

export interface WalletTransaction {
  id: number;
  walletId: number;
  type: "TRANSFER_IN" | "TRANSFER_OUT" | "REDEEM" | "ROLLBACK" | string;
  amount: number;
  description?: string;
  createdAt: string;
}

export interface TransferRequest {
  fromWalletId: number;
  toWalletId: number;
  amount: number;
  description?: string;
}

export interface RollbackRequest {
  transactionId: number;
  reason?: string;
}

export interface RedeemRequest {
  walletId: number;
  amount: number;
  productId?: number;
  description?: string;
}

export interface RequestWalletTopUpPartner {
  partnerId: string;
  amount: number;
}

export interface ResponseWalletTopUpPartner {
  id: number;
  walletId: number;
  counterpartyId: number;
  txnType: string;
  amount: number;
  referenceType: string;
  referenceId: number | null;
  createdAt: string;
}

// UI helper types
export interface WalletSummary {
  id: number;
  ownerType?: string;
  balance: number;
  currency: string;
}

export interface WalletCardProps {
  wallet: WalletSummary | null;
  memberName: string;
  loading: boolean;
  numberFormatter: Intl.NumberFormat;
}

export interface WalletBalanceProps {
  balance: number | null;
  currency: string;
  loading: boolean;
  numberFormatter: Intl.NumberFormat;
}

export interface WalletInfoProps {
  memberName: string;
  ownerType?: string;
}

export interface WalletHistoryItem {
  id: number;
  walletId: number;
  counterpartyId: number | null;
  txnType: string;
  amount: number;
  referenceType: string;
  referenceId: number | null;
  createdAt: string | null;
}

export interface TransactionHistoryProps {
  history: WalletHistoryItem[];
  historyLoading: boolean;
  historyPage: number;
  historySize: number;
  onPageChange: (page: number) => void;
  numberFormatter: Intl.NumberFormat;
}