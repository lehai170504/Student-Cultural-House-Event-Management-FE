export type ProductType = "VOUCHER" | "MERCH" | "SERVICE" | "GIFT";

export interface Product {
  id: string;
  type: ProductType;
  title: string;
  description: string;
  unitCost: number;
  currency: "COIN";
  totalStock: number;
  imageUrl?: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface ProductMetadata {
  pageSize: number;
  totalItems: number;
  page: number;
}

export interface ProductListResponse {
  data: Product[];
  metadata: ProductMetadata;
}

export interface CreateProductData {
  type: ProductType;
  title: string;
  description: string;
  unitCost: number;
  totalStock: number;
  imageUrl?: string;
}

export interface CreateProductInput {
  productData: CreateProductData;
  imageFile: File | null;
}

export type UpdateProduct = Partial<CreateProductData>;

export type ProductReponse = Product;

export interface ProductOverviewAnalytics {
  averageRedeemPerStudent: number;
  totalRedeemed: number;
  totalProducts: number;
  totalInvoices: number;
  mostActivePartner: string;
}

export interface RedeemStatistics {
  topProducts: Product[];
  totalRedeems: number;
  totalCoinsSpent: number;
}
