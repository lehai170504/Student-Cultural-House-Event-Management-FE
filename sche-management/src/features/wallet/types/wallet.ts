export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  currency: string;
  createdAt: string;
  ownerType?: "STUDENT" | "EVENT" | "ADMIN" | "PARTNER";
  walletId?: string;
}

export interface WalletTransaction {
  id: string;
  walletId: string;
  counterpartyId: string | null;
  txnType:
    | "TRANSFER_IN"
    | "TRANSFER_OUT"
    | "REDEEM"
    | "ROLLBACK"
    | "EVENT_FUNDING"
    | "ADMIN_TOPUP"
    | string;
  amount: number;
  referenceType?: string | null;
  referenceId?: string | null;
  createdAt: string | null;
}

export interface PaginationMeta {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalItems: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export type WalletTransactionResponse = PaginatedResponse<WalletTransaction>;

export interface TransferRequest {
  fromWalletId: string;
  toWalletId: string;
  amount: number;
  description?: string;
}

export interface RollbackRequest {
  transactionId: string;
  reason?: string;
}

export interface RedeemRequest {
  walletId: string;
  amount: number;
  productId?: string;
  description?: string;
}

export interface RequestWalletTopUpPartner {
  partnerId: string;
  amount: number;
}

export interface ResponseWalletTopUpPartner {
  id: string;
  walletId: string;
  counterpartyId: string;
  txnType: string;
  amount: number;
  referenceType: string;
  referenceId: string | null;
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