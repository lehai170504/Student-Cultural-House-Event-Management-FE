export interface CreateInvoice {
  studentId: string;
  productId: string;
  quantity: number;
}

export interface Invoice {
  invoiceId: number | string;
  studentId: number | string;
  studentName: string;
  productId: number | string;
  productTitle: string;
  productType: string;
  quantity: number;
  totalCost: number;
  currency: string;
  status: string;
  verificationCode: string;
  createdAt: string;
  deliveredAt: string | null;
  deliveredBy: string | null;
}

export interface ProductInvoiceMasked {
  id: number | string;
  type: string;
  title: string;
  description: string;
  unitCost: number;
  currency: string;
  totalStock: number;
  imageUrl: string;
  isActive: boolean;
  createdAt: string;
}

export interface TopProduct {
  productId: string;
  totalRedeem: number;
  title: string;
  totalCoins: number;
}

export interface InvoiceStats {
  topProducts: TopProduct[];
}