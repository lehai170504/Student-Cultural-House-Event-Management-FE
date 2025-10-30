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
